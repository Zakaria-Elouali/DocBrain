package ai.docbrain.Controller.users;

import ai.docbrain.domain.users.User;
import ai.docbrain.service.user.DTO.ProfileResponseDto;
import ai.docbrain.service.user.UserService;
import ai.docbrain.service.user.UserServiceHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    private final UserServiceHelper userServiceHelper;



    @GetMapping
    public ResponseEntity<ProfileResponseDto> getProfile(@AuthenticationPrincipal User caller) {
        ProfileResponseDto user = userService.fetchProfile(caller.getId());
        return ResponseEntity.ok(user);
    }
    /**
     * Update the authenticated user's profile.
     * This version bypasses the complex role validation for self-profile updates.
     *
     * @param caller The authenticated user making the request.
     * @param updatedUser The updated user details.
     * @return The updated user.
     */
    @PutMapping
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal User caller,
            @RequestBody User updatedUser) {
        try {
            // Ensure caller has roles loaded
            caller = userServiceHelper.ensureRolesLoaded(caller);

            // Get the existing user with roles properly loaded
            User existingUser = userService.getUserById(caller.getId());

            // Update only specific fields (same as in UserService.editUser)
            if (updatedUser.getFullName() != null) {
                existingUser.setFullName(updatedUser.getFullName());
            }
            if (updatedUser.getUsername() != null) {
                existingUser.setUsername(updatedUser.getUsername());
            }
            if (updatedUser.getEmail() != null) {
                existingUser.setEmail(updatedUser.getEmail());
            }
            if (updatedUser.getPhone() != null) {
                existingUser.setPhone(updatedUser.getPhone());
            }
            if (updatedUser.getJobTitle() != null) {
                existingUser.setJobTitle(updatedUser.getJobTitle());
            }
            if (updatedUser.getDateOfBirth() != null) {
                existingUser.setDateOfBirth(updatedUser.getDateOfBirth());
            }
            if (updatedUser.getTwoFactorEnabled() != null) {
                existingUser.setTwoFactorEnabled(updatedUser.getTwoFactorEnabled());
            }
            if (updatedUser.getNotificationsEnabled() != null) {
                existingUser.setNotificationsEnabled(updatedUser.getNotificationsEnabled());
            }

            // Handle profile picture separately - process base64 data and save as file
            if (updatedUser.getProfilePicture() != null && updatedUser.getProfilePicture().startsWith("data:")) {
                try {
                    String base64Image = updatedUser.getProfilePicture().split(",")[1];
                    byte[] imageData = java.util.Base64.getDecoder().decode(base64Image);

                    // Validate image size (max 2MB)
                    if (imageData.length > 2 * 1024 * 1024) {
                        return ResponseEntity.badRequest().body(null); // Image too large
                    }

                    // Save the image file and get the filename
                    String fileName = userService.saveProfilePictureForUser(imageData, existingUser.getProfilePicture());
                    existingUser.setProfilePicture(fileName);
                    existingUser.setProfilePictureSize((long) imageData.length);
                } catch (Exception e) {
                    // If profile picture processing fails, continue without it
                    System.err.println("Profile picture processing failed: " + e.getMessage());
                }
            }

            // Save the user with our helper method that preserves roles
            User updated = userServiceHelper.saveUserPreservingRoles(existingUser, caller.getFullName());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace(); // For debugging
            return ResponseEntity.badRequest().body(null); // Bad Request
        }
    }
//    @PutMapping
//    public ResponseEntity<User> updateProfile(
//            @AuthenticationPrincipal User caller,
//            @RequestBody User updatedUser) {
//        try {
//            User updated = userService.editUser(caller, caller, updatedUser);
//            return ResponseEntity.ok(updated);
//        } catch (IllegalAccessException e) {
//            return ResponseEntity.status(403).body(null); // Forbidden
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(null); // Bad Request
//        }
//    }

    /**
     * Change the authenticated user's password.
     *
     * @param caller The authenticated user making the request.
     * @param newPassword The new password.
     * @return A success message.
     */
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal User caller,
            @RequestParam String newPassword) {
        try {
            userService.updateUserPassword(caller, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to change password");
        }
    }
}
