package ai.docbrain.service.user.sendEmail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final TemplateEngine templateEngine;
    private final JavaMailSender mailSender;
    private static final String FROM_EMAIL = "contact@docbrain.com";

    public static byte[] generateDataFileUsingSSH() {
        // Implement your logic to generate the attachment bytes
        return null;
    }

    private String generateEmailContent(String templateName, Context context) {
        return templateEngine.process(templateName, context);
    }

    private void sendEmailWithTemplate(String toEmail, String subject, String templateName, Context context) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(FROM_EMAIL);
            helper.setTo(toEmail);
            helper.setSubject(subject);

            String emailContent = generateEmailContent(templateName, context);
            helper.setText(emailContent, true);

            mailSender.send(message);
            log.info("Mail Sent to user: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Error while sending mail to: " + toEmail, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    // Welcome email
    public void sendEmail(EmailData emailData) {
        Context context = new Context();
        emailData.getContext().forEach(context::setVariable);

        sendEmailWithTemplate(
                emailData.getToEmail(),
                emailData.getEmailType().getSubject(),
                emailData.getEmailType().getTemplateName(),
                context
        );
    }

//    // Verification email
//    public void sendVerificationEmail(String toEmail, String verificationCode) {
//        Context context = new Context();
//        context.setVariable("username", toEmail);
//        context.setVariable("verificationCode", verificationCode);
//        context.setVariable("expirationMinutes", 15); // Assuming 15 minutes validity
//
//        sendEmailWithTemplate(
//                toEmail,
//                "Verify Your DocBrain Account",
//                "verification-email",
//                context
//        );
//    }
//
//    // Password reset email
//    public void sendPasswordResetEmail(String toEmail, String resetToken) {
//        Context context = new Context();
//        context.setVariable("username", toEmail);
//        context.setVariable("resetToken", resetToken);
//        context.setVariable("expirationHours", 24); // Assuming 24 hours validity
//
//        sendEmailWithTemplate(
//                toEmail,
//                "Reset Your DocBrain Password",
//                "password-reset",
//                context
//        );
//    }
//
//    // Password reset email
//    public void sendPasswordChangeConfirmation(String toEmail, String fullName) {
//        Context context = new Context();
//        context.setVariable("username", fullName);
//        context.setVariable("email", toEmail);
//
//        sendEmailWithTemplate(
//                toEmail,
//                "Change Confirmation DocBrain Password",
//                "password-change-confirmation",
//                context
//        );
//    }
//
//    // Account locked email
//    public void sendAccountLockedEmail(String toEmail) {
//        Context context = new Context();
//        context.setVariable("username", toEmail);
//        context.setVariable("supportEmail", "support@docbrain.com");
//
//        sendEmailWithTemplate(
//                toEmail,
//                "DocBrain Account Security Alert",
//                "account-locked",
//                context
//        );
//    }
}