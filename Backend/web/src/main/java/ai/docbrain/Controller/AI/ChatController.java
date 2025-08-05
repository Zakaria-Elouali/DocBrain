package ai.docbrain.Controller.AI;

import ai.docbrain.domain.AI.ChatMessage;
import ai.docbrain.domain.AI.ChatSession;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.AI.ChatService;
import ai.docbrain.service.AI.DTO.ChatRequestDto;
import ai.docbrain.service.AI.DTO.ChatResponseDto;
import ai.docbrain.service.AI.DTO.SessionDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chat")
@Slf4j
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/withDocument")
    public ResponseEntity<ChatResponseDto> sendMessage(
            @ModelAttribute("caller") User caller,
            @RequestBody ChatRequestDto request) {
        try {
            log.info("Received chat message for document: {}", request.getDocumentId());

            ChatMessage response = chatService.sendMessage(
                    caller,
                    request.getDocumentId(),
                    request.getPrompt()
            );

            ChatResponseDto responseDto = ChatResponseDto.builder()
                    .messageId(response.getId())
                    .content(response.getContent())
                    .timestamp(response.getTimestamp())
                    .isUserMessage(response.getIsUserMessage())
                    .build();

            return ResponseEntity.ok(responseDto);

        } catch (Exception e) {
            log.error("Error processing chat message", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error processing chat message: " + e.getMessage()
            );
        }
    }

    @PostMapping("/general")
    public ResponseEntity<ChatResponseDto> sendGeneralMessage(
            @ModelAttribute("caller") User caller,
            @RequestBody Map<String, String> request) {
        try {
            log.info("Received general chat message");

            String prompt = request.get("prompt");
            if (prompt == null || prompt.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prompt cannot be empty");
            }

            ChatMessage response = chatService.sendGeneralMessage(caller, prompt);

            ChatResponseDto responseDto = ChatResponseDto.builder()
                    .messageId(response.getId())
                    .content(response.getContent())
                    .timestamp(response.getTimestamp())
                    .isUserMessage(response.getIsUserMessage())
                    .build();

            return ResponseEntity.ok(responseDto);

        } catch (Exception e) {
            log.error("Error processing general chat message", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error processing general chat message: " + e.getMessage()
            );
        }
    }
    @GetMapping("/messages/{documentId}")
    public ResponseEntity<List<ChatResponseDto>> getMessages(
            @ModelAttribute("caller") User caller,
            @PathVariable Long documentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<ChatMessage> messages = chatService.getDocumentMessages(
                    caller,
                    documentId,
                    page,
                    size
            );

            List<ChatResponseDto> messageDtos = messages.getContent().stream()
                    .map(msg -> ChatResponseDto.builder()
                            .sessionId(msg.getChatSession().getId())
                            .messageId(msg.getId())
                            .content(msg.getContent())
                            .timestamp(msg.getTimestamp())
                            .isUserMessage(msg.getIsUserMessage())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(messageDtos);

        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat history not found", e);
        }
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<SessionDto>> getUserSessions(
            @ModelAttribute("caller") User caller) {
        try {
            List<ChatSession> sessions = chatService.getUserChatSessions(caller.getId());

            List<SessionDto> sessionDtos = sessions.stream()
                    .map(session -> {
//                        List<ChatResponseDto> messages = session.getMessages().stream()
//                                .map(msg -> ChatResponseDto.builder()
//                                        .messageId(msg.getId())
//                                        .content(msg.getContent())
//                                        .timestamp(msg.getTimestamp())
//                                        .isUserMessage(msg.getIsUserMessage())
//                                        .build())
//                                .collect(Collectors.toList());

                        return SessionDto.builder()
                                .sessionId(session.getId())
                                .documentId(session.getDocument().getId())
                                .sessionName(session.getSessionName())
//                                .messages(messages)
                                .build();
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(sessionDtos);

        } catch (Exception e) {
            log.error("Error getting chat sessions", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error getting chat sessions: " + e.getMessage()
            );
        }
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<List<ChatResponseDto>> getSessionMessages(
            @ModelAttribute("caller") User caller,
            @PathVariable Long sessionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            Page<ChatMessage> messages = chatService.getSessionMessages(
                    caller,
                    sessionId,
                    page,
                    size
            );

            List<ChatResponseDto> messageDtos = messages.getContent().stream()
                    .map(msg -> ChatResponseDto.builder()
                            .sessionId(msg.getChatSession().getId())
                            .messageId(msg.getId())
                            .content(msg.getContent())
                            .timestamp(msg.getTimestamp())
                            .isUserMessage(msg.getIsUserMessage())
                            .build())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(messageDtos);

        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found", e);
        } catch (Exception e) {
            log.error("Error retrieving session messages", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving session messages: " + e.getMessage()
            );
        }
    }
}
