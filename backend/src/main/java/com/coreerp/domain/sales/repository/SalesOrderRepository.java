package com.coreerp.domain.sales.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, String> {
    Page<SalesOrder> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<SalesOrder> findByTenantIdAndOrderNumberAndIsDeletedFalse(String tenantId, String orderNumber);
}
