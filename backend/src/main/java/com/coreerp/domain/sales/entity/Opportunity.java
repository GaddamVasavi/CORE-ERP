package com.coreerp.domain.sales.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Opportunity extends TenantAwareEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @Column(name = "customer_id", length = 36)
    private String customerId;

    @Column(name = "stage", nullable = false, length = 50)
    @Builder.Default
    private String stage = "PROSPECTING";

    @Column(name = "probability", nullable = false)
    @Builder.Default
    private int probability = 10;

    @Column(name = "estimated_revenue", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal estimatedRevenue = BigDecimal.ZERO;

    @Column(name = "expected_close_date")
    private LocalDate expectedCloseDate;

    @Column(name = "assigned_to_user_id", length = 36)
    private String assignedToUserId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
