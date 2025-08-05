package ai.docbrain.service.user;

import ai.docbrain.domain.BaseEntity;
import ai.docbrain.domain.company.Company;
import ai.docbrain.domain.jwt.ConfirmationToken;
import ai.docbrain.domain.role.Role;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.authentication.exceptions.EmailExistsException;
import ai.docbrain.service.authentication.jwt.ConfirmationTokenService;
import ai.docbrain.service.authentication.jwt.IConfirmationTokenRepository;
import ai.docbrain.service.company.ICompanyRepository;
import ai.docbrain.service.role.IRoleRepository;
import ai.docbrain.service.user.DTO.ProfileResponseDto;
import ai.docbrain.service.user.sendEmail.EmailData;
import ai.docbrain.service.user.sendEmail.EmailService;
import ai.docbrain.service.user.sendEmail.EmailType;

import ai.docbrain.service.utils.exception.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.*;


@Slf4j
//@AllArgsConstructor
@RequiredArgsConstructor
@Service
public class UserService {

    public final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final ICompanyRepository companyRepository;
    private final ConfirmationTokenService tokenService;
    private final IConfirmationTokenRepository confirmationTokenRepository;
    private final CacheManager cacheManager;
    private final UserServiceHelper userServiceHelper;

    @Value("${app.uploads.directory}")
    private String storagePath;
    @Value("${app.uploads.profilesBaseLink}")
    private String profilesBaseLink;

/**
* the function called on signup to create first user (SuperAdmin)
**/
    @Transactional
    public User createInactiveSuperAdmin(String fullName, String username, String email,
                                   String password, Company company, boolean twoFactorEnabled,
                                   boolean notificationsEnabled) {
        validateNewUser(email);
        Role superAdminRole = getSuperAdminRole();

        User user = User.builder()
                .fullName(fullName)
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .companyId(company.getId())
                .roles(Set.of(superAdminRole))
                .twoFactorEnabled(twoFactorEnabled)
                .notificationsEnabled(notificationsEnabled)
                .build();

        user.setStatusCode(BaseEntity.StatusCodes.INACTIVE);
        return userRepository.save(user, "SYSTEM");
    }

    private void validateNewUser(String email) {
        if (userRepository.findByEmail(email) != null) {
            throw new EmailExistsException("User with this email already exists");
        }
    }

    private Role getSuperAdminRole() {
        return roleRepository.findByName("SUPER_ADMIN")
                .orElseThrow(() -> new RuntimeException("SUPERADMIN role not found"));
    }


    /**
     * Assigns a role to exist user.
     *
     * @param email The email of the user.
     * @param roleId  The role to assign.
     * @return The updated user.
     */
    public User assignRoleToUser(String fullName, String email, Long roleId) {
        User user = userRepository.getUser(email);
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().add(role);
        return save(user, fullName);
    }

    // ---------------------------Employee creation methods--------------------------------
    /**
     * create Employee with choosing Role for the company by the superAdmin USER
     **/
    @Transactional
    public User createEmployee(User caller, User newEmployee, Set<Role> roles) throws IllegalAccessException {
       Set<Role> callerRoles = roleRepository.findByUserId(caller.getId());
        System.out.println("C-E Caller roles: " + callerRoles);

        validateCallerPermissions(callerRoles, "SUPER_ADMIN");
        System.out.println("after validation caller permissions: ");
        validateNewUser(newEmployee);
        System.out.println("after validation new user: " + newEmployee);
        validateRoles(roles, "CLIENT");
        System.out.println("after validation roles don't contain client: " + roles);

        String password = generateOrUsePassword(newEmployee.getPassword());
        System.out.println("generate password if not exits: " + password);
        newEmployee.setPassword(encodePassword(password));
        newEmployee.setRoles(roles);
        newEmployee.setCompanyId(caller.getCompanyId());
        System.out.println("newEmployee: " + newEmployee);
        User savedUser = save(newEmployee, caller.getFullName());
        sendWelcomeEmailToEmployee(newEmployee.getEmail(), password);
        return savedUser;

    }

