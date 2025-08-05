package ai.docbrain.service.calendar;

import ai.docbrain.domain.calendar.Appointment;
import ai.docbrain.domain.calendar.Contact;
import ai.docbrain.domain.company.Company;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.calendar.DTO.AppointmentDTO;
import ai.docbrain.service.company.ICompanyRepository;
import ai.docbrain.service.utils.exception.InvalidDataException;
import ai.docbrain.service.utils.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AppointmentService {

    private final IAppointmentRepository appointmentRepository;
    private final IContactRepository contactRepository;
    private final ICompanyRepository companyRepository; // Add this repository

    // Fetch all appointments for the caller's company
    public List<AppointmentDTO> fetchAppointments(User caller) {
        Long companyId = caller.getCompanyId();
        return appointmentRepository.findAllAppointmentsByCompanyId(companyId);
    }

    // Fetch a single appointment by ID for the caller's company
    public AppointmentDTO fetchAppointmentById(User caller, Long id) {
        Long companyId = caller.getCompanyId();
        return appointmentRepository.findAppointmentDtoByIdAndCompanyId(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
    }

    // Add a new appointment for the caller's company
    public AppointmentDTO addAppointment(User caller, AppointmentDTO appointmentDTO) {
        Long companyId = caller.getCompanyId();
        if (companyId == null) {
            throw new InvalidDataException("Company ID is required to create an appointment.");
        }
        // Convert DTO to Entity
        Appointment appointment = appointmentDTO.toEntity();

        // Set the company for the appointment
        appointment.setCompanyId(companyId);

        // Save the Contact first if it's not already saved
        if (appointment.getContact() != null && appointment.getContact().getId() == null) {
            // Set the company for the contact
            appointment.getContact().setCompanyId(companyId);
            contactRepository.save(appointment.getContact());
        }

        // Save the Appointment
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Convert the saved entity back to DTO
        return AppointmentDTO.fromEntity(savedAppointment);
    }

    // Edit an existing appointment for the caller's company
    public AppointmentDTO editAppointment(User caller, Long id, AppointmentDTO updatedAppointmentDTO) {
        Long companyId = caller.getCompanyId();
        if (companyId == null) {
            throw new InvalidDataException("Company ID is required to update an appointment.");
        }

        Optional<Appointment> existingAppointment = appointmentRepository.findAppointmentByIdAndCompanyId(id, companyId);
        if (existingAppointment.isPresent()) {
            Appointment appointment = existingAppointment.get();

            // Update fields from DTO
            appointment.setCaseNumber(updatedAppointmentDTO.getCaseNumber());
            appointment.setType(updatedAppointmentDTO.getType());
            appointment.setDate(updatedAppointmentDTO.getDate());
            appointment.setTime(updatedAppointmentDTO.getTime());
            appointment.setDuration(updatedAppointmentDTO.getDuration());
            appointment.setDescription(updatedAppointmentDTO.getDescription());

            // Update contact details
            if (updatedAppointmentDTO.getContact() != null) {
                Contact contact = updatedAppointmentDTO.getContact().toEntity();
                if (contact.getId() == null) {
                    // Set the company for the new contact
                    contact.setCompanyId(companyId);
                    contactRepository.save(contact);
                }
                appointment.setContact(contact);
            }

            appointment.setStatus(updatedAppointmentDTO.getStatus());

            // Save the updated Appointment
            Appointment savedAppointment = appointmentRepository.save(appointment);

            // Convert the saved entity back to DTO
            return AppointmentDTO.fromEntity(savedAppointment);
        } else {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
    }

    // Delete an appointment for the caller's company
    public void deleteAppointment(User caller, Long id) {
        Long companyId = caller.getCompanyId();
        Optional<Appointment> appointment = appointmentRepository.findAppointmentByIdAndCompanyId(id, companyId);
        if (appointment.isPresent()) {
            appointmentRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
    }
}