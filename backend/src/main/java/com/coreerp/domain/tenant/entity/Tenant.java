package com.coreerp.domain.tenant.entity;

import com.coreerp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tenant extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "subdomain", nullable = false, unique = true)
    private String subdomain;

    @Column(name = "custom_domain", unique = true)
    private String customDomain;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_plan", nullable = false)
    @Builder.Default
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.ENTERPRISE;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private TenantStatus status = TenantStatus.ACTIVE;

    @Column(name = "currency", nullable = false)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "fiscal_year_start_month", nullable = false)
    @Builder.Default
    private int fiscalYearStartMonth = 1;

    @Column(name = "time_zone", nullable = false)
    @Builder.Default
    private String timeZone = "UTC";

    @Column(name = "tax_identifier")
    private String taxIdentifier;
}
