package ai.docbrain.domain.company;

import ai.docbrain.domain.BaseEntity;
import ai.docbrain.domain.fileManagement.Document;
import ai.docbrain.domain.fileManagement.Folder;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "companies")
@Builder
public class Company extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "activity", nullable = true)
    private String activity;

    @Column(name = "ice", unique = true, nullable = true)
    private String ice; //ICE (Identifiant Commun de l’Entreprise) is a unique identifier for companies

    @Column(name = "fiscal_id", unique = true, nullable = true)
    private String fiscalId;

    @Column(name = "rc_city", nullable = true)
    private String rcCity;

    @Column(name = "professional_tax", nullable = true)
    private Double professionalTax;

}
