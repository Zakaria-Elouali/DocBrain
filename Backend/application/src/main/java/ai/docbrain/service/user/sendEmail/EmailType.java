package ai.docbrain.service.user.sendEmail;

public enum EmailType {
    WELCOME_SUPERADMIN("Welcome to DocBrain!", "welcome-superadmin"),
    WELCOME_EMPLOYEE("Welcome to DocBrain!", "welcome-employee"),
    WELCOME_CLIENT("Welcome to DocBrain!", "welcome-client"),

    VERIFICATION("Verify Your DocBrain Account", "verification-email"),
    PASSWORD_RESET("Reset Your DocBrain Password", "password-reset"),
    PASSWORD_CHANGE_CONFIRMATION("Change Confirmation DocBrain Password", "password-change-confirmation"),
    ACCOUNT_LOCKED("DocBrain Account Security Alert", "account-locked");

    private final String subject;
    private final String templateName;

    EmailType(String subject, String templateName) {
        this.subject = subject;
        this.templateName = templateName;
    }

    public String getSubject() {
        return subject;
    }

    public String getTemplateName() {
        return templateName;
    }
}
