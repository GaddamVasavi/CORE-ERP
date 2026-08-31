package com.coreerp.domain.security.repository;

import com.coreerp.domain.security.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    Page<AuditLog> findAllByTenantId(String tenantId, Pageable pageable);
    Page<AuditLog> findAllByEntityNameAndEntityId(String entityName, String entityId, Pageable pageable);
}
