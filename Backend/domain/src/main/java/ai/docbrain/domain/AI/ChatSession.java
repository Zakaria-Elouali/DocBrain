package ai.docbrain.domain.AI;

import ai.docbrain.domain.fileManagement.Document;
import ai.docbrain.domain.users.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "chat_sessions")
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "session_name")
    private String sessionName;

    @Column(name = "is_general_chat", nullable = false)
    private boolean GeneralChat = false;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime createdAt;

    @Column(name = "last_active_at", columnDefinition = "TIMESTAMP")
    private LocalDateTime lastActiveAt;

    @OneToMany(mappedBy = "chatSession", cascade = CascadeType.ALL)
    private List<ChatMessage> messages;
}
