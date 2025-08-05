package ai.docbrain.service.user;

import ai.docbrain.domain.users.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of IUserFetchService
 * This service ensures users are fetched with roles properly loaded
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserFetchService {

    private final UserService userService;
    private final IUserFetchRepository userFetchRepository;
    
    /**
     * Get a user by ID with roles properly loaded
     * 
     * @param id The user ID
     * @return The user with roles loaded
     */

    @Transactional(readOnly = true)
    public User getUserWithRoles(Long id) {
        try {
            // First try to get the user with roles in a single query
            return userFetchRepository.getUserWithRoles(id);
        } catch (Exception e) {
            log.warn("Error loading user with roles in a single query: {}", e.getMessage());
            
            // Fall back to loading the user first, then loading roles separately
            User user = userService.getUserById(id);
            return userFetchRepository.loadRolesForUser(user);
        }
    }
    
    /**
     * Get a user by email with roles properly loaded
     * 
     * @param email The user email
     * @return The user with roles loaded
     */

    @Transactional(readOnly = true)
    public User getUserWithRolesByEmail(String email) {
        try {
            // Get the user from the service
            User user = userService.getUser(email);
            
            // Load roles for the user
            return userFetchRepository.loadRolesForUser(user);
        } catch (Exception e) {
            log.error("Error loading user with roles by email: {}", e.getMessage());
            throw new RuntimeException("Error loading user with roles by email", e);
        }
    }
    
    /**
     * Ensure roles are loaded for a user
     * 
     * @param user The user to load roles for
     * @return The user with roles loaded
     */

    @Transactional(readOnly = true)
    public User ensureRolesLoaded(User user) {
        return userFetchRepository.loadRolesForUser(user);
    }
}
