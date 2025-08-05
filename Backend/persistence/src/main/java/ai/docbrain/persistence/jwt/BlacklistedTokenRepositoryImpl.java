package ai.docbrain.persistence.jwt;

import ai.docbrain.domain.jwt.BlacklistedToken;

import ai.docbrain.service.authentication.jwt.IBlacklistedTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class BlacklistedTokenRepositoryImpl implements IBlacklistedTokenRepository {

    private final BlacklistedTokenSpringRepository blacklistedTokenSpringRepository;

    @Override
    @Transactional
    public <S extends BlacklistedToken> S save(S entity) {
        return blacklistedTokenSpringRepository.save(entity);
    }

    @Override
    @Transactional
    public Optional<BlacklistedToken> findByToken(String token) {
        return blacklistedTokenSpringRepository.findByToken(token);
    }

    @Override
    @Transactional
    public void deleteByExpirationBefore(LocalDateTime expirationDate) {
        blacklistedTokenSpringRepository.deleteByExpirationBefore(expirationDate);
    }

    @Override
    @Transactional
    public boolean existsByToken(String token) {
        return blacklistedTokenSpringRepository.existsByToken(token);
    }
}
