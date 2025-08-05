package ai.docbrain.domain.fileManagement;

import ai.docbrain.domain.BaseEntity;
import ai.docbrain.domain.company.Company;
import ai.docbrain.domain.users.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Data
@Entity
@Table(name = "folders")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Folder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;


    @Column(name = "parent_id")
    private Long parentId; // Self-referencing for folder hierarchy

    @Column(name = "company_id", nullable = false)
    private Long companyId; // Associate folder with a company

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "folder_clients", // Join table for clients
            joinColumns = @JoinColumn(name = "folder_id"),
            inverseJoinColumns = @JoinColumn(name = "client_id")
    )
    private Set<User> clients; // Clients associated with this folder

    @Column(name = "type")
    private String type = "folder"; // Default value set to 'folder'

    @Column(name = "tags")
    private String tags; // Comma-separated tags for folder categorization

    @Column(name = "ai_suggested", nullable = true)
    private boolean aiSuggested = false; // Whether the folder was suggested by AI
}