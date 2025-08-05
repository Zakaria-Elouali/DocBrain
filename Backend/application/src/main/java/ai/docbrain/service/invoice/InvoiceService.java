package ai.docbrain.service.invoice;

import ai.docbrain.domain.invoice.Invoice;
import ai.docbrain.domain.invoice.InvoiceItem;
import ai.docbrain.domain.invoice.InvoiceStatus;
import ai.docbrain.domain.users.User;
import ai.docbrain.service.invoice.DTO.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {
    
    private final IInvoiceRepository invoiceRepository;
    private final IInvoiceFetchRepository invoiceFetchRepository;
    public InvoiceResponse createInvoice(User caller, CreateInvoiceRequest request) {
        log.info("Creating new invoice for client: {}", request.getClientName());
        
        // Generate invoice number
        String invoiceNumber = invoiceRepository.generateInvoiceNumber();
        
        // Create invoice
        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .clientName(request.getClientName())
                .clientEmail(request.getClientEmail())
                .clientAddress(request.getClientAddress())
                .invoiceDate(request.getInvoiceDate())
                .dueDate(request.getDueDate())
                .paymentMethod(request.getPaymentMethod())
                .description(request.getDescription())
                .notes(request.getNotes())
                .templateType(request.getTemplateType())
                .createdBy(caller.getFullName())
                .build();

        // Add items to invoice (this will set the relationship)
        request.getItems().forEach(itemRequest -> {
            InvoiceItem item = mapToInvoiceItem(itemRequest);
            invoice.addItem(item);
        });
        
        // Calculate totals
        invoice.calculateTotals();
        
        // Save invoice
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
        log.info("Invoice created successfully with number: {}", savedInvoice.getInvoiceNumber());
        return mapToInvoiceResponse(caller, savedInvoice);
    }

    public InvoiceResponse getInvoiceById(User caller, Long id) {
        log.info("Fetching invoice with ID: {}", id);

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with ID: " + id));

        return mapToInvoiceResponse(caller, invoice);
    }

    public InvoiceResponse getInvoiceByNumber(User caller, String invoiceNumber) {
        log.info("Fetching invoice with number: {}", invoiceNumber);

        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new RuntimeException("Invoice not found with number: " + invoiceNumber));

        return mapToInvoiceResponse(caller, invoice);
    }

    public Page<InvoiceResponse> getInvoices(User caller, InvoiceFilterRequest filter, Pageable pageable) {
        log.info("Fetching invoices with filters: {}", filter);

        Page<Invoice> invoices = invoiceFetchRepository.findInvoicesWithFilters(filter, pageable);

        return invoices.map(invoice -> mapToInvoiceResponse(caller, invoice));
    }
    
    public InvoiceResponse updateInvoice(User caller, Long id, UpdateInvoiceRequest request) {
        log.info("Updating invoice with ID: {} by user: {}", id, caller.getFullName());

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with ID: " + id));

        // Update invoice fields
        invoice.setClientName(request.getClientName());
        invoice.setClientEmail(request.getClientEmail());
        invoice.setClientAddress(request.getClientAddress());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate());

        if (request.getStatus() != null) {
            invoice.setStatus(request.getStatus());
        }
        if (request.getPaymentMethod() != null) {
            invoice.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getTemplateType() != null) {
            invoice.setTemplateType(request.getTemplateType());
        }

        invoice.setDescription(request.getDescription());
        invoice.setNotes(request.getNotes());

        // Update items if provided
        if (request.getItems() != null) {
            // Clear existing items
            invoice.getItems().clear();

            // Add new items
            request.getItems().forEach(itemRequest -> {
                InvoiceItem item = mapToInvoiceItem(itemRequest);
                invoice.addItem(item);
            });
        }

        // Recalculate totals
        invoice.calculateTotals();

        Invoice savedInvoice = invoiceRepository.save(invoice);

        log.info("Invoice updated successfully: {}", savedInvoice.getInvoiceNumber());
        return mapToInvoiceResponse(caller, savedInvoice);
    }

    public void deleteInvoice(Long id) {
        log.info("Deleting invoice with ID: {}", id);
        
        if (!invoiceRepository.findById(id).isPresent()) {
            throw new RuntimeException("Invoice not found with ID: " + id);
        }
        
        invoiceRepository.softDeleteById(id);
        log.info("Invoice deleted successfully with ID: {}", id);
    }
    
    public InvoiceResponse duplicateInvoice(User caller, Long id) {
        log.info("Duplicating invoice with ID: {}", id);
        
        Invoice originalInvoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with ID: " + id));
        
        // Create duplicate with new invoice number
        String newInvoiceNumber = invoiceRepository.generateInvoiceNumber();
        
        Invoice duplicateInvoice = Invoice.builder()
                .invoiceNumber(newInvoiceNumber)
                .clientName(originalInvoice.getClientName())
                .clientEmail(originalInvoice.getClientEmail())
                .clientAddress(originalInvoice.getClientAddress())
                .invoiceDate(LocalDate.now())
                .dueDate(originalInvoice.getDueDate())
                .paymentMethod(originalInvoice.getPaymentMethod())
                .description(originalInvoice.getDescription())
                .notes(originalInvoice.getNotes())
                .templateType(originalInvoice.getTemplateType())
                .createdBy(caller.getFullName())
                .status(InvoiceStatus.PENDING)
                .build();
        
        // Duplicate items
        originalInvoice.getItems().forEach(originalItem -> {
            InvoiceItem duplicateItem = InvoiceItem.builder()
                    .itemName(originalItem.getItemName())
                    .description(originalItem.getDescription())
                    .quantity(originalItem.getQuantity())
                    .unitPrice(originalItem.getUnitPrice())
                    .vatPercentage(originalItem.getVatPercentage())
                    .build();
            duplicateInvoice.addItem(duplicateItem);
        });
        
        // Calculate totals
        duplicateInvoice.calculateTotals();
        
        Invoice savedInvoice = invoiceRepository.save(duplicateInvoice);
        
        log.info("Invoice duplicated successfully. New invoice number: {}", savedInvoice.getInvoiceNumber());
        return mapToInvoiceResponse(caller, savedInvoice);
    }

    public List<InvoiceResponse> bulkDelete(User caller, List<Long> ids) {
        log.info("Bulk deleting invoices with IDs: {} by user: {}", ids, caller.getFullName());

        List<Invoice> deletedInvoices = invoiceRepository.bulkDelete(ids);

        log.info("Successfully deleted {} invoices", deletedInvoices.size());
        return deletedInvoices.stream()
                .map(invoice -> mapToInvoiceResponse(caller, invoice))
                .collect(Collectors.toList());
    }

    public List<InvoiceResponse> bulkUpdateStatus(User caller, List<Long> ids, InvoiceStatus status) {
        log.info("Bulk updating invoice status to {} for IDs: {} by user: {}", status, ids, caller.getFullName());

        List<Invoice> updatedInvoices = invoiceRepository.updateBulkStatus(ids, status);

        log.info("Successfully updated status for {} invoices", updatedInvoices.size());
        return updatedInvoices.stream()
                .map(invoice -> mapToInvoiceResponse(caller, invoice))
                .collect(Collectors.toList());
    }
    
    private InvoiceItem mapToInvoiceItem(CreateInvoiceItemRequest request) {
        return InvoiceItem.builder()
                .itemName(request.getItemName())
                .description(request.getDescription())
                .quantity(request.getQuantity())
                .unitPrice(request.getUnitPrice())
                .vatPercentage(request.getVatPercentage())
                .build();
    }
    
    private InvoiceResponse mapToInvoiceResponse(User caller, Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .clientName(invoice.getClientName())
                .clientEmail(invoice.getClientEmail())
                .clientAddress(invoice.getClientAddress())
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .status(invoice.getStatus())
                .paymentMethod(invoice.getPaymentMethod())
                .subtotal(invoice.getSubtotal())
                .taxAmount(invoice.getTaxAmount())
                .totalAmount(invoice.getTotalAmount())
                .description(invoice.getDescription())
                .notes(invoice.getNotes())
                .templateType(invoice.getTemplateType())
                .createdBy(invoice.getCreatedBy())
                .createdAt(invoice.getCreatedAt())
                .lastModifiedAt(invoice.getLastModifiedAt())
                .items(invoice.getItems() != null ?
                        invoice.getItems().stream()
                                .map(this::mapToInvoiceItemResponse)
                                .collect(Collectors.toList()) :
                        new ArrayList<>())
                .files(mapInvoiceFiles(invoice))
                .build();
    }

    private List<InvoiceFileResponse> mapInvoiceFiles(Invoice invoice) {
        try {
            return invoice.getFiles() != null ?
                    invoice.getFiles().stream()
                            .map(this::mapToInvoiceFileResponse)
                            .collect(Collectors.toList()) :
                    new ArrayList<>();
        } catch (Exception e) {
            // If there's an issue loading files (lazy loading), return empty list
            log.warn("Could not load files for invoice {}: {}", invoice.getId(), e.getMessage());
            return new ArrayList<>();
        }
    }

    private InvoiceItemResponse mapToInvoiceItemResponse(InvoiceItem item) {
        return InvoiceItemResponse.builder()
                .id(item.getId())
                .itemName(item.getItemName())
                .description(item.getDescription())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .vatPercentage(item.getVatPercentage())
                .lineTotal(item.getLineTotal())
                .createdAt(item.getCreatedAt())
                .build();
    }
    
    private InvoiceFileResponse mapToInvoiceFileResponse(ai.docbrain.domain.invoice.InvoiceFile file) {
        return InvoiceFileResponse.builder()
                .id(file.getId())
                .fileName(file.getFileName())
                .filePath(file.getFilePath())
                .fileSize(file.getFileSize())
                .mimeType(file.getMimeType())
                .createdAt(file.getCreatedAt())
                .build();
    }

}
