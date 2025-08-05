package ai.docbrain.persistence.jwt;

import ai.docbrain.domain.jwt.ConfirmationToken;

import ai.docbrain.service.authentication.jwt.IConfirmationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@RequiredArgsConstructor
@Repository
public class ConfirmationTokenRepositoryImpl implements IConfirmationTokenRepository {

    private final ConfirmationTokenSpringRepository confirmationTokenSpringRepository;

    @Override
    public boolean existsByConfirmationToken(String confirmationToken) {
        return confirmationTokenSpringRepository.existsByConfirmationToken(confirmationToken);
    }

    @Override
    public ConfirmationToken findByConfirmationTokenAndUserEmail(String confirmationToken, String email) {
        return confirmationTokenSpringRepository.findByConfirmationTokenAndUserEmail(confirmationToken, email);
    }

    @Override
    public ConfirmationToken save(ConfirmationToken confirmationToken) {
        return confirmationTokenSpringRepository.save(confirmationToken);
    }

    @Override
    public void delete(ConfirmationToken confirmationToken) {
        confirmationTokenSpringRepository.delete(confirmationToken);
    }
}
