package ai.docbrain.service.AI;

import ai.docbrain.domain.fileManagement.Document;
import ai.docbrain.service.AI.DTO.DocumentChunkDto;

import java.util.List;

public interface IDocumentChunkRepository {

    void saveAll(List<DocumentChunkDto> documentChunkDto, Document document);

    List<DocumentChunkDto> findByDocumentIdOrderByChunkOrder(Long documentId);
}
