package ai.docbrain.service.AI.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@AllArgsConstructor
@Data
public class ChatMessageDto {
    private boolean userMessage;
    private String content;

}
