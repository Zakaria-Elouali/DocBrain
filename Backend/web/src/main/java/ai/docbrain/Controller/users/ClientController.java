package ai.docbrain.Controller.users;

import ai.docbrain.domain.users.User;
import ai.docbrain.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final UserService userService;

    /**
     * Create a new client.
     *
     * @param caller The authenticated user making the request.
     * @param newClient The client details.
     * @return The created client.     */
    @PostMapping
    public ResponseEntity<User> createClient(
            @ModelAttribute("caller") User caller,
            @RequestBody User newClient) {
        try {
            User createdClient = userService.createClient(caller, newClient);
            return ResponseEntity.ok(createdClient);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(403).body(null); // Forbidden
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Bad Request
        }
    }

    /**
     * Update an existing client.
     *
     * @param caller The authenticated user making the request.
     * @param clientId The ID of the client to update.
     * @param updatedClient The updated client details.
     * @return The updated client.
     */
    @PutMapping("/{clientId}")
    public ResponseEntity<User> updateClient(
            @ModelAttribute("caller") User caller,
            @PathVariable Long clientId,
            @RequestBody User updatedClient) {
        try {
            User existingClient = userService.getUserById(clientId);
            User updated = userService.editUser(caller, existingClient, updatedClient);
            return ResponseEntity.ok(updated);
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(403).body(null); // Forbidden
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Bad Request
        }
    }

    /**
     * Delete a client.
     *
     * @param caller The authenticated user making the request.
     * @param clientId The ID of the client to delete.
     * @return A success message.
     */
    @DeleteMapping("/{clientId}")
    public ResponseEntity<String> deleteClient(
            @ModelAttribute("caller") User caller,
            @PathVariable Long clientId) {
        try {
            User client = userService.getUserById(clientId);
            userService.deleteUser(caller, client);
            return ResponseEntity.ok("Client deleted successfully");
        } catch (IllegalAccessException e) {
            return ResponseEntity.status(403).body("Forbidden"); // Forbidden
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Bad Request"); // Bad Request
        }
    }

    /**
     * Get a list of clients.
     *
     * @param caller The authenticated user making the request.
     * @return A list of clients.
     */
    @GetMapping
    public ResponseEntity<Collection<User>> getClients(@ModelAttribute("caller") User caller) {
        try {
            Collection<User> clients = userService.fetchClients(caller);
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Bad Request
        }
    }
}
