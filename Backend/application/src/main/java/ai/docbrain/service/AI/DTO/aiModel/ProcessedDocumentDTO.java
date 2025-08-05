package ai.docbrain.service.AI.DTO.aiModel;

import ai.docbrain.service.AI.DTO.DocumentChunkDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// ProcessedDocumentDTO for receiving the complete response
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessedDocumentDTO {
    private Long documentId;
    private String summary;
    private String[] keywords;
//    private String analysis;
    private List<DocumentChunkDto> chunks;
}