package ai.docbrain.service.AI.DTO.aiModel;

import ai.docbrain.service.AI.DTO.ChatMessageDto;
import ai.docbrain.service.AI.DTO.DocumentChunkDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class ChatModelRequestDto {
    private Long documentId;
    private String prompt;
    private List<ChatMessageDto> history;
    private List<DocumentChunkDto> chunks; // Added chunks to send to Python
}
