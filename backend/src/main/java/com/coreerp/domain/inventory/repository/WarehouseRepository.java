package com.coreerp.domain.inventory.entity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, String> {
    List<Warehouse> findAllByTenantIdAndIsDeletedFalse(String tenantId);
    Optional<Warehouse> findByTenantIdAndCodeAndIsDeletedFalse(String tenantId, String code);
}
