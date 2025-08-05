package ai.docbrain.service.AI;

import ai.docbrain.domain.AI.ChatMessage;
import ai.docbrain.domain.AI.ChatSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IChatMessageRepository {
    ChatMessage save(ChatMessage chatMessage);

    List<ChatMessage> findByChatSessionOrderByTimestamp(ChatSession session);

    Page<ChatMessage> findByChatSession(ChatSession session, Pageable pageable);

    // Get the chat messages by sessionID
    Page<ChatMessage> findByChatSessionId(Long sessionId, Pageable pageable);
}
