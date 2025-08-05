package ai.docbrain.service.authentication.jwt;

import ai.docbrain.domain.jwt.BlacklistedToken;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface IBlacklistedTokenRepository {

    @Transactional(readOnly = true)
    Optional<BlacklistedToken> findByToken(String token);

    @Transactional
    void deleteByExpirationBefore(LocalDateTime expirationDate);

    @Transactional(readOnly = true)
    boolean existsByToken(String token);

    @Transactional
    <S extends BlacklistedToken> S save(S entity);
}
