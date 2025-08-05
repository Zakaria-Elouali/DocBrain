package ai.docbrain.service.role;

import ai.docbrain.domain.role.Permission;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PermissionService {

        private IPermissionRepository permissionRepository;

        public Permission createPermission(Permission permission) {
            return permissionRepository.save(permission);
        }

        public List<Permission> getAllPermissions() {
            return permissionRepository.findAll();
        }
}

