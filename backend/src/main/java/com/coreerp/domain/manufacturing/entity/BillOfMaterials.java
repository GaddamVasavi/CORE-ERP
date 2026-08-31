package com.coreerp.domain.manufacturing.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.inventory.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bills_of_materials", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "bom_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillOfMaterials extends TenantAwareEntity {

    @Column(name = "bom_number", nullable = false, length = 100)
    private String bomNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "version", nullable = false)
    @Builder.Default
    private int version = 1;

    @Column(name = "quantity", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal quantity = BigDecimal.ONE;

    @Column(name = "uom", nullable = false, length = 20)
    @Builder.Default
    private String uom = "UNIT";

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
