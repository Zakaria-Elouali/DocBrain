package ai.docbrain.persistence.role;

import ai.docbrain.domain.role.Role;
import ai.docbrain.service.role.DTO.RoleDTO;
import ai.docbrain.service.role.IRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;


@RequiredArgsConstructor
@Repository
public class RoleRepositoryImpl implements IRoleRepository {

    private final RoleSpringRepository roleSpringRepository;



    @Override
    public List<RoleDTO> findAllRoles() {
        return roleSpringRepository.findAllRoles();
    }

    @Override
    public Optional<Role> findById(Long id) {
        return roleSpringRepository.findById(id);
    }

    @Override
    public Set<Role> findByIds(Set<Long> roleIds) {
        return roleSpringRepository.findByIds(roleIds);
    }

    @Override
    public Optional<Role> findByName(String name) {
        return roleSpringRepository.findByName(name);
    }

    @Override
    public Role save(Role role) {
        return roleSpringRepository.save(role);
    }

    @Override
    public void delete(Role role) {
        roleSpringRepository.delete(role);
    }

    @Override
    public Set<Role> findByUserId(Long userId) {
        return roleSpringRepository.findByUserId(userId);
    }
}