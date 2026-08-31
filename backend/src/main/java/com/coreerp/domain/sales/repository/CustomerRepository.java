package com.coreerp.domain.sales.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    Page<Customer> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<Customer> findByTenantIdAndCustomerCodeAndIsDeletedFalse(String tenantId, String customerCode);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
