package com.coreerp.domain.inventory.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {
    Page<InventoryItem> findAllByTenantId(String tenantId, Pageable pageable);
    Optional<InventoryItem> findByTenantIdAndProductAndWarehouse(String tenantId, Product product, Warehouse warehouse);
}
