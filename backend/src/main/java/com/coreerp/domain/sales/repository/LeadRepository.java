package com.coreerp.domain.sales.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeadRepository extends JpaRepository<Lead, String> {
    Page<Lead> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
