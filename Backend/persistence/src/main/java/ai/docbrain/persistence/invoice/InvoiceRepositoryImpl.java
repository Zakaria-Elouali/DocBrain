package ai.docbrain.persistence.invoice;

import ai.docbrain.domain.invoice.Invoice;
import ai.docbrain.domain.invoice.InvoiceStatus;
import ai.docbrain.service.invoice.IInvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
@Slf4j
public class InvoiceRepositoryImpl implements IInvoiceRepository {
    
    private final InvoiceSpringRepository springRepository;
    
    @Override
    public Invoice save(Invoice invoice) {
        log.debug("Saving invoice: {}", invoice.getInvoiceNumber());
        return springRepository.save(invoice);
    }
    
    @Override
    public Optional<Invoice> findById(Long id) {
        log.debug("Finding invoice by ID: {}", id);
        // Fetch invoice with items only (files will be loaded lazily to avoid MultipleBagFetchException)
        return springRepository.findByIdWithItems(id);
    }
    
    @Override
    public Optional<Invoice> findByInvoiceNumber(String invoiceNumber) {
        log.debug("Finding invoice by number: {}", invoiceNumber);
        return springRepository.findByInvoiceNumber(invoiceNumber);
    }
    
    @Override
    public List<Invoice> findByCreatedBy(String createdBy) {
        log.debug("Finding invoices by creator: {}", createdBy);
        return springRepository.findByCreatedBy(createdBy);
    }
    
    @Override
    public List<Invoice> findByStatus(InvoiceStatus status) {
        log.debug("Finding invoices by status: {}", status);
        return springRepository.findByStatus(status);
    }
    
    @Override
    public List<Invoice> findByInvoiceDateBetween(LocalDate startDate, LocalDate endDate) {
        log.debug("Finding invoices between dates: {} and {}", startDate, endDate);
        return springRepository.findByInvoiceDateBetween(startDate, endDate);
    }
    
    @Override
    public List<Invoice> findByDueDateBefore(LocalDate date) {
        log.debug("Finding invoices with due date before: {}", date);
        return springRepository.findByDueDateBefore(date);
    }
    
    @Override
    public void deleteById(Long id) {
        log.debug("Hard deleting invoice with ID: {}", id);
        springRepository.deleteById(id);
    }
    
    @Override
    public void softDeleteById(Long id) {
        log.debug("Soft deleting invoice with ID: {}", id);
        springRepository.softDeleteById(id);
    }
    
    @Override
    public List<Invoice> findAll() {
        log.debug("Finding all active invoices");
        return springRepository.findAllActive();
    }
    
    @Override
    public long count() {
        log.debug("Counting all invoices");
        return springRepository.count();
    }
    
    @Override
    public boolean existsByInvoiceNumber(String invoiceNumber) {
        log.debug("Checking if invoice exists with number: {}", invoiceNumber);
        return springRepository.existsByInvoiceNumber(invoiceNumber);
    }
    
    @Override
    public String generateInvoiceNumber() {
        log.debug("Generating new invoice number");
        
        int currentYear = LocalDate.now().getYear();
        Integer lastNumber = springRepository.getLastInvoiceNumberForCurrentYear();
        
        int nextNumber = (lastNumber != null) ? lastNumber + 1 : 1;
        String invoiceNumber = String.format("INV-%d-%03d", currentYear, nextNumber);
        
        // Ensure uniqueness
        while (existsByInvoiceNumber(invoiceNumber)) {
            nextNumber++;
            invoiceNumber = String.format("INV-%d-%03d", currentYear, nextNumber);
        }
        
        log.debug("Generated invoice number: {}", invoiceNumber);
        return invoiceNumber;
    }
    
    @Override
    public List<Invoice> bulkDelete(List<Long> ids) {
        log.debug("Bulk deleting invoices with IDs: {}", ids);
        
        List<Invoice> invoicesToDelete = springRepository.findAllById(ids);
        springRepository.softDeleteByIds(ids);
        
        return invoicesToDelete;
    }
    
    @Override
    public List<Invoice> updateBulkStatus(List<Long> ids, InvoiceStatus status) {
        log.debug("Bulk updating invoice status to {} for IDs: {}", status, ids);
        
        List<Invoice> invoicesToUpdate = springRepository.findAllById(ids);
        springRepository.updateStatusByIds(ids, status);
        
        // Update the status in the returned objects
        invoicesToUpdate.forEach(invoice -> invoice.setStatus(status));
        
        return invoicesToUpdate;
    }
}
