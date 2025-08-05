package ai.docbrain.service.AI.DTO;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SessionDto {
    private Long sessionId;
    private Long documentId;
    private String sessionName;
    private List<ChatResponseDto> messages;

}