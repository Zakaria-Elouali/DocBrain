package ai.docbrain.service.role;

import ai.docbrain.domain.role.Role;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.role.DTO.RoleDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class RoleService {
        IRoleRepository roleRepository;

        public Role createRole(Role role) {
            return roleRepository.save(role);
        }

        public List<RoleDTO> getAllRoles() {
            return roleRepository.findAllRoles();
        }


    public boolean isClient(User user) {
        return user.getRoles().stream().anyMatch(role -> "CLIENT".equals(role.getName()));
    }

    public boolean isAdmin(User user) {
        return user.getRoles().stream().anyMatch(role -> "ADMIN".equals(role.getName()));
    }

    public boolean isSuperAdmin(User user) {
        return user.getRoles().stream().anyMatch(role -> "SUPER_ADMIN".equals(role.getName()));
    }

    public boolean isViewer(User user) {
        return user.getRoles().stream().anyMatch(role -> "VIEWER".equals(role.getName()));
    }
}