    /**
     * Fetches all employees for the caller's company.
     *
     * @param caller The authenticated user making the request.
     * @return A collection of employees.
     */
    public Collection<User> fetchEmployees(User caller) throws IllegalAccessException {
        System.out.println("fetch Employee caller obj:  " + caller);
        System.out.println("before fetching from DB " + caller.getRoles());
        if (caller.getRoles().isEmpty()) {
            System.out.println("Roles are missing, refetching user from database...");
            caller = getUserById(caller.getId());
            System.out.println("After refetching, caller : " + caller);
            System.out.println("After refetching, caller roles: " + caller.getRoles());
        }
//        validateCallerPermissions(caller.getRoles(), "SUPER_ADMIN", "ADMIN");
        System.out.println("after validation caller permissions: ");
        return userRepository.findByCompanyIdAndRoleNotIn(caller.getCompanyId(), Set.of("CLIENT"));
    }

//---------------------------------Client creation methods--------------------------------
    @Transactional
    public User createClient(User caller, User newClient ) throws IllegalAccessException {
        Set<Role> callerRoles = roleRepository.findByUserId(caller.getId());
        validateCallerPermissions(callerRoles, "SUPER_ADMIN", "ADMIN");
        validateNewUser(newClient);

        String password = generateOrUsePassword(newClient.getPassword());
        newClient.setPassword(encodePassword(password));
        newClient.setRoles(Set.of(getRoleByName("CLIENT")));
        newClient.setCompanyId(caller.getCompanyId());

        Company company = companyRepository.findById(caller.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        User savedUser = save(newClient, caller.getFullName());
        sendWelcomeEmailToClient(newClient.getEmail(), password, company.getCompanyName());
        return savedUser;
    }

    public Collection<User> fetchClients(User caller) throws IllegalAccessException {
//        validateCallerPermissions(caller.getRoles(), "SUPER_ADMIN", "ADMIN");
        return userRepository.findByCompanyIdAndRoleName(caller.getCompanyId(), "CLIENT");
    }
//---------------------------------Edit method for Employee and Client --------------------------------
    @Transactional
    public User editUser(User caller, User oldUser, User newUser) throws IllegalAccessException {
        // Validate if the caller is allowed to edit the user
        validateCallerEditsAllowed(caller, oldUser);

        // Update only specific fields
        if (newUser.getFullName() != null) {
            oldUser.setFullName(newUser.getFullName());
        }
        if (newUser.getUsername() != null) {
            oldUser.setUsername(newUser.getUsername());
        }
        if (newUser.getEmail() != null) {
            oldUser.setEmail(newUser.getEmail());
        }
        if (newUser.getPhone() != null) {
            oldUser.setPhone(newUser.getPhone());
        }
        if (newUser.getProfilePicture() != null && newUser.getProfilePicture().startsWith("data:")) {
            System.out.println("Profile picture is provided");
            String base64Image = newUser.getProfilePicture().split(",")[1];
            byte[] imageData = Base64.getDecoder().decode(base64Image);
            System.out.println("Image data length: " + imageData.length);
            // Validate image size (example: max 2MB)
            if (imageData.length > 2 * 1024 * 1024) {
                throw new IllegalArgumentException("Profile picture is too large. Max size is 2MB.");
            }
            // Save file and update reference
            String fileName = saveProfilePicture(imageData, oldUser.getProfilePicture());
            oldUser.setProfilePicture(fileName);
            oldUser.setProfilePictureSize((long) imageData.length);
        }

        if (newUser.getJobTitle() != null) {
            oldUser.setJobTitle(newUser.getJobTitle());
        }
        if (newUser.getDateOfBirth() != null) {
            oldUser.setDateOfBirth(newUser.getDateOfBirth());
        }
        if (newUser.getTwoFactorEnabled() != null) {
            oldUser.setTwoFactorEnabled(newUser.getTwoFactorEnabled());
        }
        if (newUser.getNotificationsEnabled() != null) {
            oldUser.setNotificationsEnabled(newUser.getNotificationsEnabled());
        }
        // Handle password change
        if (newUser.getPassword() != null && !newUser.getPassword().isEmpty()) {
            boolean passwordChanged = !newUser.getPassword().equals(oldUser.getPassword());
            if (passwordChanged) {
                String newPassword = newUser.getPassword();
                oldUser.setPassword(encodePassword(newPassword));
                sendPasswordChangeConfirmation(oldUser.getEmail(), newPassword);
            }
        }
        // Save the updated user
//        return save(oldUser, caller.getFullName());
        return userServiceHelper.saveUserPreservingRoles(oldUser, caller.getFullName());
    }

    /**
     * Deletes a user.
     *
     * @param caller The user initiating the delete operation.
     * @param user   The user to delete.
     * @throws IllegalAccessException If the caller lacks permissions to delete the user.
     */
    @Transactional
    public void deleteUser(User caller, User user) throws IllegalAccessException {
        checkCallerEditsAllowed(caller, user);
        userRepository.softDelete(user, caller.getEmail());
    }
//---------------------------------Profile methods--------------------------------
    /**
     * Fetches the authenticated user's profile.
     *
     * @param callerId The authenticated user making the request.
     * @return The user's profile.
     */
    public ProfileResponseDto fetchProfile(Long callerId) {
        User user = getUserById(callerId);
        String PicturePath = profilesBaseLink +"/"+ user.getProfilePicture();
        return
                ProfileResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .jobTitle(user.getJobTitle())
                .dateOfBirth(user.getDateOfBirth())
                .profilePicture(PicturePath)
                .twoFactorEnabled(user.getTwoFactorEnabled())
                .notificationsEnabled(user.getNotificationsEnabled())
                .build();
    }

    /**
     * Updates a user's password.
     *
     * @param caller     The user initiating the update.
     * @param newPassword The new password.
     * @return The updated user.
     * @throws IllegalAccessException If the caller lacks permissions to update the user.
     */
    public User updateUserPassword(User caller, String newPassword) throws IllegalAccessException {
        User user = getUserById(caller.getId());
        checkCallerCreationAllowed(caller, user);

        user.setPassword(passwordEncoder.encode(newPassword));
        save(user, caller.getFullName());

        sendPasswordChangeConfirmation(user.getEmail(), newPassword);
        return user;
    }
    /**
     * Public method to save profile picture for external use (e.g., ProfileController)
     *
     * @param imageData The image data as byte array
     * @param oldFileName The old filename to delete (can be null)
     * @return The new filename
     */
    public String saveProfilePictureForUser(byte[] imageData, String oldFileName) {
        return saveProfilePicture(imageData, oldFileName);
    }

    private String saveProfilePicture(byte[] imageData, String oldFileName) {
        try {
            // Ensure the storage directory exists
            Path storageDir = Paths.get(storagePath);
            if (Files.notExists(storageDir)) {
                Files.createDirectories(storageDir);
            }
            System.out.println("Storage directory: " + storageDir);
            // Delete old file if it exists
            if (oldFileName != null) {
                Path oldFile = storageDir.resolve(oldFileName);
                Files.deleteIfExists(oldFile);
            }
            System.out.println("Old file deleted: " + oldFileName);
            // Generate unique filename
            String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ".jpg";
            Path filePath = storageDir.resolve(fileName);
            System.out.println("New file path: " + filePath);
            // Write image to file
            Files.write(filePath, imageData, StandardOpenOption.CREATE_NEW);
            System.out.println("File saved: " + fileName);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save profile picture", e);
        }
    }


//    ---------------------------Helper methods--------------------------------

    private void validateNewUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new IllegalArgumentException("User with this email already exists");
        }
    }

    private void validateCallerPermissions(Set<Role> callerRoles, String... allowedRoles) throws IllegalAccessException {
        boolean hasPermission = false;
        for (String role : allowedRoles) {
            if (hasRole(callerRoles, role)) {
                hasPermission = true;
                break;
            }
        }
        if (!hasPermission) {
            throw new IllegalAccessException("Caller lacks required permissions");
        }
    }

    private void validateRoles(Set<Role> roles, String... forbiddenRoles) throws IllegalAccessException {
        for (String forbidden : forbiddenRoles) {
            if (roles.stream().anyMatch(role -> role.getName().equals(forbidden))) {
                throw new IllegalAccessException("Invalid role assignment");
            }
        }
    }

    private void validateCallerEditsAllowed(User caller, User user) throws IllegalAccessException {
        // Allow users to edit their own profile
        if (caller.getId().equals(user.getId())) {
            return;
        }
        if (!getPermittedAssignableRoles(caller.getRoles()).containsAll(user.getRoles())) {
            throw new IllegalAccessException("Caller is not allowed to edit this user");
        }
    }

    private void validateCallerCreationAllowed(User caller, User user) throws IllegalAccessException {
        if (!getPermittedAssignableRoles(caller.getRoles()).containsAll(user.getRoles())) {
            throw new IllegalAccessException("Caller is not allowed to create a user with that role");
        }
    }

    /**
     * Checks if the caller is allowed to edit the target user.
     *
     * @param caller The user initiating the edit.
     * @param user   The user being edited.
     * @throws IllegalAccessException If the caller lacks permissions.
     */
    private void checkCallerEditsAllowed(User caller, User user) throws IllegalAccessException {
        if (!getPermittedAssignableRoles(caller.getRoles()).containsAll(user.getRoles())) {
            throw new IllegalAccessException("Caller is not allowed to edit this user");
        }
    }

    /**
     * Checks if the caller is allowed to create a user with the specified roles.
     *
     * @param caller The user initiating the creation.
     * @param user   The user being created.
     * @throws IllegalAccessException If the caller lacks permissions.
     */
    private void checkCallerCreationAllowed(User caller, User user) throws IllegalAccessException {
        if (!getPermittedAssignableRoles(caller.getRoles()).containsAll(user.getRoles())) {
            throw new IllegalAccessException("Caller is not allowed to create a user with that role");
        }
    }

    /**
     * Retrieves the roles that a caller is permitted to assign.
     *
     * @param callerRoles The roles of the caller.
     * @return A set of assignable roles.
     */
    public Set<Role> getPermittedAssignableRoles(Set<Role> callerRoles) {
        // Example logic: SUPERADMIN can assign any role, ADMIN can assign USER and VIEWER
        if (callerRoles.stream().anyMatch(role -> role.getName().equals("SUPER_ADMIN"))) {
            return Set.of(getRoleByName("ADMIN"), getRoleByName("SUPER_ADMIN"), getRoleByName("VIEWER"),getRoleByName("CLIENT"));
        } else if (callerRoles.stream().anyMatch(role -> role.getName().equals("ADMIN"))) {
            return Set.of(getRoleByName("ADMIN"), getRoleByName("VIEWER"),getRoleByName("CLIENT"));
        } else {
            return Collections.emptySet();
        }
    }

    private String generateOrUsePassword(String existingPassword) {
        return (existingPassword == null || existingPassword.isEmpty())
                ? UUID.randomUUID().toString().replace("-", "").substring(0, 10)
                : existingPassword;
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    private boolean hasRole(Set<Role> callerRoles , String roleName) {
        return callerRoles.stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }

    /**
     * Persists a user to the repository.
     *
     * @param user     The user to save.
     * @param userName The email of the user who created this user.
     * @return The saved user.
     */

    private User save (User user, String userName) {
        return userRepository.save(user, userName);
    }

    /**
     * Retrieves a user by email.
     * if not found throws an exception
     *
     * @param email The email of the user.
     * @return The user.
     */
    @Transactional(readOnly = true)
    public User getUser(String email) {
        return userRepository.getUser(email);
    }

    /**
     * Retrieves a user by id.
     * if not found throws an exception
     *
     * @param id The id of the user.
     * @return The user.
     */
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        try {
            // First try with findByIdWithRoles which explicitly fetches roles and permissions
            return userRepository.findByIdWithRoles(id);
        } catch (Exception e) {
            // Fall back to findById with EntityGraph
            return userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        }
    }
    /**
     * Retrieves a role by its name.
     *
     * @param name The name of the role.
     * @return The role.
     */
    private Role getRoleByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Role not found: " + name));
    }

    /**
     * Retrieves a role and permissions by Email or username.
     */
    public Set<String> getUserRoleNames(String username) {
        return userRepository.getUserRoleNames(username);
    }

    public Set<String> getUserPermissionNames(String username) {
        return userRepository.getUserPermissionNames(username);
    }
    /**
     * Retrieves a role by its roleIds.
     *
     * @param roleIds The ids of the roles.
     * @return The roles.
     */
    public Set<Role> getRolesByIds(Set<Long> roleIds) {
        return roleRepository.findByIds(roleIds);
    }

