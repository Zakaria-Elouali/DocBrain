package ai.docbrain.persistence.users;

import ai.docbrain.domain.BaseEntity;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.user.IUserRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public class UserRepositoryImpl implements IUserRepository {

    private final UserSpringRepository userSpringRepository;

    public UserRepositoryImpl(UserSpringRepository userSpringRepository) {
        this.userSpringRepository = userSpringRepository;
    }

    @Override
    public User save(User user, String userName) {
        if (user.getId() == null) {
            user.setCreatedBy(userName);
        } else {
            user.setLastModifiedBy(userName);
        }
        return userSpringRepository.save(user);
    }

    @Override
    public User getUser(String email) {
        // First try with the query that explicitly fetches roles and permissions
        Optional<User> userWithRoles = userSpringRepository.findByEmailWithRolesAndPermissions(email);
        if (userWithRoles.isPresent()) {
            return userWithRoles.get();
        }

        // Fall back to the standard query
        return userSpringRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No user found with email: " + email));
    }

    @Override
    public Optional<User> findById(Long id) {
        return userSpringRepository.findById(id);
    }


    @Override
    public User findByEmail(String email) {
        return userSpringRepository.findByEmail(email).orElse(null);
    }

    @Override
    public Collection<User> getUsers() {
        return userSpringRepository.findAll();
    }

//    @Override
//    public Collection<User> findByCompany(Company company) {
//        return userSpringRepository.findByCompany(company);
//    }

    @Override
    public void delete(User user) {
        user.setStatusCode(BaseEntity.StatusCodes.INACTIVE);
        userSpringRepository.delete(user);
    }

    @Override
    public void softDelete(User user, String userName) {
        user.setFullName("(Cancelled) " + user.getFullName());
        user.setEmail("(Cancelled) " + user.getEmail());
        user.setStatusCode(BaseEntity.StatusCodes.INACTIVE);
        user.setLastModifiedBy(userName);
        userSpringRepository.save(user);
    }

    @Override
    public Set<String> getUserRoleNames(String username) {
        return userSpringRepository.findUserRoleNames(username);
    }

    @Override
    public Set<String> getUserPermissionNames(String username) {
        return userSpringRepository.findUserPermissionNames(username);
    }


    @Override
    @Transactional(readOnly = true)
    public Set<User> findByCompanyId(Long companyId) {
        return userSpringRepository.findByCompanyId(companyId);
    }

    @Override
    public User findByIdWithRoles(Long id) {
        return userSpringRepository.findByIdWithRoles(id)
                .orElseThrow(() -> new IllegalArgumentException("No user found with id: " + id));
    }

    @Override
    public Collection<User> findByCompanyIdAndRoleName(Long companyId, String roleName) {
        return userSpringRepository.findByCompanyIdAndRoleName(companyId, roleName);
    }

    @Override
    public Collection<User> findByCompanyIdAndRoleNotIn(Long companyId, Set<String> excludedRoles) {
        return userSpringRepository.findByCompanyIdAndRoleNotIn(companyId, excludedRoles);
    }

    @Override
    public List<Object[]> countUsersByRoleAndCompany(Long companyId) {
        return userSpringRepository.countUsersByRoleAndCompany(companyId);
    }
}