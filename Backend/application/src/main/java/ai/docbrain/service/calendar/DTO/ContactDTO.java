package ai.docbrain.service.calendar.DTO;

import ai.docbrain.domain.calendar.Contact;
import ai.docbrain.domain.company.Company;
import lombok.Data;

@Data
public class ContactDTO {
    private Long id;
    private String clientName;
    private String phone;
    private String email;
    private Long companyId; // Added companyId

    // Constructor for ContactDTO
    public ContactDTO(Long id, String clientName, String phone, String email, Long companyId) {
        this.id = id;
        this.clientName = clientName;
        this.phone = phone;
        this.email = email;
        this.companyId = companyId; // Initialize companyId
    }

    // Convert Contact entity to ContactDTO
    public static ContactDTO fromEntity(Contact contact) {
        if (contact == null) {
            return null;
        }
        return new ContactDTO(
                contact.getId(),
                contact.getClientName(),
                contact.getPhone(),
                contact.getEmail(),
                contact.getCompanyId() != null ? contact.getCompanyId() : null // Added companyId
        );
    }

    // Convert ContactDTO to Contact entity
    public Contact toEntity() {
        Contact contact = new Contact();
        contact.setId(this.id);
        contact.setClientName(this.clientName);
        contact.setPhone(this.phone);
        contact.setEmail(this.email);

        // The company field will be set by the service using the companyId
        return contact;
    }
}