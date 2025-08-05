package ai.docbrain.persistence.invoice;

import ai.docbrain.domain.BaseEntity;
import ai.docbrain.domain.invoice.Invoice;
import ai.docbrain.domain.invoice.InvoiceStatus;
import ai.docbrain.service.invoice.DTO.InvoiceFilterRequest;
import ai.docbrain.service.invoice.IInvoiceFetchRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
@Slf4j
public class InvoiceFetchRepositoryImpl implements IInvoiceFetchRepository {
    
    private final EntityManager entityManager;
    private final InvoiceSpringRepository springRepository;
    
    @Override
    public Page<Invoice> findInvoicesWithFilters(InvoiceFilterRequest filter, Pageable pageable) {
        log.debug("Finding invoices with filters: {}", filter);

        // First, get the invoices without fetch joins to avoid MultipleBagFetchException
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Invoice> query = cb.createQuery(Invoice.class);
        Root<Invoice> root = query.from(Invoice.class);

        List<Predicate> predicates = buildPredicates(cb, root, filter);

        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(cb.desc(root.get("createdAt")));

        TypedQuery<Invoice> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Invoice> invoices = typedQuery.getResultList();

        // If we have invoices, fetch their items and files in separate queries
        if (!invoices.isEmpty()) {
            fetchItemsForInvoices(invoices);
            fetchFilesForInvoices(invoices);
        }

        // Count query
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Invoice> countRoot = countQuery.from(Invoice.class);
        countQuery.select(cb.count(countRoot));
        countQuery.where(buildPredicates(cb, countRoot, filter).toArray(new Predicate[0]));

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(invoices, pageable, total);
    }

    private void fetchItemsForInvoices(List<Invoice> invoices) {
        if (invoices.isEmpty()) return;

        List<Long> invoiceIds = invoices.stream()
                .map(Invoice::getId)
                .collect(Collectors.toList());

        // Fetch all items for these invoices in one query
        TypedQuery<ai.docbrain.domain.invoice.InvoiceItem> itemQuery = entityManager.createQuery(
                "SELECT i FROM InvoiceItem i WHERE i.invoice.id IN :invoiceIds ORDER BY i.id",
                ai.docbrain.domain.invoice.InvoiceItem.class);
        itemQuery.setParameter("invoiceIds", invoiceIds);

        List<ai.docbrain.domain.invoice.InvoiceItem> allItems = itemQuery.getResultList();

        // Group items by invoice ID and set them on the invoices
        Map<Long, List<ai.docbrain.domain.invoice.InvoiceItem>> itemsByInvoiceId = allItems.stream()
                .collect(Collectors.groupingBy(item -> item.getInvoice().getId()));

        invoices.forEach(invoice -> {
            List<ai.docbrain.domain.invoice.InvoiceItem> items = itemsByInvoiceId.getOrDefault(invoice.getId(), new ArrayList<>());
            invoice.setItems(items);
        });
    }

    private void fetchFilesForInvoices(List<Invoice> invoices) {
        if (invoices.isEmpty()) return;

        List<Long> invoiceIds = invoices.stream()
                .map(Invoice::getId)
                .collect(Collectors.toList());

        // Fetch all files for these invoices in one query
        TypedQuery<ai.docbrain.domain.invoice.InvoiceFile> fileQuery = entityManager.createQuery(
                "SELECT f FROM InvoiceFile f WHERE f.invoice.id IN :invoiceIds ORDER BY f.id",
                ai.docbrain.domain.invoice.InvoiceFile.class);
        fileQuery.setParameter("invoiceIds", invoiceIds);

        List<ai.docbrain.domain.invoice.InvoiceFile> allFiles = fileQuery.getResultList();

        // Group files by invoice ID and set them on the invoices
        Map<Long, List<ai.docbrain.domain.invoice.InvoiceFile>> filesByInvoiceId = allFiles.stream()
                .collect(Collectors.groupingBy(file -> file.getInvoice().getId()));

        invoices.forEach(invoice -> {
            List<ai.docbrain.domain.invoice.InvoiceFile> files = filesByInvoiceId.getOrDefault(invoice.getId(), new ArrayList<>());
            invoice.setFiles(files);
        });
    }
    
