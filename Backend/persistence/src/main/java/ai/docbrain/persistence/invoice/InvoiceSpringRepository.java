package ai.docbrain.persistence.invoice;

import ai.docbrain.domain.invoice.Invoice;
import ai.docbrain.domain.invoice.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceSpringRepository extends JpaRepository<Invoice, Long> {
    
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    List<Invoice> findByCreatedBy(String createdBy);
    
    List<Invoice> findByStatus(InvoiceStatus status);
    
    List<Invoice> findByInvoiceDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<Invoice> findByDueDateBefore(LocalDate date);
    
    boolean existsByInvoiceNumber(String invoiceNumber);
    
    @Query("SELECT i FROM Invoice i WHERE i.statusCode = 'ACTIVE'")
    List<Invoice> findAllActive();
    
    @Query("SELECT i FROM Invoice i WHERE i.statusCode = 'ACTIVE'")
    Page<Invoice> findAllActive(Pageable pageable);
    
    @Modifying
    @Query("UPDATE Invoice i SET i.statusCode = 'INACTIVE' WHERE i.id = :id")
    void softDeleteById(@Param("id") Long id);
    
    @Modifying
    @Query("UPDATE Invoice i SET i.statusCode = 'INACTIVE' WHERE i.id IN :ids")
    void softDeleteByIds(@Param("ids") List<Long> ids);
    
    @Modifying
    @Query("UPDATE Invoice i SET i.status = :status WHERE i.id IN :ids")
    void updateStatusByIds(@Param("ids") List<Long> ids, @Param("status") InvoiceStatus status);
    
    // Analytics queries
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.statusCode = 'ACTIVE'")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.status = 'PAID' AND i.statusCode = 'ACTIVE'")
    BigDecimal getTotalPaidAmount();
    
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.status = 'PENDING' AND i.statusCode = 'ACTIVE'")
    BigDecimal getTotalPendingAmount();
    
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.status = 'OVERDUE' AND i.statusCode = 'ACTIVE'")
    BigDecimal getTotalOverdueAmount();
    
    @Query("SELECT AVG(i.totalAmount) FROM Invoice i WHERE i.statusCode = 'ACTIVE'")
    BigDecimal getAverageInvoiceValue();
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.statusCode = 'ACTIVE'")
    Long getTotalInvoiceCount();
    
    @Query("SELECT i.status, COUNT(i) FROM Invoice i WHERE i.statusCode = 'ACTIVE' GROUP BY i.status")
    List<Object[]> getInvoiceStatusDistribution();
    
    @Query("SELECT EXTRACT(MONTH FROM i.invoiceDate) as month, SUM(i.totalAmount) " +
           "FROM Invoice i WHERE EXTRACT(YEAR FROM i.invoiceDate) = :year AND i.statusCode = 'ACTIVE' " +
           "GROUP BY EXTRACT(MONTH FROM i.invoiceDate) ORDER BY month")
    List<Object[]> getMonthlyRevenue(@Param("year") int year);
    
    @Query("SELECT EXTRACT(YEAR FROM i.invoiceDate) as year, SUM(i.totalAmount) " +
           "FROM Invoice i WHERE i.statusCode = 'ACTIVE' " +
           "GROUP BY EXTRACT(YEAR FROM i.invoiceDate) ORDER BY year")
    List<Object[]> getYearlyRevenue();
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE EXTRACT(YEAR FROM i.invoiceDate) = EXTRACT(YEAR FROM CURRENT_DATE) " +
           "AND EXTRACT(MONTH FROM i.invoiceDate) = EXTRACT(MONTH FROM CURRENT_DATE) AND i.statusCode = 'ACTIVE'")
    Long getCurrentMonthInvoiceCount();
    
    @Query("SELECT MAX(CAST(SUBSTRING(i.invoiceNumber, 10) AS INTEGER)) " +
           "FROM Invoice i WHERE i.invoiceNumber LIKE CONCAT('INV-', EXTRACT(YEAR FROM CURRENT_DATE), '-%')")
    Integer getLastInvoiceNumberForCurrentYear();

    @Query("SELECT DISTINCT i FROM Invoice i LEFT JOIN FETCH i.items WHERE i.id = :id")
    Optional<Invoice> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT DISTINCT i FROM Invoice i LEFT JOIN FETCH i.items WHERE i.statusCode = 'ACTIVE'")
    List<Invoice> findAllActiveWithItems();
}
