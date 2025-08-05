package ai.docbrain.persistence.users;

import ai.docbrain.domain.role.Role;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.user.IUserFetchRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implementation of IUserFetchRepository
 * This class provides methods to ensure roles are properly loaded for users
 */
@Repository
@RequiredArgsConstructor
public class UserFetchRepositoryImpl implements IUserFetchRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    /**
     * Loads roles for a user using a direct JPQL query
     * This method ensures that roles are properly loaded even if the standard JPA loading fails
     * 
     * @param user The user to load roles for
     * @return The user with roles loaded
     */
    @Override
    @Transactional(readOnly = true)
    public User loadRolesForUser(User user) {
        if (user == null || user.getId() == null) {
            return user;
        }
        
        // If roles are already loaded, return the user as is
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            return user;
        }
        
        // Use a direct JPQL query to load roles for the user
        String jpql = "SELECT r FROM Role r JOIN r.users u WHERE u.id = :userId";
        List<Role> roles = entityManager.createQuery(jpql, Role.class)
                .setParameter("userId", user.getId())
                .getResultList();
        
        // If roles were found, set them on the user
        if (!roles.isEmpty()) {
            user.setRoles(new HashSet<>(roles));
        } else {
            // If no roles were found, initialize an empty set
            user.setRoles(new HashSet<>());
        }
        
        return user;
    }
    
    /**
     * Loads a user with roles using a direct JPQL query
     * This method ensures that roles are properly loaded by using a single query
     * 
     * @param userId The ID of the user to load
     * @return The user with roles loaded
     */
    @Override
    @Transactional(readOnly = true)
    public User getUserWithRoles(Long userId) {
        // Use a direct JPQL query to load the user with roles in a single query
        String jpql = "SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :userId";
        User user = entityManager.createQuery(jpql, User.class)
                .setParameter("userId", userId)
                .getSingleResult();
        
        // If roles are null, initialize an empty set
        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }
        
        return user;
    }
    
    /**
     * Loads a user with roles and permissions using a direct JPQL query
     * This method ensures that roles and permissions are properly loaded by using a single query
     * 
     * @param userId The ID of the user to load
     * @return The user with roles and permissions loaded
     */
    @Override
    @Transactional(readOnly = true)
    public User getUserWithRolesAndPermissions(Long userId) {
        // Use a direct JPQL query to load the user with roles and permissions in a single query
        String jpql = "SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles r LEFT JOIN FETCH r.permissions WHERE u.id = :userId";
        User user = entityManager.createQuery(jpql, User.class)
                .setParameter("userId", userId)
                .getSingleResult();
        
        // If roles are null, initialize an empty set
        if (user.getRoles() == null) {
            user.setRoles(new HashSet<>());
        }
        
        return user;
    }
}