    private List<Predicate> buildPredicates(CriteriaBuilder cb, Root<Invoice> root, InvoiceFilterRequest filter) {
        List<Predicate> predicates = new ArrayList<>();
        
        // Always filter active records
        predicates.add(cb.equal(root.get("statusCode"), BaseEntity.StatusCodes.ACTIVE));
        
        if (filter.getClientName() != null && !filter.getClientName().trim().isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("clientName")), 
                    "%" + filter.getClientName().toLowerCase() + "%"));
        }
        
        if (filter.getClientEmail() != null && !filter.getClientEmail().trim().isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("clientEmail")), 
                    "%" + filter.getClientEmail().toLowerCase() + "%"));
        }
        
        if (filter.getStatus() != null) {
            predicates.add(cb.equal(root.get("status"), filter.getStatus()));
        }
        
        if (filter.getPaymentMethod() != null) {
            predicates.add(cb.equal(root.get("paymentMethod"), filter.getPaymentMethod()));
        }
        
        if (filter.getTemplateType() != null) {
            predicates.add(cb.equal(root.get("templateType"), filter.getTemplateType()));
        }
        
        if (filter.getInvoiceDateFrom() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("invoiceDate"), filter.getInvoiceDateFrom()));
        }
        
        if (filter.getInvoiceDateTo() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("invoiceDate"), filter.getInvoiceDateTo()));
        }
        
        if (filter.getDueDateFrom() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("dueDate"), filter.getDueDateFrom()));
        }
        
        if (filter.getDueDateTo() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("dueDate"), filter.getDueDateTo()));
        }
        
        if (filter.getTotalAmountFrom() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("totalAmount"), filter.getTotalAmountFrom()));
        }
        
        if (filter.getTotalAmountTo() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("totalAmount"), filter.getTotalAmountTo()));
        }
        
        if (filter.getInvoiceNumber() != null && !filter.getInvoiceNumber().trim().isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("invoiceNumber")), 
                    "%" + filter.getInvoiceNumber().toLowerCase() + "%"));
        }
        
        if (filter.getCreatedBy() != null) {
            predicates.add(cb.equal(root.get("createdBy"), filter.getCreatedBy()));
        }
        
        if (filter.getSearchTerm() != null && !filter.getSearchTerm().trim().isEmpty()) {
            String searchTerm = "%" + filter.getSearchTerm().toLowerCase() + "%";
            Predicate searchPredicate = cb.or(
                    cb.like(cb.lower(root.get("clientName")), searchTerm),
                    cb.like(cb.lower(root.get("clientEmail")), searchTerm),
                    cb.like(cb.lower(root.get("invoiceNumber")), searchTerm),
                    cb.like(cb.lower(root.get("description")), searchTerm),
                    cb.like(cb.lower(root.get("notes")), searchTerm)
            );
            predicates.add(searchPredicate);
        }
        
        return predicates;
    }
    
    @Override
    public Map<String, Object> getInvoiceAnalytics() {
        log.debug("Getting comprehensive invoice analytics");
        
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("totalRevenue", getTotalRevenue());
        analytics.put("totalPaidAmount", getTotalPaidAmount());
        analytics.put("totalPendingAmount", getTotalPendingAmount());
        analytics.put("totalOverdueAmount", getTotalOverdueAmount());
        analytics.put("averageInvoiceValue", getAverageInvoiceValue());
        analytics.put("totalInvoiceCount", getTotalInvoiceCount());
        analytics.put("statusDistribution", getInvoiceStatusDistribution());
        analytics.put("monthlyRevenue", getMonthlyRevenue(LocalDate.now().getYear()));
        analytics.put("yearlyRevenue", getYearlyRevenue());
        analytics.put("currentMonthCount", springRepository.getCurrentMonthInvoiceCount());
        
        return analytics;
    }
    
    @Override
    public BigDecimal getTotalRevenue() {
        BigDecimal result = springRepository.getTotalRevenue();
        return result != null ? result : BigDecimal.ZERO;
    }
    
    @Override
    public BigDecimal getTotalPaidAmount() {
        BigDecimal result = springRepository.getTotalPaidAmount();
        return result != null ? result : BigDecimal.ZERO;
    }
    
    @Override
    public BigDecimal getTotalPendingAmount() {
        BigDecimal result = springRepository.getTotalPendingAmount();
        return result != null ? result : BigDecimal.ZERO;
    }
    
    @Override
    public BigDecimal getTotalOverdueAmount() {
        BigDecimal result = springRepository.getTotalOverdueAmount();
        return result != null ? result : BigDecimal.ZERO;
    }
    
    @Override
    public Map<InvoiceStatus, Long> getInvoiceStatusDistribution() {
        List<Object[]> results = springRepository.getInvoiceStatusDistribution();

        return results.stream()
                .collect(Collectors.toMap(
                        row -> InvoiceStatus.valueOf((String) row[0]),
                        row -> (Long) row[1]
                ));
    }
    
    @Override
    public Map<String, BigDecimal> getMonthlyRevenue(int year) {
        List<Object[]> results = springRepository.getMonthlyRevenue(year);
        
        Map<String, BigDecimal> monthlyRevenue = new LinkedHashMap<>();
        
        // Initialize all months with zero
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        
        for (String month : months) {
            monthlyRevenue.put(month, BigDecimal.ZERO);
        }
        
        // Fill with actual data
        for (Object[] row : results) {
            Integer month = (Integer) row[0];
            BigDecimal revenue = (BigDecimal) row[1];
            monthlyRevenue.put(months[month - 1], revenue != null ? revenue : BigDecimal.ZERO);
        }
        
        return monthlyRevenue;
    }
    
    @Override
    public Map<String, BigDecimal> getYearlyRevenue() {
        List<Object[]> results = springRepository.getYearlyRevenue();
        
        return results.stream()
                .collect(Collectors.toMap(
                        row -> String.valueOf(row[0]),
                        row -> (BigDecimal) row[1],
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ));
    }
    
    @Override
    public BigDecimal getAverageInvoiceValue() {
        BigDecimal result = springRepository.getAverageInvoiceValue();
        return result != null ? result : BigDecimal.ZERO;
    }
    
    @Override
    public Long getTotalInvoiceCount() {
        return springRepository.getTotalInvoiceCount();
    }
    
    @Override
    public Map<String, Object> getRevenueByDateRange(LocalDate startDate, LocalDate endDate) {
        log.debug("Getting revenue analytics for date range: {} to {}", startDate, endDate);
        
        List<Invoice> invoices = springRepository.findByInvoiceDateBetween(startDate, endDate);
        
        Map<String, Object> analytics = new HashMap<>();
        
        BigDecimal totalRevenue = invoices.stream()
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal paidAmount = invoices.stream()
                .filter(invoice -> invoice.getStatus() == InvoiceStatus.PAID)
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal pendingAmount = invoices.stream()
                .filter(invoice -> invoice.getStatus() == InvoiceStatus.PENDING)
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal overdueAmount = invoices.stream()
                .filter(invoice -> invoice.getStatus() == InvoiceStatus.OVERDUE)
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        analytics.put("totalRevenue", totalRevenue);
        analytics.put("paidAmount", paidAmount);
        analytics.put("pendingAmount", pendingAmount);
        analytics.put("overdueAmount", overdueAmount);
        analytics.put("invoiceCount", (long) invoices.size());
        analytics.put("averageInvoiceValue",
                invoices.isEmpty() ? BigDecimal.ZERO :
                totalRevenue.divide(BigDecimal.valueOf(invoices.size()), 2, RoundingMode.HALF_UP));
        
        return analytics;
    }
}
