package com.coreerp.domain.tenant.dto;

import com.coreerp.domain.tenant.entity.SubscriptionPlan;
import com.coreerp.domain.tenant.entity.Tenant;
import com.coreerp.domain.tenant.entity.TenantStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantResponse {
    private String id;
    private String name;
    private String subdomain;
    private String customDomain;
    private SubscriptionPlan subscriptionPlan;
    private TenantStatus status;
    private String currency;
    private int fiscalYearStartMonth;
    private String timeZone;
    private String taxIdentifier;
    private Instant createdAt;

    public static TenantResponse from(Tenant tenant) {
        return TenantResponse.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .subdomain(tenant.getSubdomain())
                .customDomain(tenant.getCustomDomain())
                .subscriptionPlan(tenant.getSubscriptionPlan())
                .status(tenant.getStatus())
                .currency(tenant.getCurrency())
                .fiscalYearStartMonth(tenant.getFiscalYearStartMonth())
                .timeZone(tenant.getTimeZone())
                .taxIdentifier(tenant.getTaxIdentifier())
                .createdAt(tenant.getCreatedAt())
                .build();
    }
}
