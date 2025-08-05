package ai.docbrain.persistence.fileManagement;

import ai.docbrain.domain.fileManagement.DocumentActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentActivityLogSpringRepository extends JpaRepository<DocumentActivityLog, Long> {
    List<DocumentActivityLog> findTop20ByCompanyIdOrderByTimestampDesc(Long companyId);
}
