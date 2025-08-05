package ai.docbrain.persistence.jwt;

import ai.docbrain.domain.jwt.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfirmationTokenSpringRepository extends JpaRepository<ConfirmationToken, Long> {
    ConfirmationToken findByConfirmationToken(String confirmationToken);

    // confirm token and user
    ConfirmationToken findByConfirmationTokenAndUserEmail(String confirmationToken, String email);

    boolean existsByConfirmationToken(String passcode);
}