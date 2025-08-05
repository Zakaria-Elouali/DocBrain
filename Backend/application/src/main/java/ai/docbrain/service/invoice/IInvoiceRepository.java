package ai.docbrain.service.invoice;

import ai.docbrain.domain.invoice.Invoice;
import ai.docbrain.domain.invoice.InvoiceStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IInvoiceRepository {
    
    Invoice save(Invoice invoice);
    
    Optional<Invoice> findById(Long id);
    
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    List<Invoice> findByCreatedBy(String createdBy);
    
    List<Invoice> findByStatus(InvoiceStatus status);
    
    List<Invoice> findByInvoiceDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Invoice> findByDueDateBefore(LocalDate date);
    
    void deleteById(Long id);
    
    void softDeleteById(Long id);
    
    List<Invoice> findAll();
    
    long count();
    
    boolean existsByInvoiceNumber(String invoiceNumber);
    
    String generateInvoiceNumber();
    
    List<Invoice> bulkDelete(List<Long> ids);
    
    List<Invoice> updateBulkStatus(List<Long> ids, InvoiceStatus status);
}
