package ai.docbrain.Controller.calendar;

import ai.docbrain.domain.users.User;
import ai.docbrain.service.calendar.AppointmentService;
import ai.docbrain.service.calendar.DTO.AppointmentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Fetch all appointments
    @GetMapping
    public List<AppointmentDTO> fetchAppointments(@ModelAttribute("caller") User caller) {
        return appointmentService.fetchAppointments(caller);
    }

    // Add a new appointment
    @PostMapping
    public AppointmentDTO addAppointment(@ModelAttribute("caller") User caller, @RequestBody AppointmentDTO appointment) {
        return appointmentService.addAppointment(caller, appointment);
    }

    // Edit an existing appointment
    @PutMapping("/{id}")
    public AppointmentDTO editAppointment(@ModelAttribute("caller") User caller, @PathVariable Long id, @RequestBody AppointmentDTO updatedAppointment) {
        return appointmentService.editAppointment(caller, id, updatedAppointment);
    }

    // Delete an appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@ModelAttribute("caller") User caller, @PathVariable Long id) {
        appointmentService.deleteAppointment(caller, id);
        return ResponseEntity.noContent().build();
    }
}