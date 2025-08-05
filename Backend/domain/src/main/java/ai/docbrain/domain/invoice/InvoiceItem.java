package ai.docbrain.domain.invoice;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "invoice_items")
@Builder
public class InvoiceItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;
    
    @Column(name = "item_name", nullable = false)
    private String itemName;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "quantity", nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "vat_percentage", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal vatPercentage = BigDecimal.ZERO;
    
    @Column(name = "line_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;
    
    @Column(name = "created_at")
    private ZonedDateTime createdAt;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = ZonedDateTime.now();
        calculateLineTotal();
    }
    
    @PreUpdate
    public void preUpdate() {
        calculateLineTotal();
    }
    
    public void calculateLineTotal() {
        if (unitPrice != null && quantity != null) {
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
            BigDecimal vatAmount = subtotal.multiply(vatPercentage).divide(BigDecimal.valueOf(100));
            this.lineTotal = subtotal.add(vatAmount);
        }
    }
}
