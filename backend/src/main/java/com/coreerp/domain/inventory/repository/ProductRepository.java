package com.coreerp.domain.inventory.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    Page<Product> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<Product> findByTenantIdAndSkuAndIsDeletedFalse(String tenantId, String sku);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
