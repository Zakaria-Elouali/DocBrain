package ai.docbrain.domain.jwt;

import ai.docbrain.domain.users.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
public class ConfirmationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "token_id")
    private Long tokenId;

    @Column(name = "confirmation_token", unique = true)
    private String confirmationToken;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expiryDate;

    @ManyToOne
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    public ConfirmationToken() {
    }

    public ConfirmationToken(User user, String passcode) {
        this.user = user;
        this.createdDate = new Date();
        this.expiryDate = new Date(this.createdDate.getTime() + 10 * 60 * 1000); // 10 minutes expiration
        this.confirmationToken = passcode;
    }

    public boolean isExpired() {
        return new Date().after(this.expiryDate);
    }

    public User getUserEntity() {
        return user;
    }

    public void setUserEntity(User user) {
        this.user = user;
    }
}
