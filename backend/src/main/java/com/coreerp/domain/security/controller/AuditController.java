package com.coreerp.domain.security.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.security.dto.AuditLogResponse;
import com.coreerp.domain.security.entity.AuditLog;
import com.coreerp.domain.security.repository.AuditLogRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "Query enterprise security and business operation audit logs")
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('audit:read') or hasRole('TENANT_ADMIN') or hasRole('SUPER_ADMIN') or hasRole('AUDITOR')")
    @Operation(summary = "Query audit logs for the current tenant")
    public ResponseEntity<ApiResponse<PageResponse<AuditLogResponse>>> listAuditLogs(
            @PageableDefault(size = 50) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<AuditLog> page = auditLogRepository.findAllByTenantId(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page.map(AuditLogResponse::from))));
    }
}
