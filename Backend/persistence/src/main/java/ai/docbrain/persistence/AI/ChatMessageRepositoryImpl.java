package ai.docbrain.persistence.AI;

import ai.docbrain.domain.AI.ChatMessage;
import ai.docbrain.domain.AI.ChatSession;
import ai.docbrain.service.AI.IChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class ChatMessageRepositoryImpl implements IChatMessageRepository {
    private final ChatMessageSpringRepository chatMessageSpringRepository;

    @Override
    @Transactional
    public ChatMessage save(ChatMessage chatMessage) {
        chatMessageSpringRepository.save(chatMessage);
        // Save the chat message
        return chatMessage;
    }

    @Override
    public List<ChatMessage> findByChatSessionOrderByTimestamp(ChatSession session) {
        return chatMessageSpringRepository.findByChatSessionOrderByTimestamp(session);
        // Get the chat messages
    }

    @Override
    public Page<ChatMessage> findByChatSession(ChatSession session, Pageable pageable) {
        return chatMessageSpringRepository.findByChatSession(session, pageable);
    }

    // Get the chat messages by sessionID
    @Override
    public Page<ChatMessage> findByChatSessionId(Long sessionId, Pageable pageable) {
        return chatMessageSpringRepository.findByChatSessionId(sessionId, pageable);
    }
}