//--------------------------------------Email services--------------------------------------------------
    /**
     * Sends a welcome email to a SUPERADMIN without password.
     * and to an employee with password
     * also client with different email Template also with password
     * and other email services
     *
     * @param toEmail    The user's email.
     * .
     */
    public void sendWelcomeEmailToSuperAdmin(String toEmail) {
        emailService.sendEmail(new EmailData.Builder(toEmail, EmailType.WELCOME_SUPERADMIN)
                .addToContext("email", toEmail)
                .build());
    }

    public void sendWelcomeEmailToEmployee(String toEmail, String password) {
        emailService.sendEmail(new EmailData.Builder(toEmail, EmailType.WELCOME_EMPLOYEE)
                .addToContext("email", toEmail)
                .addToContext("password", password)
                .build());
    }

    public void sendWelcomeEmailToClient(String toEmail, String password, String companyName) {
        emailService.sendEmail(new EmailData.Builder(toEmail, EmailType.WELCOME_CLIENT)
                .addToContext("email", toEmail)
                .addToContext("password", password)
                .addToContext("companyName", companyName)
                .build());
    }
    public void sendVerificationEmail(User toUser ) {

        // Generate and save confirmation token
        String passcode = tokenService.generateUniquePasscode();
        ConfirmationToken confirmationToken = new ConfirmationToken(toUser, passcode);
        confirmationTokenRepository.save(confirmationToken);

        emailService.sendEmail(new EmailData.Builder(toUser.getEmail(), EmailType.VERIFICATION)
                .addToContext("fullName", toUser.getFullName())
                .addToContext("verificationCode", passcode)
                .addToContext("expirationMinutes", 15)
                .build());
    }

    public void sendPasswordChangeConfirmation(String toEmail, String fullName) {
        emailService.sendEmail(new EmailData.Builder(toEmail, EmailType.PASSWORD_CHANGE_CONFIRMATION)
                .addToContext("username", fullName)
                .addToContext("email", toEmail)
                .build());
    }
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        emailService.sendEmail(new EmailData.Builder(toEmail, EmailType.PASSWORD_RESET)
                .addToContext("username", toEmail)
                .addToContext("resetToken", resetToken)
                .addToContext("expirationHours", 24)
                .build());
    }
    public void sendAccountLockedEmail(String toEmail) {
        emailService.sendEmail(new EmailData.Builder(toEmail, EmailType.ACCOUNT_LOCKED)
                .addToContext("username", toEmail)
                .addToContext("supportEmail", "support@docbrain.com")
                .build());
    }

//    ----------------------------CACHE--------------------------------

    /**
     * Updates specific cache entries when a user is updated.
     *
     * @param user The updated user.
     */
    public void updateCaches(User user) {
        // Update specific cache entries if needed
        cacheManager.getCache("users").put(user.getId(), user);
        cacheManager.getCache("usersByCompany")
                .evict(user.getCompanyId()); // Evict company cache to refresh list
    }

    /**
     * Clears all caches periodically.
     */
    @Scheduled(fixedRate = 3600000) // Clear cache every hour
    public void clearCaches() {
        Arrays.asList("users", "userProfiles", "usersByCompany")
                .forEach(cacheName ->
                        cacheManager.getCache(cacheName).clear());
    }
}