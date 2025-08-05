package ai.docbrain.service.AI.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ChatRequestDto {
    private Long documentId;
    private String prompt;
}

