package com.coreerp.domain.finance.repository;

import com.coreerp.domain.finance.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    Page<Payment> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
