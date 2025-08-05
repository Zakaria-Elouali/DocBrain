package ai.docbrain.persistence.fileManagement;

import ai.docbrain.domain.fileManagement.DocumentActivityLog;
import ai.docbrain.service.fileManagement.IDocumentActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class DocumentActivityLogRepositoryImpl implements IDocumentActivityLogRepository {

    private final DocumentActivityLogSpringRepository documentActivityLogSpringRepository;

    @Override
    public void save(DocumentActivityLog documentActivityLog) {
        documentActivityLogSpringRepository.save(documentActivityLog);
    }

    @Override
    public List<DocumentActivityLog> findTop20ByCompanyIdOrderByTimestampDesc(Long companyId) {
        return documentActivityLogSpringRepository.findTop20ByCompanyIdOrderByTimestampDesc(companyId);
    }

}
