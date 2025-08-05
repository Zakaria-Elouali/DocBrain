package ai.docbrain.service.fileManagement;

import ai.docbrain.domain.fileManagement.Document;
import ai.docbrain.service.dashboard.DTO.StorageGrowthDTO;
import ai.docbrain.service.fileManagement.DTO.FileMetadataResponseDto;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface IDocumentRepository {
    void save(Document document);

    void delete(Document document);

    void deleteById(Long documentId);

    Optional<Document> findById(Long documentId);

    Document findByName(String fileName);


    List<Document> getByCompanyIdAndFileId(Long companyId, Long fileId);

    List<Document> getByNameAndCompanyId(String name, Long companyId);

    List<Document> findAllByCompanyId(Long companyId);

    List<FileMetadataResponseDto> findMetadataByFolderIdAndCompanyId(Long folderId, Long companyId);

    List<FileMetadataResponseDto> findAllMetadataByCompanyId(Long companyId);

    Long calculateTotalStorageByCompanyId(Long companyId);


    List<Object[]> getFileTypeRawDistribution(Long companyId);

    int countByCompanyId(Long companyId);

    int countByCompanyIdAndAiProcessed(Long companyId, boolean aiProcessed);

    List<StorageGrowthDTO> getStorageGrowthByCompanyId(Long companyId, ZonedDateTime startDate);
}
