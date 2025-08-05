package ai.docbrain.persistence.AI;

import ai.docbrain.domain.AI.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentChunkSpringRepository extends JpaRepository<DocumentChunk, Long> {
    List<DocumentChunk> findByDocumentIdOrderByChunkOrder(Long documentId);
}
