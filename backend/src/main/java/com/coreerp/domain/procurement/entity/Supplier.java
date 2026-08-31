package com.coreerp.domain.procurement.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "suppliers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "supplier_code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Supplier extends TenantAwareEntity {

    @Column(name = "supplier_code", nullable = false, length = 50)
    private String supplierCode;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "website")
    private String website;

    @Column(name = "tax_number", length = 100)
    private String taxNumber;

    @Column(name = "payment_terms_days", nullable = false)
    @Builder.Default
    private int paymentTermsDays = 30;

    @Column(name = "rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = new BigDecimal("5.00");

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
