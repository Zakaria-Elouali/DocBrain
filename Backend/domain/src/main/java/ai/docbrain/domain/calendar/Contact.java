package ai.docbrain.domain.calendar;

import ai.docbrain.domain.company.Company;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "client_name")
    private String clientName;
    private String phone;
    private String email;

    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;

    @Column(name = "company_id", nullable = false)
    private Long companyId; // Link to Company
}