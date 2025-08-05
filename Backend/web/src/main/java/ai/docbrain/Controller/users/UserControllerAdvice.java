package ai.docbrain.Controller.users;

import ai.docbrain.domain.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

//@SuppressFBWarnings("EI_EXPOSE_REP2")
@RequiredArgsConstructor
@ControllerAdvice
public class UserControllerAdvice {

    @ModelAttribute("caller")
    public User user(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof User) {
            User user = (User) auth.getPrincipal();
//            System.out.println("=== UserControllerAdvice ===");
//            System.out.println("User object: " + user);
//            System.out.println("Authentication object: " + auth);

//            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
//                System.out.println("Roles found: " + user.getRoles());
//            } else {
//                System.out.println("No roles found in user object");
//            }
//            System.out.println("=========================");
            return user;
        }
        return null;
    }
}

