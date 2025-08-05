package ai.docbrain.service.AI.DTO.aiModel;

import lombok.Data;

import java.util.List;

@Data
public class ProcessingCallbackRequestDto {
    private Long documentId;
    private String analysis;
    private String summary;
    private List<String> keywords;
}
