package com.coreerp.domain.sales.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leads")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lead extends TenantAwareEntity {

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "source", length = 100)
    private String source;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "NEW";

    @Column(name = "lead_score", nullable = false)
    @Builder.Default
    private int leadScore = 0;

    @Column(name = "assigned_to_user_id", length = 36)
    private String assignedToUserId;

    @Column(name = "converted_customer_id", length = 36)
    private String convertedCustomerId;

    @Column(name = "converted_opportunity_id", length = 36)
    private String convertedOpportunityId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
