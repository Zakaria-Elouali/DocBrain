package ai.docbrain.service.invoice;

import ai.docbrain.domain.invoice.Invoice;
import ai.docbrain.domain.invoice.InvoiceStatus;
import ai.docbrain.service.invoice.DTO.InvoiceFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public interface IInvoiceFetchRepository {
    
    Page<Invoice> findInvoicesWithFilters(InvoiceFilterRequest filter, Pageable pageable);
    
    Map<String, Object> getInvoiceAnalytics();
    
    BigDecimal getTotalRevenue();
    
    BigDecimal getTotalPaidAmount();
    
    BigDecimal getTotalPendingAmount();
    
    BigDecimal getTotalOverdueAmount();
    
    Map<InvoiceStatus, Long> getInvoiceStatusDistribution();
    
    Map<String, BigDecimal> getMonthlyRevenue(int year);
    
    Map<String, BigDecimal> getYearlyRevenue();
    
    BigDecimal getAverageInvoiceValue();
    
    Long getTotalInvoiceCount();
    
    Map<String, Object> getRevenueByDateRange(LocalDate startDate, LocalDate endDate);
}
