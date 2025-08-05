package ai.docbrain.persistence.jwt;

import ai.docbrain.domain.jwt.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface BlacklistedTokenSpringRepository extends JpaRepository<BlacklistedToken, Long> {

    Optional<BlacklistedToken> findByToken(String token);

//    void deleteByExpirationBefore(LocalDateTime now);

    boolean existsByToken(String token);

    @Modifying
    @Query("DELETE FROM BlacklistedToken b WHERE b.expiration <= :expirationDate")
    void deleteByExpirationBefore(@Param("expirationDate") LocalDateTime expirationDate);
}
