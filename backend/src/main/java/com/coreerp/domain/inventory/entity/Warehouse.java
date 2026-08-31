package com.coreerp.domain.inventory.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "warehouses", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse extends TenantAwareEntity {

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "manager_id", length = 36)
    private String managerId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
