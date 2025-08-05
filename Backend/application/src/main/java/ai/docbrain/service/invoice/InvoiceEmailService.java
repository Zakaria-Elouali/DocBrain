package ai.docbrain.service.invoice;

import ai.docbrain.domain.invoice.Invoice;
import ai.docbrain.domain.users.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceEmailService {
    
    private final InvoicePdfService pdfService;
    
    /**
     * Send invoice via email
     * 
     * @param caller The user sending the email
     * @param invoice The invoice to send
     * @param recipientEmail The recipient email address
     * @param customMessage Optional custom message
     * @return true if email was sent successfully
     */
    public boolean sendInvoiceEmail(User caller, Invoice invoice, String recipientEmail, String customMessage) {
        log.info("Sending invoice {} via email to {} by user: {}", 
                invoice.getInvoiceNumber(), recipientEmail, caller.getFullName());
        
        try {
            // Generate PDF
            byte[] pdfData = pdfService.generateInvoicePdf(caller, invoice);
            
            // TODO: Implement email sending using Spring Mail or other email service
            // This is a placeholder implementation
            
            String subject = String.format("Invoice %s from %s", 
                    invoice.getInvoiceNumber(), caller.getFullName());
            
            String emailBody = buildEmailBody(invoice, customMessage);
            
            // Placeholder - in real implementation, send email with PDF attachment
            log.info("Email sent successfully to: {} with subject: {}", recipientEmail, subject);
            
            return true;
            
        } catch (Exception e) {
            log.error("Failed to send invoice email for invoice: {} to: {}", 
                    invoice.getInvoiceNumber(), recipientEmail, e);
            return false;
        }
    }
    
    /**
     * Send invoice reminder email
     * 
     * @param caller The user sending the reminder
     * @param invoice The invoice for reminder
     * @return true if reminder was sent successfully
     */
    public boolean sendInvoiceReminder(User caller, Invoice invoice) {
        log.info("Sending invoice reminder for {} by user: {}", 
                invoice.getInvoiceNumber(), caller.getFullName());
        
        if (invoice.getClientEmail() == null || invoice.getClientEmail().trim().isEmpty()) {
            log.warn("Cannot send reminder - no client email for invoice: {}", invoice.getInvoiceNumber());
            return false;
        }
        
        String reminderMessage = String.format(
                "This is a friendly reminder that invoice %s is due on %s. " +
                "Please process payment at your earliest convenience.",
                invoice.getInvoiceNumber(),
                invoice.getDueDate()
        );
        
        return sendInvoiceEmail(caller, invoice, invoice.getClientEmail(), reminderMessage);
    }
    
    private String buildEmailBody(Invoice invoice, String customMessage) {
        StringBuilder body = new StringBuilder();
        
        body.append("Dear ").append(invoice.getClientName()).append(",\n\n");
        
        if (customMessage != null && !customMessage.trim().isEmpty()) {
            body.append(customMessage).append("\n\n");
        } else {
            body.append("Please find attached your invoice.\n\n");
        }
        
        body.append("Invoice Details:\n");
        body.append("Invoice Number: ").append(invoice.getInvoiceNumber()).append("\n");
        body.append("Date: ").append(invoice.getInvoiceDate()).append("\n");
        body.append("Due Date: ").append(invoice.getDueDate()).append("\n");
        body.append("Total Amount: $").append(invoice.getTotalAmount()).append("\n\n");
        
        if (invoice.getDescription() != null && !invoice.getDescription().trim().isEmpty()) {
            body.append("Description: ").append(invoice.getDescription()).append("\n\n");
        }
        
        body.append("Thank you for your business!\n\n");
        body.append("Best regards,\n");
        body.append("Your Invoice Team");
        
        return body.toString();
    }
}
