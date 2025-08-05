package ai.docbrain.service.AI.DTO.aiModel;

import ai.docbrain.service.AI.DTO.ChatMessageDto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GeneralChatModelRequestDto {
    private String prompt;
    private List<ChatMessageDto> history;
}
