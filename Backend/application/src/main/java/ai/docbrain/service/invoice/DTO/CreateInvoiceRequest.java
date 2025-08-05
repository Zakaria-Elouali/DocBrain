package ai.docbrain.service.invoice.DTO;

import ai.docbrain.domain.invoice.PaymentMethod;
import ai.docbrain.domain.invoice.TemplateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInvoiceRequest {
    
    @NotBlank(message = "Client name is required")
    private String clientName;
    
    private String clientEmail;
    
    private String clientAddress;
    
    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;
    
    private LocalDate dueDate;
    
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.CREDIT_CARD;
    
    private String description;
    
    private String notes;
    
    @Builder.Default
    private TemplateType templateType = TemplateType.LAW_FIRM;
    
    @NotEmpty(message = "Invoice must have at least one item")
    @Valid
    private List<CreateInvoiceItemRequest> items;
}
