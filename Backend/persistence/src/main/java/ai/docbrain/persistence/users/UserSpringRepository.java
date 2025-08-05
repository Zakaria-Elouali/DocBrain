package ai.docbrain.persistence.users;

import ai.docbrain.domain.company.Company;
import ai.docbrain.domain.role.Role;
import ai.docbrain.domain.users.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserSpringRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.email = :usernameOrEmail OR u.username = :usernameOrEmail")
    Optional<User> findByEmailOrUsername(@Param("usernameOrEmail") String usernameOrEmail);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.companyId = :companyId")
    Set<User> findByCompanyId(Long companyId);

    @Query("SELECT r.name, COUNT(u) FROM User u JOIN u.roles r WHERE u.companyId = :companyId GROUP BY r.name")
    List<Object[]> countUsersByRoleAndCompany(@Param("companyId") Long companyId);


    // Query to get just role names
    @Query("SELECT r.name FROM User u JOIN u.roles r WHERE u.email = :email")
    Set<String> findUserRoleNames(@Param("email") String email);

    // Query to get just permission names
    @Query("SELECT DISTINCT p.name FROM User u " +
            "JOIN u.roles r " +
            "JOIN r.permissions p " +
            "WHERE u.email = :email")
    Set<String> findUserPermissionNames(@Param("email") String email);

//    it is used to get the user with roles | for now it is not used
//    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = :id")
//    Optional<User> findByIdWithRoles(@Param("id") Long id);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles r LEFT JOIN FETCH r.permissions WHERE u.id = :id")
    Optional<User> findByIdWithRoles(@Param("id") Long id);

    @EntityGraph(attributePaths = {"roles", "roles.permissions"})
    Optional<User> findById(Long id);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles r LEFT JOIN FETCH r.permissions WHERE u.email = :email")
    Optional<User> findByEmailWithRolesAndPermissions(@Param("email") String email);

//    --------------fetch Employee and Client -------------------

    /**
     * Finds users by company ID and specific role name.
     * Used for fetching clients (users with CLIENT role) within a company.
     *
     * @param companyId The company ID to filter users by
     * @param roleName The role name to filter users by
     * @return Collection of users matching the criteria
     */
    @Query("SELECT DISTINCT u FROM User u " +
            "JOIN u.roles r " +
            "WHERE u.companyId = :companyId " +
            "AND r.name = :roleName")
    Collection<User> findByCompanyIdAndRoleName(
            @Param("companyId") Long companyId,
            @Param("roleName") String roleName
    );

    /**
     * Finds users by company ID excluding specific roles.
     * Used for fetching employees (users without CLIENT role) within a company.
     *
     * @param companyId The company ID to filter users by
     * @param excludedRoles Set of role names to exclude from the results
     * @return Collection of users matching the criteria
     */
    @Query("SELECT DISTINCT u FROM User u " +
            "WHERE u.companyId = :companyId " +
            "AND NOT EXISTS (" +
            "    SELECT 1 FROM u.roles r " +
            "    WHERE r.name IN :excludedRoles" +
            ")")
    Collection<User> findByCompanyIdAndRoleNotIn(
            @Param("companyId") Long companyId,
            @Param("excludedRoles") Set<String> excludedRoles
    );

    /**
     * Alternative implementation using LEFT JOIN for finding employees.
     * This might perform better in some cases.
     */
    @Query("SELECT DISTINCT u FROM User u " +
            "LEFT JOIN u.roles r " +
            "WHERE u.companyId = :companyId " +
            "GROUP BY u " +
            "HAVING SUM(CASE WHEN r.name IN :excludedRoles THEN 1 ELSE 0 END) = 0")
    Collection<User> findEmployeesByCompanyId(
            @Param("companyId") Long companyId,
            @Param("excludedRoles") Set<String> excludedRoles
    );


}
