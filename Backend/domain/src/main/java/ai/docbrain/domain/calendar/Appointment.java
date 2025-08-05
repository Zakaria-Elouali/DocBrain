package ai.docbrain.domain.calendar;

import ai.docbrain.domain.company.Company;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_number")
    private String caseNumber;

    private String type; //should be Integer refer to an enum

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    private String time;
    private int duration;
    private String description;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Column(name = "company_id", nullable = false)
    private Long companyId; // Link to Company

    private String status;   //should be Integer refer to an enum
}