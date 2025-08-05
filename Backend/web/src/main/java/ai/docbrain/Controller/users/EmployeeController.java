package ai.docbrain.Controller.users;

import ai.docbrain.domain.role.Role;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.user.DTO.EmployeeRequestDto;
import ai.docbrain.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Set;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final UserService userService;


    /**
     * Create a new employee.
     *
     * @param caller The authenticated user making the request.

     * @return The created employee.
     */
    @PostMapping
    public ResponseEntity<User> createEmployee(
            @ModelAttribute("caller") User caller,
            @RequestBody EmployeeRequestDto request) {
        try {
            Set<Role> roles = userService.getRolesByIds(request.roleIds);
            User createdEmployee = userService.createEmployee(caller, request.userData, roles);
            return ResponseEntity.ok(createdEmployee);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(403).body(null);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    /**
     * Update an existing employee.
     *
     * @param caller The authenticated user making the request.
     * @param employeeId The ID of the employee to update.
     * @param updatedEmployee The updated employee details.
     * @return The updated employee.
     */
    @PutMapping("/{employeeId}")
    public ResponseEntity<User> updateEmployee(
            @ModelAttribute("caller") User caller,
            @PathVariable Long employeeId,
            @RequestBody User updatedEmployee) {
        try {
            User existingEmployee = userService.getUserById(employeeId);
            User updated = userService.editUser(caller, existingEmployee, updatedEmployee);
            return ResponseEntity.ok(updated);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(403).body(null); // Forbidden
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Bad Request
        }
    }

    /**
     * Delete an employee.
     *
     * @param caller The authenticated user making the request.
     * @param employeeId The ID of the employee to delete.
     * @return A success message.
     */
    @DeleteMapping("/{employeeId}")
    public ResponseEntity<String> deleteEmployee(
            @ModelAttribute("caller") User caller,
            @PathVariable Long employeeId) {
        try {
            User employee = userService.getUserById(employeeId);
            userService.deleteUser(caller, employee);
            return ResponseEntity.ok("Employee deleted successfully");
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(403).body("Forbidden"); // Forbidden
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Bad Request"); // Bad Request
        }
    }

    /**
     * Get a list of employees.
     *
     * @param caller The authenticated user making the request.
     * @return A list of employees.
     */
    @GetMapping
    public ResponseEntity<Collection<User>> getEmployees(@ModelAttribute("caller") User caller) {
        try {
            Collection<User> employees = userService.fetchEmployees(caller);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Bad Request
        }
    }
}
