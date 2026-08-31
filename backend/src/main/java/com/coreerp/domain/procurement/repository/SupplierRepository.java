package com.coreerp.domain.procurement.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, String> {
    Page<Supplier> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<Supplier> findByTenantIdAndSupplierCodeAndIsDeletedFalse(String tenantId, String code);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
