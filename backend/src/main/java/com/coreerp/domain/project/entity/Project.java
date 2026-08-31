package com.coreerp.domain.project.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.sales.entity.Customer;
import com.coreerp.domain.hr.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "projects", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "project_code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project extends TenantAwareEntity {

    @Column(name = "project_code", nullable = false, length = 50)
    private String projectCode;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_employee_id")
    private Employee managerEmployee;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "budget_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal budgetAmount = BigDecimal.ZERO;

    @Column(name = "cost_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal costAmount = BigDecimal.ZERO;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "PLANNING";
}
