package ai.docbrain.persistence.role;

import ai.docbrain.domain.role.Permission;
import ai.docbrain.service.role.IPermissionRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class PermissionRepositoryImpl implements IPermissionRepository {

    private final PermissionSpringRepository permissionSpringRepository;

    public PermissionRepositoryImpl(PermissionSpringRepository permissionSpringRepository) {
        this.permissionSpringRepository = permissionSpringRepository;
    }

    @Override
    public List<Permission> findAll() {
        return permissionSpringRepository.findAllPermissions();
    }

    @Override
    public Optional<Permission> getPermissionById(Long id) {
        return permissionSpringRepository.findById(id);
    }

    @Override
    public Permission save(Permission permission) {
        return permissionSpringRepository.save(permission);
    }

    @Override
    public void delete(Permission permission) {
        permissionSpringRepository.delete(permission);
    }
}
