package ai.docbrain.persistence.AI;

import ai.docbrain.domain.AI.ChatMessage;
import ai.docbrain.domain.AI.ChatSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageSpringRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatSessionOrderByTimestamp(ChatSession session);

    Page<ChatMessage> findByChatSession(ChatSession session, Pageable pageable);

    Page<ChatMessage> findByChatSessionId(Long sessionId, Pageable pageable);
}
