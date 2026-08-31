package com.coreerp.domain.sales.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.sales.entity.SalesOrder;
import com.coreerp.domain.sales.entity.SalesOrderRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sales-orders")
@RequiredArgsConstructor
@Tag(name = "Sales Orders", description = "Order-to-Cash process and order tracking")
public class SalesOrderController {

    private final SalesOrderRepository salesOrderRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('sales_order:create') or hasRole('SALES_EXECUTIVE') or hasRole('SALES_MANAGER')")
    @Operation(summary = "List Sales Orders")
    public ResponseEntity<ApiResponse<PageResponse<SalesOrder>>> listOrders(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<SalesOrder> page = salesOrderRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
