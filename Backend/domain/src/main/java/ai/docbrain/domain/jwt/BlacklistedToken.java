package ai.docbrain.domain.jwt;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "blacklisted_tokens")
public class BlacklistedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiration;

    // Constructors, getters, and setters
    public BlacklistedToken() {}

    public BlacklistedToken(String token, LocalDateTime expiration) {
        this.token = token;
        this.expiration = expiration;
    }

}
