package com.coreerp.domain.finance.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "payment_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends TenantAwareEntity {

    @Column(name = "payment_number", nullable = false, length = 100)
    private String paymentNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 50)
    private PaymentType paymentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_account_id")
    private BankAccount bankAccount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Column(name = "amount", nullable = false, precision = 18, scale = 4)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "COMPLETED";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id")
    private JournalEntry journalEntry;
}
