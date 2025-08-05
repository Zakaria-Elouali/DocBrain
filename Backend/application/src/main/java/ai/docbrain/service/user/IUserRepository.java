package ai.docbrain.service.user;
import ai.docbrain.domain.company.Company;
import ai.docbrain.domain.role.Role;
import ai.docbrain.domain.users.User;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IUserRepository {

    User save(User user, String userName);

    User getUser(String email);

    Optional<User> findById(Long id);

    User findByEmail(String email);

    Collection<User> getUsers();

//    Collection<User> findByCompany(Company company);

    void delete(User user);

    void softDelete(User user, String userName);

    Set<String> getUserRoleNames(String username);

    Set<String> getUserPermissionNames(String username);

    Set<User> findByCompanyId(Long companyId);

    User findByIdWithRoles(Long id);

    Collection<User> findByCompanyIdAndRoleName(Long companyId, String roleName);

    Collection<User> findByCompanyIdAndRoleNotIn(Long companyId, Set<String> excludedRoles);

    List<Object[]> countUsersByRoleAndCompany(Long companyId);
}
