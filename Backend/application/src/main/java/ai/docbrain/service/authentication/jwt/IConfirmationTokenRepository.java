package ai.docbrain.service.authentication.jwt;

import ai.docbrain.domain.jwt.ConfirmationToken;

public interface IConfirmationTokenRepository {
    boolean existsByConfirmationToken(String confirmationToken);

    ConfirmationToken findByConfirmationTokenAndUserEmail(String confirmationToken, String email);

    ConfirmationToken save(ConfirmationToken confirmationToken);

    void delete(ConfirmationToken confirmationToken);
}
