package ai.docbrain.Controller.role;

import ai.docbrain.domain.users.User;
import ai.docbrain.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class UserRoleController {

    private final UserService userService;

    /**
     * Assigns a role to a user.
     *
     * @param email The email of the user.
     * @param roleId The ID of the role to assign.
     * @return The updated user with the assigned role.
     */
    @PostMapping("/{email}/roles/{roleId}")
    public ResponseEntity<User> assignRoleToUser(
            @ModelAttribute("caller") User caller,
            @PathVariable String email,
            @PathVariable Long roleId
    ) {
        User updatedUser = userService.assignRoleToUser(caller.getFullName(), email, roleId);
        return ResponseEntity.ok(updatedUser);
    }
}