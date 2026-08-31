package com.coreerp.domain.manufacturing.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.manufacturing.entity.ProductionOrder;
import com.coreerp.domain.manufacturing.entity.ProductionOrderRepository;
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
@RequestMapping("/api/v1/manufacturing")
@RequiredArgsConstructor
@Tag(name = "Manufacturing & Production", description = "Bills of Materials, Work Orders, and MRP")
public class ManufacturingController {

    private final ProductionOrderRepository productionOrderRepository;

    @GetMapping("/production-orders")
    @PreAuthorize("hasAuthority('production_order:create') or hasRole('PRODUCTION_MANAGER')")
    @Operation(summary = "List Production Orders")
    public ResponseEntity<ApiResponse<PageResponse<ProductionOrder>>> listOrders(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<ProductionOrder> page = productionOrderRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
