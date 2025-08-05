package ai.docbrain.Controller.invoice;

import ai.docbrain.domain.invoice.InvoiceStatus;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.invoice.DTO.*;
import ai.docbrain.service.invoice.InvoiceAnalyticsService;
import ai.docbrain.service.invoice.InvoiceEmailService;
import ai.docbrain.service.invoice.InvoicePdfService;
import ai.docbrain.service.invoice.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Slf4j
@Validated
public class InvoiceController {
    
    private final InvoiceService invoiceService;
    private final InvoiceAnalyticsService analyticsService;
    private final InvoicePdfService pdfService;
    private final InvoiceEmailService emailService;
    
    @GetMapping
    @PreAuthorize("hasAuthority('READ_INVOICES')")
    public ResponseEntity<Page<InvoiceResponse>> getInvoices(
            @AuthenticationPrincipal User caller,
            @RequestParam(required = false) String clientName,
            @RequestParam(required = false) String clientEmail,
            @RequestParam(required = false) InvoiceStatus status,
            @RequestParam(required = false) String invoiceNumber,
            @RequestParam(required = false) LocalDate invoiceDateFrom,
            @RequestParam(required = false) LocalDate invoiceDateTo,
            @RequestParam(required = false) LocalDate dueDateFrom,
            @RequestParam(required = false) LocalDate dueDateTo,
            @RequestParam(required = false) String searchTerm,
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Getting invoices with filters - clientName: {}, status: {} by user: {}", clientName, status, caller.getFullName());

        InvoiceFilterRequest filter = InvoiceFilterRequest.builder()
                .clientName(clientName)
                .clientEmail(clientEmail)
                .status(status)
                .invoiceNumber(invoiceNumber)
                .invoiceDateFrom(invoiceDateFrom)
                .invoiceDateTo(invoiceDateTo)
                .dueDateFrom(dueDateFrom)
                .dueDateTo(dueDateTo)
                .searchTerm(searchTerm)
                .build();

        Page<InvoiceResponse> invoices = invoiceService.getInvoices(caller, filter, pageable);

        return ResponseEntity.ok(invoices);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_INVOICES')")
    public ResponseEntity<InvoiceResponse> getInvoiceById(
            @AuthenticationPrincipal User caller,
            @PathVariable Long id) {
        log.info("Getting invoice by ID: {} by user: {}", id, caller.getFullName());

        InvoiceResponse invoice = invoiceService.getInvoiceById(caller, id);

        return ResponseEntity.ok(invoice);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CREATE_INVOICES')")
    public ResponseEntity<InvoiceResponse> createInvoice(
            @AuthenticationPrincipal User caller,
            @Valid @RequestBody CreateInvoiceRequest request) {
        log.info("Creating new invoice for client: {} by user: {}", request.getClientName(), caller.getFullName());

        InvoiceResponse invoice = invoiceService.createInvoice(caller, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(invoice);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE_INVOICES')")
    public ResponseEntity<InvoiceResponse> updateInvoice(
            @AuthenticationPrincipal User caller,
            @PathVariable Long id,
            @Valid @RequestBody UpdateInvoiceRequest request) {

        log.info("Updating invoice with ID: {} by user: {}", id, caller.getFullName());

        InvoiceResponse invoice = invoiceService.updateInvoice(caller, id, request);

        return ResponseEntity.ok(invoice);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_INVOICES')")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        log.info("Deleting invoice with ID: {}", id);
        
        invoiceService.deleteInvoice(id);
        
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/analytics")
    @PreAuthorize("hasAuthority('READ_INVOICES')")
    public ResponseEntity<InvoiceAnalyticsResponse> getInvoiceAnalytics() {
        log.info("Getting invoice analytics");
        
        InvoiceAnalyticsResponse analytics = analyticsService.getInvoiceAnalytics();
        
        return ResponseEntity.ok(analytics);
    }
    
    @PostMapping("/bulk-delete")
    @PreAuthorize("hasAuthority('DELETE_INVOICES')")
    public ResponseEntity<List<InvoiceResponse>> bulkDeleteInvoices(
            @AuthenticationPrincipal User caller,
            @RequestBody List<Long> ids) {
        log.info("Bulk deleting invoices with IDs: {} by user: {}", ids, caller.getFullName());

        List<InvoiceResponse> deletedInvoices = invoiceService.bulkDelete(caller, ids);

        return ResponseEntity.ok(deletedInvoices);
    }

    @PostMapping("/{id}/duplicate")
    @PreAuthorize("hasAuthority('CREATE_INVOICES')")
    public ResponseEntity<InvoiceResponse> duplicateInvoice(
            @AuthenticationPrincipal User caller,
            @PathVariable Long id) {
        log.info("Duplicating invoice with ID: {} by user: {}", id, caller.getFullName());

        InvoiceResponse duplicatedInvoice = invoiceService.duplicateInvoice(caller, id);

        return ResponseEntity.status(HttpStatus.CREATED).body(duplicatedInvoice);
    }

    @PutMapping("/bulk-status")
    @PreAuthorize("hasAuthority('UPDATE_INVOICES')")
    public ResponseEntity<List<InvoiceResponse>> bulkUpdateStatus(
            @AuthenticationPrincipal User caller,
            @RequestParam List<Long> ids,
            @RequestParam InvoiceStatus status) {

        log.info("Bulk updating invoice status to {} for IDs: {} by user: {}", status, ids, caller.getFullName());

        List<InvoiceResponse> updatedInvoices = invoiceService.bulkUpdateStatus(caller, ids, status);

        return ResponseEntity.ok(updatedInvoices);
    }
    
    @GetMapping("/analytics/date-range")
    @PreAuthorize("hasAuthority('READ_INVOICES')")
    public ResponseEntity<Map<String, Object>> getAnalyticsByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        
        log.info("Getting analytics for date range: {} to {}", startDate, endDate);
        
        Map<String, Object> analytics = analyticsService.getRevenueByDateRange(startDate, endDate);
        
        return ResponseEntity.ok(analytics);
    }
    
    @GetMapping("/number/{invoiceNumber}")
    @PreAuthorize("hasAuthority('READ_INVOICES')")
    public ResponseEntity<InvoiceResponse> getInvoiceByNumber(
            @AuthenticationPrincipal User caller,
            @PathVariable String invoiceNumber) {
        log.info("Getting invoice by number: {} by user: {}", invoiceNumber, caller.getFullName());

        InvoiceResponse invoice = invoiceService.getInvoiceByNumber(caller, invoiceNumber);

        return ResponseEntity.ok(invoice);
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAuthority('READ_INVOICES')")
    public ResponseEntity<byte[]> generateInvoicePdf(
            @AuthenticationPrincipal User caller,
            @PathVariable Long id) {
        log.info("Generating PDF for invoice ID: {} by user: {}", id, caller.getFullName());

        InvoiceResponse invoiceResponse = invoiceService.getInvoiceById(caller, id);

        // Convert response back to entity for PDF generation (in real implementation, you might want to optimize this)
        // For now, we'll create a minimal invoice object for PDF generation
        ai.docbrain.domain.invoice.Invoice invoice = ai.docbrain.domain.invoice.Invoice.builder()
                .id(invoiceResponse.getId())
                .invoiceNumber(invoiceResponse.getInvoiceNumber())
                .clientName(invoiceResponse.getClientName())
                .invoiceDate(invoiceResponse.getInvoiceDate())
                .totalAmount(invoiceResponse.getTotalAmount())
                .build();

        byte[] pdfData = pdfService.generateInvoicePdf(caller, invoice);

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=invoice_" + invoiceResponse.getInvoiceNumber() + ".pdf")
                .body(pdfData);
    }

    @PostMapping("/{id}/send-email")
    @PreAuthorize("hasAuthority('UPDATE_INVOICES')")
    public ResponseEntity<Map<String, Object>> sendInvoiceEmail(
            @AuthenticationPrincipal User caller,
            @PathVariable Long id,
            @RequestParam String recipientEmail,
            @RequestParam(required = false) String customMessage) {

        log.info("Sending invoice ID: {} via email to: {} by user: {}", id, recipientEmail, caller.getFullName());

        InvoiceResponse invoiceResponse = invoiceService.getInvoiceById(caller, id);

        // Convert response back to entity for email sending
        ai.docbrain.domain.invoice.Invoice invoice = ai.docbrain.domain.invoice.Invoice.builder()
                .id(invoiceResponse.getId())
                .invoiceNumber(invoiceResponse.getInvoiceNumber())
                .clientName(invoiceResponse.getClientName())
                .clientEmail(invoiceResponse.getClientEmail())
                .invoiceDate(invoiceResponse.getInvoiceDate())
                .dueDate(invoiceResponse.getDueDate())
                .totalAmount(invoiceResponse.getTotalAmount())
                .description(invoiceResponse.getDescription())
                .build();

        boolean emailSent = emailService.sendInvoiceEmail(caller, invoice, recipientEmail, customMessage);

        Map<String, Object> response = new HashMap<>();
        response.put("success", emailSent);
        response.put("message", emailSent ? "Invoice email sent successfully" : "Failed to send invoice email");
        response.put("recipientEmail", recipientEmail);
        response.put("invoiceNumber", invoiceResponse.getInvoiceNumber());

        return ResponseEntity.ok(response);
    }
}
