package ai.docbrain.service.fileManagement;

import ai.docbrain.domain.fileManagement.DocumentActivityLog;

import java.util.List;

public interface IDocumentActivityLogRepository {
    void save(DocumentActivityLog documentActivityLog);

    List<DocumentActivityLog> findTop20ByCompanyIdOrderByTimestampDesc(Long companyId);
}
