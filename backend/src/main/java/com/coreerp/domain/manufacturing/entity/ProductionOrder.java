package com.coreerp.domain.manufacturing.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.inventory.entity.Product;
import com.coreerp.domain.inventory.entity.Warehouse;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "production_orders", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "order_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionOrder extends TenantAwareEntity {

    @Column(name = "order_number", nullable = false, length = 100)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bom_id", nullable = false)
    private BillOfMaterials bom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_warehouse_id", nullable = false)
    private Warehouse targetWarehouse;

    @Column(name = "quantity_planned", nullable = false, precision = 18, scale = 4)
    private BigDecimal quantityPlanned;

    @Column(name = "quantity_produced", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal quantityProduced = BigDecimal.ZERO;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "PLANNED";
}
