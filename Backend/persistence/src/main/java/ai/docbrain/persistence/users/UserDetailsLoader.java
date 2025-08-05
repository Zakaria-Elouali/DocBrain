package ai.docbrain.persistence.users;

import ai.docbrain.domain.users.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public class UserDetailsLoader implements UserDetailsService {

    private final UserSpringRepository userSpringRepository;

    public UserDetailsLoader(UserSpringRepository userSpringRepository){
        this.userSpringRepository = userSpringRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
//        System.out.println("=== UserDetailsLoader.loadUserByUsername ===");
//        System.out.println("Loading user details for: " + usernameOrEmail);

        // Try to find by email with roles and permissions
        if (usernameOrEmail.contains("@")) {
            Optional<User> userWithRoles = userSpringRepository.findByEmailWithRolesAndPermissions(usernameOrEmail);
            if (userWithRoles.isPresent()) {
                User user = userWithRoles.get();
//                System.out.println("User found with explicit fetch: " + user.getEmail());
//                System.out.println("User object: " + user);
//                System.out.println("Roles size: " + (user.getRoles() != null ? user.getRoles().size() : "null"));

//                if (user.getRoles() != null && !user.getRoles().isEmpty()) {
////                    System.out.println("Roles found: " + user.getRoles());
//                    user.getRoles().forEach(role -> {
////                        System.out.println("Role: " + role.getName());
////                        System.out.println("Permissions size: " + (role.getPermissions() != null ? role.getPermissions().size() : "null"));
//                    });
//                } else {
//                    System.out.println("No roles found in user object");
//                }

                return user;
            }
        }

        // Fallback to standard method
        User user = userSpringRepository.findByEmailOrUsername(usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException(usernameOrEmail));

//        System.out.println("User found with standard method: " + user.getEmail());
//        System.out.println("User object: " + user);
//        System.out.println("Roles size: " + (user.getRoles() != null ? user.getRoles().size() : "null"));

        return user;
    }
}
