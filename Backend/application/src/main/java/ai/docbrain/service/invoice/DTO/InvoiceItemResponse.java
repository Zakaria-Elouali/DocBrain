package ai.docbrain.service.invoice.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceItemResponse {
    
    private Long id;
    
    private String itemName;
    
    private String description;
    
    private Integer quantity;
    
    private BigDecimal unitPrice;
    
    private BigDecimal vatPercentage;
    
    private BigDecimal lineTotal;
    
    private ZonedDateTime createdAt;
}
