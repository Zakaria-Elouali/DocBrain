package ai.docbrain.service.role;

import ai.docbrain.domain.role.Permission;

import java.util.List;
import java.util.Optional;

public interface IPermissionRepository {
    List<Permission> findAll();

    Optional<Permission> getPermissionById(Long id);

    Permission save(Permission permission);

    void delete(Permission permission);
}
