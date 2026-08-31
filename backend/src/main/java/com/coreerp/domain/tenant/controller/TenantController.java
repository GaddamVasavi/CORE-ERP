package com.coreerp.domain.tenant.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.exception.ResourceNotFoundException;
import com.coreerp.domain.tenant.dto.TenantResponse;
import com.coreerp.domain.tenant.entity.Tenant;
import com.coreerp.domain.tenant.repository.TenantRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
@Tag(name = "Tenants", description = "Multi-tenant configuration and subscription management")
public class TenantController {

    private final TenantRepository tenantRepository;

    @GetMapping("/current")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current tenant configuration")
    public ResponseEntity<ApiResponse<TenantResponse>> getCurrentTenant() {
        String tenantId = TenantContext.getTenantId();
        Tenant tenant = tenantRepository.findByIdAndIsDeletedFalse(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant", "id", tenantId));
        return ResponseEntity.ok(ApiResponse.ok(TenantResponse.from(tenant)));
    }
}
