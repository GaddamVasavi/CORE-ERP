package com.coreerp.domain.support.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, String> {
    Page<SupportTicket> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
