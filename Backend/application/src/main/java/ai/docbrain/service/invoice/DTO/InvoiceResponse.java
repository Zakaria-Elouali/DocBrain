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
import java.time.ZonedDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponse {
    
    private Long id;
    
    private String invoiceNumber;
    
    private String clientName;
    
    private String clientEmail;
    
    private String clientAddress;
    
    private LocalDate invoiceDate;
    
    private LocalDate dueDate;
    
    private InvoiceStatus status;
    
    private PaymentMethod paymentMethod;
    
    private BigDecimal subtotal;
    
    private BigDecimal taxAmount;
    
    private BigDecimal totalAmount;
    
    private String description;
    
    private String notes;
    
    private TemplateType templateType;
    
    private String createdBy;
    
    private ZonedDateTime createdAt;
    
    private ZonedDateTime lastModifiedAt;
    
    private List<InvoiceItemResponse> items;
    
    private List<InvoiceFileResponse> files;
}
