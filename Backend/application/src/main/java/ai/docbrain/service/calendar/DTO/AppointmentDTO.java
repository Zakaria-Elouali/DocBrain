package ai.docbrain.service.calendar.DTO;

import ai.docbrain.domain.calendar.Appointment;
import ai.docbrain.domain.calendar.Contact;
import lombok.Data;

import java.util.Date;

@Data
public class AppointmentDTO {
    private Long id;
    private String caseNumber;
    private String type;
    private Date date;
    private String time;
    private int duration;
    private String description;
    private ContactDTO contact;
    private String status;
    private Long companyId; // Added companyId

    // Custom constructor for DTO projection
    public AppointmentDTO(Long id, String caseNumber, String type, Date date, String time, int duration, String description,
                          Long contactId, String clientName, String phone, String email, String status, Long companyId) {
        this.id = id;
        this.caseNumber = caseNumber;
        this.type = type;
        this.date = date;
        this.time = time;
        this.duration = duration;
        this.description = description;
        this.contact = new ContactDTO(contactId, clientName, phone, email, companyId); // Initialize ContactDTO
        this.status = status;
        this.companyId = companyId; // Initialize companyId
    }

    // Convert Appointment entity to AppointmentDTO
    public static AppointmentDTO fromEntity(Appointment appointment) {
        if (appointment == null) {
            return null;
        }

        Contact contact = appointment.getContact();
        ContactDTO contactDTO = contact != null ? ContactDTO.fromEntity(contact) : null;

        return new AppointmentDTO(
                appointment.getId(),
                appointment.getCaseNumber(),
                appointment.getType(),
                appointment.getDate(),
                appointment.getTime(),
                appointment.getDuration(),
                appointment.getDescription(),
                contact != null ? contact.getId() : null,
                contact != null ? contact.getClientName() : null,
                contact != null ? contact.getPhone() : null,
                contact != null ? contact.getEmail() : null,
                appointment.getStatus(),
                appointment.getCompanyId() != null ? appointment.getCompanyId() : null // Added companyId
        );
    }

    // Convert AppointmentDTO to Appointment entity
    public Appointment toEntity() {
        Appointment appointment = new Appointment();
        appointment.setId(this.id);
        appointment.setCaseNumber(this.caseNumber);
        appointment.setType(this.type);
        appointment.setDate(this.date);
        appointment.setTime(this.time);
        appointment.setDuration(this.duration);
        appointment.setDescription(this.description);
        appointment.setContact(this.contact != null ? this.contact.toEntity() : null);
        appointment.setStatus(this.status);

        // The company field will be set by the service using the companyId
        return appointment;
    }
}