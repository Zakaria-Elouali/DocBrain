package ai.docbrain.persistence.fileManagement;


import ai.docbrain.domain.fileManagement.Document;
import ai.docbrain.service.dashboard.DTO.StorageGrowthDTO;
import ai.docbrain.service.fileManagement.DTO.FileMetadataResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentSpringRepository extends JpaRepository<Document, Long> {

    Optional<Document> findByName(String fileName);

    Optional<Document> findById(Long documentId);



    // Find documents by company ID and file ID
    @Query("SELECT d FROM Document d WHERE d.companyId = :companyId AND d.id = :fileId")
    List<Document> getByCompanyIdAndFileId(
            @Param("companyId") Long companyId,
            @Param("fileId") Long fileId
    );

    // Find documents by name and company ID
    @Query("SELECT d FROM Document d WHERE d.name = :name AND d.companyId = :companyId")
    List<Document> getByNameAndCompanyId(
            @Param("name") String name,
            @Param("companyId") Long companyId
    );

    // Find all documents by company ID
    @Query("SELECT d FROM Document d WHERE d.companyId = :companyId")
    List<Document> findAllByCompanyId(@Param("companyId") Long companyId);

//
//    @Query("SELECT new ai.docbrain.service.fileManagement.DTO.FileMetadataResponseDto(" +
//            "d.id, d.name, d.type, d.path, d.size, d.folderId, d.companyId, d.tags, d.aiProcessed) " +
//            "FROM Document d " +
//            "WHERE d.folderId = :folderId AND d.companyId = :companyId")
//    List<FileMetadataResponseDto> findMetadataByFolderIdAndCompanyId(
//            @Param("folderId") Long folderId,
//            @Param("companyId") Long companyId
//    );


    // Find metadata for documents by folder ID and company ID
    @Query("SELECT new ai.docbrain.service.fileManagement.DTO.FileMetadataResponseDto(" +
            "d.id, d.name, d.type, d.path, d.size, d.folderId, d.companyId, d.tags, d.summary, d.keywords, d.accessedAt, d.lastModifiedAt, d.aiProcessed) " +
            "FROM Document d WHERE d.folderId = :folderId AND d.companyId = :companyId")
    List<FileMetadataResponseDto> findMetadataByFolderIdAndCompanyId(
            @Param("folderId") Long folderId,
            @Param("companyId") Long companyId
    );

    // Find metadata for all documents by company ID
    @Query("SELECT new ai.docbrain.service.fileManagement.DTO.FileMetadataResponseDto(" +
            "d.id, d.name, d.type, d.path, d.size, d.folderId, d.companyId, d.tags, d.summary, d.keywords, d.accessedAt, d.lastModifiedAt, d.aiProcessed) " +
            "FROM Document d WHERE d.companyId = :companyId")
    List<FileMetadataResponseDto> findAllMetadataByCompanyId(
            @Param("companyId") Long companyId
    );
//--------------------------------------FOR DASHBOARD--------------------------------------//
    /**
     * Calculate total storage used by a company in bytes
     */
    @Query("SELECT SUM(d.size) FROM Document d WHERE d.companyId = :companyId")
    Long calculateTotalStorageByCompanyId(@Param("companyId") Long companyId);

    /**
     * Get file type distribution statistics for a company
     */
//    @Query("SELECT new ai.docbrain.service.dashboard.DTO.FileTypeDistributionDTO(" +
//            "d.type, " +
//            "COUNT(d), " +
//            "SUM(d.size) / 1048576.0, " + // 1024 * 1024
//            "(COUNT(d) * 100.0) / (SELECT COUNT(doc) FROM Document doc WHERE doc.companyId = :companyId)) " +
//            "FROM Document d WHERE d.companyId = :companyId GROUP BY d.type")
//    List<FileTypeDistributionDTO> getFileTypeDistributionByCompanyId(@Param("companyId") Long companyId);
    @Query("SELECT d.type, COUNT(d), SUM(d.size) FROM Document d WHERE d.companyId = :companyId GROUP BY d.type")
    List<Object[]> getFileTypeRawDistribution(@Param("companyId") Long companyId);




    /**
     * Count documents by company ID
     */
    int countByCompanyId(Long companyId);

    /**
     * Count documents by company ID and AI processing status
     */
    int countByCompanyIdAndAiProcessed(Long companyId, boolean aiProcessed);




    /**
     * Get storage growth over time
     * Note: This requires date functions which vary by database
     * This example uses PostgreSQL's date_trunc
     */
    @Query("SELECT new ai.docbrain.service.dashboard.DTO.StorageGrowthDTO(" +
            "DATE_TRUNC('day', d.createdAt), " +
            "SUM(d.size) / (1024.0 * 1024.0)) " +
            "FROM Document d " +
            "WHERE d.companyId = :companyId AND d.createdAt >= :startDate " +
            "GROUP BY DATE_TRUNC('day', d.createdAt) " +
            "ORDER BY DATE_TRUNC('day', d.createdAt)")
    List<StorageGrowthDTO> getStorageGrowthByCompanyId(
            @Param("companyId") Long companyId,
            @Param("startDate") ZonedDateTime startDate);

}

