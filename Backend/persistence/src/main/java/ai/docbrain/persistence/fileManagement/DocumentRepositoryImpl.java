package ai.docbrain.persistence.fileManagement;

import ai.docbrain.domain.fileManagement.Document;
import ai.docbrain.service.dashboard.DTO.StorageGrowthDTO;
import ai.docbrain.service.fileManagement.DTO.FileMetadataResponseDto;
import ai.docbrain.service.fileManagement.IDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class DocumentRepositoryImpl implements IDocumentRepository {

    private final DocumentSpringRepository documentSpringRepository;

    @Override
    public void save(Document document) {
        documentSpringRepository.save(document);
    }

    @Override
    public void delete(Document document) {
        documentSpringRepository.delete(document);
    }

    @Override
    public void deleteById(Long documentId) {
        documentSpringRepository.deleteById(documentId);
    }

    @Override
    public Optional<Document> findById(Long documentId) {
        return documentSpringRepository.findById(documentId);
    }

    @Override
    public Document findByName(String fileName) {
        return documentSpringRepository.findByName(fileName).orElse(null);
    }

    @Override
    public List<Document> getByCompanyIdAndFileId(Long companyId, Long fileId) {
        return documentSpringRepository.getByCompanyIdAndFileId(companyId, fileId);
    }

    @Override
    public List<Document> getByNameAndCompanyId(String name, Long companyId) {
        return documentSpringRepository.getByNameAndCompanyId(name, companyId);
    }

    @Override
    public List<Document> findAllByCompanyId(Long companyId) {
        return documentSpringRepository.findAllByCompanyId(companyId);
    }

    @Override
    public List<FileMetadataResponseDto> findMetadataByFolderIdAndCompanyId(Long folderId, Long companyId) {
        return documentSpringRepository.findMetadataByFolderIdAndCompanyId(folderId, companyId);
    }

    @Override
    public List<FileMetadataResponseDto> findAllMetadataByCompanyId(Long companyId) {
        return documentSpringRepository.findAllMetadataByCompanyId(companyId);
    }
//----------------------------for dashboard--------------------------------
    /**
     * Calculate total storage used by a company in bytes
     */
    @Override
    public Long calculateTotalStorageByCompanyId(Long companyId) {
        return documentSpringRepository.calculateTotalStorageByCompanyId(companyId);
    }

    /**
     * Get file type distribution statistics for a company
     */
    @Override
    public List<Object[]> getFileTypeRawDistribution(Long companyId) {
        return documentSpringRepository.getFileTypeRawDistribution(companyId);
    }

    /**
     * Count documents by company ID
     */
    @Override
    public int countByCompanyId(Long companyId) {
        return documentSpringRepository.countByCompanyId(companyId);
    }

    /**
     * Count documents by company ID and AI processing status
     */
    @Override
    public int countByCompanyIdAndAiProcessed(Long companyId, boolean aiProcessed) {
        return documentSpringRepository.countByCompanyIdAndAiProcessed(companyId, aiProcessed);
    }

    /**
     * Get storage growth over time
     * Note: This requires date functions which vary by database
     * This example uses PostgreSQL's date_trunc
     */
    @Override
    public List<StorageGrowthDTO> getStorageGrowthByCompanyId(Long companyId, ZonedDateTime startDate) {
        return documentSpringRepository.getStorageGrowthByCompanyId(companyId, startDate);
    }


}