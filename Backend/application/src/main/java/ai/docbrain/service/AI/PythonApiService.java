package ai.docbrain.service.AI;

import ai.docbrain.service.AI.DTO.aiModel.ChatModelRequestDto;
import ai.docbrain.service.AI.DTO.aiModel.ChatModelResponseDto;
import ai.docbrain.service.AI.DTO.aiModel.GeneralChatModelRequestDto;
import ai.docbrain.service.AI.DTO.aiModel.GeneralChatModelResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@RequiredArgsConstructor
@Service
public class PythonApiService {
    private final RestTemplate restTemplate;

    @Value("${python.service.url}")
    private String pythonApiBaseUrl;

    public String getChatResponse(ChatModelRequestDto chatModelRequestDto) {
        String url = pythonApiBaseUrl + "/api/v1/chat";

        try {
            ResponseEntity<ChatModelResponseDto> response = restTemplate.postForEntity(
                    url,
                    chatModelRequestDto,
                    ChatModelResponseDto.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody().getContent();
            } else {
                throw new RuntimeException("Failed to get response from Python API");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error calling Python API: " + e.getMessage(), e);
        }

    }

    public String getGeneralChatResponse(GeneralChatModelRequestDto generalChatModelRequestDto) {
        String url = pythonApiBaseUrl + "/api/v1/general";

        try {
//            send only the prompt
            ResponseEntity<GeneralChatModelResponseDto> response = restTemplate.postForEntity(
                    url,
                    generalChatModelRequestDto,
                    GeneralChatModelResponseDto.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody().getContent();
            } else {
                throw new RuntimeException("Failed to get response from Python API");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error calling Python API: " + e.getMessage(), e);

        }
    }
}