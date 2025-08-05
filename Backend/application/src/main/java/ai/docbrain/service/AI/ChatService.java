package ai.docbrain.service.AI;

import ai.docbrain.domain.AI.ChatMessage;
import ai.docbrain.domain.AI.ChatSession;
import ai.docbrain.domain.fileManagement.Document;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.AI.DTO.aiModel.ChatModelRequestDto;
import ai.docbrain.service.AI.DTO.ChatMessageDto;
import ai.docbrain.service.AI.DTO.DocumentChunkDto;
import ai.docbrain.service.AI.DTO.aiModel.GeneralChatModelRequestDto;
import ai.docbrain.service.fileManagement.IDocumentRepository;
import ai.docbrain.service.user.UserService;
import ai.docbrain.service.utils.EncryptionUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class ChatService {

    private final IChatSessionRepository chatSessionRepository;
    private final IChatMessageRepository chatMessageRepository;
    private final IDocumentChunkRepository documentChunkRepository;
    private final DocumentProcessingService documentProcessingService;
    private final IDocumentRepository documentRepository;
    private final PythonApiService pythonApiService;
    private final UserService userService;
    private final EncryptionUtil encryptionUtil;

    public ChatMessage sendMessage(User caller, Long documentId, String Prompt) {
        // First check if document exists and has been processed
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        // If document is not processed, send it for processing and wait
        if (!document.isAiProcessed()) {
            log.info("Document {} not processed. Sending for processing first...", documentId);
            documentProcessingService.sendDocumentForProcessing(documentId);

            // Wait for processing to complete with timeout
            int maxAttempts = 30; // 30 attempts with 2-second wait = max 1 minute wait
            int attempts = 0;

            while (!document.isAiProcessed() && attempts < maxAttempts) {
                try {
                    Thread.sleep(2000); // Wait 2 seconds between checks
                    attempts++;

                    // Refresh document from database to check updated status
                    document = documentRepository.findById(documentId)
                            .orElseThrow(() -> new EntityNotFoundException("Document not found"));

                    log.debug("Waiting for document processing... Attempt {}/{}", attempts, maxAttempts);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Interrupted while waiting for document processing", e);
                }
            }

            // Check if processing completed successfully
            if (!document.isAiProcessed()) {
                throw new RuntimeException("Document processing timed out or failed");
            }

            log.info("Document {} successfully processed. Continuing with chat...", documentId);
        }

        // Get or create chat session
        ChatSession session = getOrCreateChatSession(document, caller.getId());



        // Save user message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setChatSession(session);
        userMessage.setIsUserMessage(true);
        userMessage.setContent(Prompt);
        userMessage.setTimestamp(LocalDateTime.now());
        chatMessageRepository.save(userMessage);

        // Fetch document chunks
        List<DocumentChunkDto> chunkDtos = documentChunkRepository.findByDocumentIdOrderByChunkOrder(documentId);
        // Get AI response from Python API
        List<ChatMessageDto> previousMessages = getPreviousMessages(session);
        ChatModelRequestDto chatModelRequestDto = new ChatModelRequestDto(documentId, Prompt, previousMessages,chunkDtos);
        String aiResponse = pythonApiService.getChatResponse(chatModelRequestDto);

        // Save AI response
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setChatSession(session);
        aiMessage.setIsUserMessage(false);
        aiMessage.setContent(aiResponse);
        aiMessage.setTimestamp(LocalDateTime.now());

        // Update session last active time
        session.setLastActiveAt(LocalDateTime.now());
        chatSessionRepository.save(session);

        return chatMessageRepository.save(aiMessage);
    }

    private ChatSession getOrCreateChatSession(Document document, Long userId) {

        User user = userService.getUserById(userId);

        return chatSessionRepository.findByDocumentAndUserId(document.getId(), userId)
                .orElseGet(() -> {
                    ChatSession newSession = new ChatSession();
                    newSession.setDocument(document);
                    newSession.setUser(user);
                    newSession.setCreatedAt(LocalDateTime.now());
                    newSession.setLastActiveAt(LocalDateTime.now());
                    // Generate a session name based on document and timestamp
                    String sessionName = generateSessionName(document);
                    newSession.setSessionName(sessionName);
                    return chatSessionRepository.save(newSession);
                });
    }
    /**
     * Generates a descriptive name for a chat session
     */
    private String generateSessionName(Document document) {
        try {
            // Check for null document
            if (document == null || document.getName() == null) {
                return "Chat session - " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
            }

            // Safely decode and decrypt
            byte[] decodedBytes;
            try {
                decodedBytes = Base64.getDecoder().decode(document.getName());
            } catch (IllegalArgumentException e) {
                // Handle invalid Base64 input
                return "Chat session - " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
            }

            // Decrypt with exception handling
            byte[] decryptedFilenameBytes;
            try {
                decryptedFilenameBytes = encryptionUtil.decrypt(decodedBytes);
            } catch (Exception e) {
                // Handle decryption failure
                return "Chat session - " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
            }

            // Use UTF-8 explicitly when converting bytes to string
            String docName = new String(decryptedFilenameBytes, StandardCharsets.UTF_8);

            // Truncate document name if too long
            if (docName.length() > 30) {
                docName = docName.substring(0, 27) + "...";
            }

            // Format using document name and date
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM d, yyyy");
            String dateStr = LocalDateTime.now().format(formatter);

            return "Chat with: " + docName + " (" + dateStr + ")";
        } catch (Exception e) {
            // Fallback for any unexpected errors
            return "Chat session - " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
        }
    }

    private List<ChatMessageDto> getPreviousMessages(ChatSession session) {
        return chatMessageRepository.findByChatSessionOrderByTimestamp(session)
                .stream()
                .map(msg -> new ChatMessageDto(msg.getIsUserMessage(), msg.getContent()))
                .collect(Collectors.toList());
    }

//    ---------------------Document Messages---------------------
    public Page<ChatMessage> getDocumentMessages(User caller, Long documentId, int page, int size) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        ChatSession session = getOrCreateChatSession(document, caller.getId());
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        return chatMessageRepository.findByChatSession(session, pageable);
    }


    //   ---------------------User Chat Sessions---------------------
    public List<ChatSession> getUserChatSessions(Long userId) {
        // Fetch all sessions for this user, with their messages
        return chatSessionRepository.findByUserId(userId);
    }

