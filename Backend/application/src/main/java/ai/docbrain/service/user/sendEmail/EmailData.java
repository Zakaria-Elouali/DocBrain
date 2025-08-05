package ai.docbrain.service.user.sendEmail;

import java.util.HashMap;
import java.util.Map;

public class EmailData {
    private final String toEmail;
    private final EmailType emailType;
    private final Map<String, Object> context;

    private EmailData(Builder builder) {
        this.toEmail = builder.toEmail;
        this.emailType = builder.emailType;
        this.context = builder.context;
    }

    public String getToEmail() {
        return toEmail;
    }

    public EmailType getEmailType() {
        return emailType;
    }

    public Map<String, Object> getContext() {
        return context;
    }

    public static class Builder {
        private final String toEmail;
        private final EmailType emailType;
        private Map<String, Object> context = new HashMap<>();

        public Builder(String toEmail, EmailType emailType) {
            this.toEmail = toEmail;
            this.emailType = emailType;
        }

        public Builder addToContext(String key, Object value) {
            this.context.put(key, value);
            return this;
        }

        public EmailData build() {
            return new EmailData(this);
        }
    }
}
