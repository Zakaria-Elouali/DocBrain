package ai.docbrain.domain.fileManagement;

import ai.docbrain.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.ZonedDateTime;

@Table(name = "documents")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
public class Document extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "path", nullable = false)
    private String path;

    @Column(name = "size", nullable = false)
    private Long size;

    @Column(name = "folder_id")
    private Long folderId;

    @Column(name = "company_id", nullable = false)
    private Long companyId;


    @Column(name = "tags")
    private String tags;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "keywords")
    private String keywords;

    @Column(name = "vector_representation", columnDefinition = "bytea")
    private byte[] vectorRepresentation;

    @Column(name = "accessed_at")
    private ZonedDateTime accessedAt;

    @Column(name = "ai_processed", nullable = false)
    private boolean aiProcessed = false;

//    @Lob is used in postgres to store OID - Object Identifier
//    NOT BYTEA SO IT WAS CONFLICT WITH COLUMN DEFINITION
    @Column(name = "file_data", nullable = false, columnDefinition = "bytea")
    private byte[] fileData;
}
