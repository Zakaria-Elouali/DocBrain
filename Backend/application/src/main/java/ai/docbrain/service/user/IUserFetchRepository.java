package ai.docbrain.service.user;

import ai.docbrain.domain.users.User;

/**
 * Interface for repository operations to fetch users with roles properly loaded
 */
public interface IUserFetchRepository {
    
    /**
     * Loads roles for a user
     * This method ensures that roles are properly loaded even if the standard JPA loading fails
     * 
     * @param user The user to load roles for
     * @return The user with roles loaded
     */
    User loadRolesForUser(User user);
    
    /**
     * Loads a user with roles using a direct query
     * This method ensures that roles are properly loaded by using a single query
     * 
     * @param userId The ID of the user to load
     * @return The user with roles loaded
     */
    User getUserWithRoles(Long userId);
    
    /**
     * Loads a user with roles and permissions using a direct query
     * This method ensures that roles and permissions are properly loaded by using a single query
     * 
     * @param userId The ID of the user to load
     * @return The user with roles and permissions loaded
     */
    User getUserWithRolesAndPermissions(Long userId);
}
