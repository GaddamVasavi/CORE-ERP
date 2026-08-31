package com.coreerp.domain.hr.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayrollRunRepository extends JpaRepository<PayrollRun, String> {
    Page<PayrollRun> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
