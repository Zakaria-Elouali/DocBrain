package ai.docbrain.Controller.users;

import ai.docbrain.domain.users.User;
import ai.docbrain.service.user.UserFetchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller to test fetching users with roles properly loaded
 */
@RestController
@RequestMapping("/api/users/test-fetch")
@RequiredArgsConstructor
@Slf4j
public class UserFetchTestController {

    private final UserFetchService userFetchService;
    
    /**
     * Get the current user with roles properly loaded
     * 
     * @param caller The authenticated user
     * @return The user with roles loaded
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUserWithRoles(@AuthenticationPrincipal User caller) {
        log.info("Loading roles for current user: {}", caller.getEmail());
        
        // Load the user with roles
        User userWithRoles = userFetchService.ensureRolesLoaded(caller);
        
        return ResponseEntity.ok(userWithRoles);
    }
    
    /**
     * Get a user by ID with roles properly loaded
     * 
     * @param id The user ID
     * @return The user with roles loaded
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserWithRoles(@PathVariable Long id) {
        log.info("Loading user with roles for ID: {}", id);
        
        try {
            // Get the user with roles
            User userWithRoles = userFetchService.getUserWithRoles(id);
            
            return ResponseEntity.ok(userWithRoles);
        } catch (Exception e) {
            log.error("Error loading user with roles: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get a user by email with roles properly loaded
     * 
     * @param email The user email
     * @return The user with roles loaded
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserWithRolesByEmail(@PathVariable String email) {
        log.info("Loading user with roles for email: {}", email);
        
        try {
            // Get the user with roles
            User userWithRoles = userFetchService.getUserWithRolesByEmail(email);
            
            return ResponseEntity.ok(userWithRoles);
        } catch (Exception e) {
            log.error("Error loading user with roles by email: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
