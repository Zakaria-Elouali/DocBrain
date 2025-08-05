package ai.docbrain.service.AI;

import ai.docbrain.domain.AI.ChatSession;

import java.util.List;
import java.util.Optional;

public interface IChatSessionRepository {
    ChatSession save(ChatSession chatSession);

    Optional<ChatSession> findById(Long id);

    Optional<ChatSession> findByDocumentAndUserId(Long documentId, Long userId);

    List<ChatSession> findByUserId(Long userId);

    Optional<ChatSession> findGeneralSessionByUserId(Long userId);
}
