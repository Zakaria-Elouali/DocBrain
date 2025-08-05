package ai.docbrain.service.invoice.DTO;

import ai.docbrain.domain.invoice.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceAnalyticsResponse {
    
    private BigDecimal totalRevenue;
    
    private BigDecimal totalPaidAmount;
    
    private BigDecimal totalPendingAmount;
    
    private BigDecimal totalOverdueAmount;
    
    private BigDecimal averageInvoiceValue;
    
    private Long totalInvoiceCount;
    
    private Map<InvoiceStatus, Long> statusDistribution;
    
    private Map<String, BigDecimal> monthlyRevenue;
    
    private Map<String, BigDecimal> yearlyRevenue;
}
