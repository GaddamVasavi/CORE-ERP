package com.coreerp.domain.inventory.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "sku"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product extends TenantAwareEntity {

    @Column(name = "sku", nullable = false, length = 100)
    private String sku;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_id", length = 36)
    private String categoryId;

    @Column(name = "type", nullable = false, length = 50)
    @Builder.Default
    private String type = "STORABLE";

    @Column(name = "uom", nullable = false, length = 20)
    @Builder.Default
    private String uom = "UNIT";

    @Column(name = "purchase_price", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal purchasePrice = BigDecimal.ZERO;

    @Column(name = "sales_price", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal salesPrice = BigDecimal.ZERO;

    @Column(name = "min_reorder_level", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal minReorderLevel = BigDecimal.ZERO;

    @Column(name = "safety_stock", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal safetyStock = BigDecimal.ZERO;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
