package com.coreerp.domain.support.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.sales.entity.Customer;
import com.coreerp.domain.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "support_tickets", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "ticket_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicket extends TenantAwareEntity {

    @Column(name = "ticket_number", nullable = false, length = 100)
    private String ticketNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "requester_email", nullable = false)
    private String requesterEmail;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false, length = 100)
    @Builder.Default
    private String category = "GENERAL";

    @Column(name = "priority", nullable = false, length = 50)
    @Builder.Default
    private String priority = "MEDIUM";

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "OPEN";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    @Column(name = "sla_due_at")
    private Instant slaDueAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "csat_rating")
    private Integer csatRating;
}
