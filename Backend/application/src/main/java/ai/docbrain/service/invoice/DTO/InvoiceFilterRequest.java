package ai.docbrain.service.invoice.DTO;

import ai.docbrain.domain.invoice.InvoiceStatus;
import ai.docbrain.domain.invoice.PaymentMethod;
import ai.docbrain.domain.invoice.TemplateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceFilterRequest {
    
    private String clientName;
    
    private String clientEmail;
    
    private InvoiceStatus status;
    
    private PaymentMethod paymentMethod;
    
    private TemplateType templateType;
    
    private LocalDate invoiceDateFrom;
    
    private LocalDate invoiceDateTo;
    
    private LocalDate dueDateFrom;
    
    private LocalDate dueDateTo;
    
    private BigDecimal totalAmountFrom;
    
    private BigDecimal totalAmountTo;
    
    private String invoiceNumber;
    
    private String createdBy;
    
    private String searchTerm; // For general text search across multiple fields
}
