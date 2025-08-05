package ai.docbrain.service.role;

import ai.docbrain.domain.role.Role;
import ai.docbrain.service.role.DTO.RoleDTO;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IRoleRepository {


    Role save(Role role);

    void delete(Role role);


    List<RoleDTO> findAllRoles();

    Optional<Role> findById(Long id);

    Set<Role> findByIds(Set<Long> roleIds);


    Optional<Role> findByName(String name);

    Set<Role> findByUserId(Long userId);
}
