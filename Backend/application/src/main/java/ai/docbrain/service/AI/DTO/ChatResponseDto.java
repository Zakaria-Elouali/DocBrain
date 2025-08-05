package ai.docbrain.service.AI.DTO;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ChatResponseDto {
    private Long sessionId;
    private Long messageId;
    private String content;
    private LocalDateTime timestamp;
    private boolean isUserMessage;
}
