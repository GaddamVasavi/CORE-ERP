package com.coreerp.domain.asset.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.hr.entity.Employee;
import com.coreerp.domain.security.entity.Department;
import com.coreerp.domain.inventory.entity.Warehouse;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "assets", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "asset_tag"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asset extends TenantAwareEntity {

    @Column(name = "asset_tag", nullable = false, length = 100)
    private String assetTag;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "purchase_cost", nullable = false, precision = 18, scale = 4)
    private BigDecimal purchaseCost;

    @Column(name = "salvage_value", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal salvageValue = BigDecimal.ZERO;

    @Column(name = "useful_life_months", nullable = false)
    @Builder.Default
    private int usefulLifeMonths = 60;

    @Column(name = "depreciation_method", nullable = false, length = 50)
    @Builder.Default
    private String depreciationMethod = "STRAIGHT_LINE";

    @Column(name = "current_book_value", nullable = false, precision = 18, scale = 4)
    private BigDecimal currentBookValue;

    @Column(name = "accumulated_depreciation", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal accumulatedDepreciation = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_employee_id")
    private Employee assignedEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE";
}
