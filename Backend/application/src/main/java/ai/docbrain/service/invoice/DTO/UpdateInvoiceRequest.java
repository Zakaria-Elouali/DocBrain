package ai.docbrain.service.invoice.DTO;

import ai.docbrain.domain.invoice.InvoiceStatus;
import ai.docbrain.domain.invoice.PaymentMethod;
import ai.docbrain.domain.invoice.TemplateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateInvoiceRequest {
    
    @NotBlank(message = "Client name is required")
    private String clientName;
    
    private String clientEmail;
    
    private String clientAddress;
    
    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;
    
    private LocalDate dueDate;
    
    private InvoiceStatus status;
    
    private PaymentMethod paymentMethod;
    
    private String description;
    
    private String notes;
    
    private TemplateType templateType;
    
    @Valid
    private List<CreateInvoiceItemRequest> items;
}
