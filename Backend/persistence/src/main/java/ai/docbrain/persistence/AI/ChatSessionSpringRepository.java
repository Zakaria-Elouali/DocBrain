package ai.docbrain.persistence.AI;

import ai.docbrain.domain.AI.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatSessionSpringRepository extends JpaRepository<ChatSession, Long> {

    Optional<ChatSession> findByDocument_IdAndUser_Id(Long documentId, Long userId);

    List<ChatSession> findByUserId(Long userId);

    @Query("SELECT cs FROM ChatSession cs WHERE cs.user.id = :userId AND cs.GeneralChat = true ORDER BY cs.lastActiveAt DESC")
    Optional<ChatSession> findGeneralSessionByUserId(@Param("userId") Long userId);
}
