package ai.docbrain.persistence.AI;

import ai.docbrain.domain.AI.DocumentChunk;
import ai.docbrain.domain.fileManagement.Document;
import ai.docbrain.service.AI.DTO.DocumentChunkDto;
import ai.docbrain.service.AI.IDocumentChunkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Repository
public class DocumentChunkRepositoryImpl implements IDocumentChunkRepository {
    private final DocumentChunkSpringRepository documentChunkSpringRepository;


    @Override
    public void saveAll(List<DocumentChunkDto> documentChunkDto, Document document) {
        List<DocumentChunk> documentChunks = documentChunkDto.stream()
                .map(chunk -> DocumentChunk.builder()
                        .id(chunk.getId())
                        .document(document)
                        .content(chunk.getContent())
                        .chunkOrder(chunk.getChunkOrder())
                        .embedding(chunk.getEmbedding())
                        .build())
                .collect(Collectors.toList());
        List<DocumentChunk> savedDocumentChunks = documentChunkSpringRepository.saveAll(documentChunks);
    }

    @Override
    public List<DocumentChunkDto> findByDocumentIdOrderByChunkOrder(Long documentId) {
        List<DocumentChunk> documentChunks = documentChunkSpringRepository.findByDocumentIdOrderByChunkOrder(documentId);
        return documentChunks.stream()
                .map(chunk -> DocumentChunkDto.builder()
                        .id(chunk.getId())
                        .content(chunk.getContent())
                        .chunkOrder(chunk.getChunkOrder())
                        .embedding(chunk.getEmbedding())
                        .build())
                .collect(Collectors.toList());
    }

}
