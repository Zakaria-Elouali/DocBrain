package ai.docbrain.service.invoice;

import ai.docbrain.service.invoice.DTO.InvoiceAnalyticsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class InvoiceAnalyticsService {
    
    private final IInvoiceFetchRepository invoiceFetchRepository;
    
    public InvoiceAnalyticsResponse getInvoiceAnalytics() {
        log.info("Generating invoice analytics");
        
        return InvoiceAnalyticsResponse.builder()
                .totalRevenue(invoiceFetchRepository.getTotalRevenue())
                .totalPaidAmount(invoiceFetchRepository.getTotalPaidAmount())
                .totalPendingAmount(invoiceFetchRepository.getTotalPendingAmount())
                .totalOverdueAmount(invoiceFetchRepository.getTotalOverdueAmount())
                .averageInvoiceValue(invoiceFetchRepository.getAverageInvoiceValue())
                .totalInvoiceCount(invoiceFetchRepository.getTotalInvoiceCount())
                .statusDistribution(invoiceFetchRepository.getInvoiceStatusDistribution())
                .monthlyRevenue(invoiceFetchRepository.getMonthlyRevenue(LocalDate.now().getYear()))
                .yearlyRevenue(invoiceFetchRepository.getYearlyRevenue())
                .build();
    }
    
    public Map<String, Object> getRevenueByDateRange(LocalDate startDate, LocalDate endDate) {
        log.info("Getting revenue analytics for date range: {} to {}", startDate, endDate);
        
        return invoiceFetchRepository.getRevenueByDateRange(startDate, endDate);
    }
    
    public Map<String, Object> getDetailedAnalytics() {
        log.info("Generating detailed invoice analytics");
        
        return invoiceFetchRepository.getInvoiceAnalytics();
    }
}
