package ai.docbrain.persistence.AI;

import ai.docbrain.domain.AI.ChatSession;
import ai.docbrain.service.AI.IChatSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class ChatSessionRepositoryImpl implements IChatSessionRepository {
    private final ChatSessionSpringRepository chatSessionSpringRepository;

    @Override
    @Transactional
    public ChatSession save(ChatSession chatSession) {
        chatSessionSpringRepository.save(chatSession);
        // Save the chat session
        return chatSession;
    }

    @Override
    public Optional<ChatSession> findById(Long id) {
        return chatSessionSpringRepository.findById(id);
        // Get the chat session by id
    }

    @Override
    public Optional<ChatSession> findByDocumentAndUserId(Long documentId, Long userId) {
        return chatSessionSpringRepository.findByDocument_IdAndUser_Id(documentId, userId);
    }

    @Override
    public List<ChatSession> findByUserId (Long userId) {
        return chatSessionSpringRepository.findByUserId(userId);
    }

    @Override
    public Optional<ChatSession> findGeneralSessionByUserId(Long userId) {
        return chatSessionSpringRepository.findGeneralSessionByUserId(userId);
    }
}
