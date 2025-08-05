package ai.docbrain.service.user;

import ai.docbrain.domain.role.Role;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.role.IRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

/**
 * Helper class for UserService to handle specific operations
 * This avoids modifying the existing UserService class
 */
@Component
@RequiredArgsConstructor
public class UserServiceHelper {

    private final IRoleRepository roleRepository;
    private final IUserRepository userRepository;

    /**
     * Safely updates a user while preserving their roles
     * This method ensures that roles are not duplicated or lost during updates
     *
     * @param user The user to update
     * @param updatedBy The name of the user performing the update
     * @return The updated user
     */
    @Transactional
    public User saveUserPreservingRoles(User user, String updatedBy) {
        // If the user already exists, we need to handle roles carefully
        if (user.getId() != null) {
            // Get the current user from database with roles properly loaded
            User existingUser = userRepository.findByIdWithRoles(user.getId());

            // Copy the profile fields from the updated user to the existing user
            // This preserves the existing user's role collection and avoids Hibernate collection issues
            copyProfileFields(user, existingUser);

            // Save the existing user (with preserved roles) that has the updated profile fields
            return userRepository.save(existingUser, updatedBy);
        } else {
            // For new users, save as normal
            return userRepository.save(user, updatedBy);
        }
    }

    /**
     * Copies profile-related fields from source user to target user
     * This method only copies fields that should be updated during profile updates
     * and avoids touching the roles collection
     *
     * @param sourceUser The user with updated profile information
     * @param targetUser The existing user from database
     */
    private void copyProfileFields(User sourceUser, User targetUser) {
        if (sourceUser.getFullName() != null) {
            targetUser.setFullName(sourceUser.getFullName());
        }
        if (sourceUser.getPhone() != null) {
            targetUser.setPhone(sourceUser.getPhone());
        }
        if (sourceUser.getJobTitle() != null) {
            targetUser.setJobTitle(sourceUser.getJobTitle());
        }
        if (sourceUser.getDateOfBirth() != null) {
            targetUser.setDateOfBirth(sourceUser.getDateOfBirth());
        }
        if (sourceUser.getProfilePicture() != null) {
            targetUser.setProfilePicture(sourceUser.getProfilePicture());
        }
        if (sourceUser.getProfilePictureSize() != null) {
            targetUser.setProfilePictureSize(sourceUser.getProfilePictureSize());
        }
        if (sourceUser.getTwoFactorEnabled() != null) {
            targetUser.setTwoFactorEnabled(sourceUser.getTwoFactorEnabled());
        }
        if (sourceUser.getNotificationsEnabled() != null) {
            targetUser.setNotificationsEnabled(sourceUser.getNotificationsEnabled());
        }
        // Note: We intentionally do NOT copy roles, password, email, username, companyId
        // as these should not be changed during profile updates
    }
    
    /**
     * Ensures that a user has their roles properly loaded
     * 
     * @param user The user to check
     * @return The user with roles loaded
     */
    @Transactional(readOnly = true)
    public User ensureRolesLoaded(User user) {
        if (user == null) {
            return null;
        }
        
        // If roles are empty, try to load them from the database
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Set<Role> roles = roleRepository.findByUserId(user.getId());
            if (roles != null && !roles.isEmpty()) {
                user.setRoles(roles);
            }
        }
        
        return user;
    }
}
