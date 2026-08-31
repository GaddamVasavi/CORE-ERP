package com.coreerp.domain.hr.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.finance.entity.JournalEntry;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payroll_runs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "payroll_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollRun extends TenantAwareEntity {

    @Column(name = "payroll_number", nullable = false, length = 100)
    private String payrollNumber;

    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;

    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;

    @Column(name = "total_gross_pay", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalGrossPay = BigDecimal.ZERO;

    @Column(name = "total_deductions", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalDeductions = BigDecimal.ZERO;

    @Column(name = "total_net_pay", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalNetPay = BigDecimal.ZERO;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "DRAFT";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id")
    private JournalEntry journalEntry;
}
