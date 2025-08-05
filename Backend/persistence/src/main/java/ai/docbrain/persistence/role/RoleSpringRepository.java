package ai.docbrain.persistence.role;

import ai.docbrain.domain.role.Role;
import ai.docbrain.service.role.DTO.RoleDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoleSpringRepository extends JpaRepository<Role, Long> {


    Optional<Role> findByName(String name);

    /**
     * Finds roles by their IDs.
     *
     * @param roleIds The set of role IDs to search for.
     * @return A set of roles matching the provided IDs.
     */
    @Query("SELECT r FROM Role r WHERE r.id IN :roleIds")
    Set<Role> findByIds(@Param("roleIds") Set<Long> roleIds);

    // Retrieve all roles
    @Query("SELECT new ai.docbrain.service.role.DTO.RoleDTO(r.id, r.name) FROM Role r")
    List<RoleDTO> findAllRoles();

    @Query("SELECT r FROM Role r JOIN r.users u WHERE u.id = :userId")
    Set<Role> findByUserId(@Param("userId") Long userId);

}
