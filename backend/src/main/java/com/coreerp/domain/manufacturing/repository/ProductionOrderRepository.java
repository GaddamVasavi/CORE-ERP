package com.coreerp.domain.manufacturing.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, String> {
    Page<ProductionOrder> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