//    ---------------------Chat Session Messages---------------------
    /**
     * Retrieves messages for a specific chat session
     *
     * @param caller The user requesting the messages
     * @param sessionId The ID of the chat session
     * @param page The page number (zero-based)
     * @param size The page size
     * @return A page of chat messages for the specified session
     * @throws EntityNotFoundException if the session doesn't exist or doesn't belong to the user
     */
    public Page<ChatMessage> getSessionMessages(User caller, Long sessionId, int page, int size) {
        // First verify the session exists and belongs to the user
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Chat session not found with id: " + sessionId));

        // Check if the session belongs to the user
        if (!session.getUser().getId().equals(caller.getId())) {
            throw new AccessDeniedException("User is not authorized to access this chat session");
        }

        // Create pageable request
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());

        // Retrieve the messages for this session
        return chatMessageRepository.findByChatSessionId(sessionId, pageable);
    }


    /**
     * Sends a general question message not related to any document
     *
     * @param user The user asking the question
     * @param prompt The user's question
     * @return The AI response message
     */
    public ChatMessage sendGeneralMessage(User user, String prompt) {
        // Create or get a general chat session (not tied to a document)
        ChatSession session = getOrCreateGeneralChatSession(user.getId());

        // Save user message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setChatSession(session);
        userMessage.setIsUserMessage(true);
        userMessage.setContent(prompt);
        userMessage.setTimestamp(LocalDateTime.now());
        chatMessageRepository.save(userMessage);

        // Get previous messages
        List<ChatMessageDto> previousMessages = getPreviousMessages(session);

        // Call the AI service for general questions
        GeneralChatModelRequestDto requestDto = new GeneralChatModelRequestDto(prompt, previousMessages);
        String aiResponse = pythonApiService.getGeneralChatResponse(requestDto);

        // Save AI response
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setChatSession(session);
        aiMessage.setIsUserMessage(false);
        aiMessage.setContent(aiResponse);
        aiMessage.setTimestamp(LocalDateTime.now());

        // Update session last active time
        session.setLastActiveAt(LocalDateTime.now());
        chatSessionRepository.save(session);

        return chatMessageRepository.save(aiMessage);
    }

    /**
     * Gets or creates a general chat session not tied to any document
     */
    private ChatSession getOrCreateGeneralChatSession(Long userId) {
        User user = userService.getUserById(userId);

        return chatSessionRepository.findGeneralSessionByUserId(userId)
                .orElseGet(() -> {
                    ChatSession newSession = new ChatSession();
                    newSession.setUser(user);
                    newSession.setDocument(null); // No document for general chat
                    newSession.setCreatedAt(LocalDateTime.now());
                    newSession.setLastActiveAt(LocalDateTime.now());
                    newSession.setSessionName("General Chat - " +
                            LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM d, yyyy")));
                    newSession.setGeneralChat(true); // Flag to identify general chat sessions
                    return chatSessionRepository.save(newSession);
                });
    }
}

