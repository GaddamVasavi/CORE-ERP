package com.coreerp.domain.procurement.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.procurement.entity.PurchaseOrder;
import com.coreerp.domain.procurement.entity.PurchaseOrderRepository;
import com.coreerp.domain.procurement.entity.Supplier;
import com.coreerp.domain.procurement.entity.SupplierRepository;
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
@RequestMapping("/api/v1/procurement")
@RequiredArgsConstructor
@Tag(name = "Procurement & Purchasing", description = "Supplier Master, RFQs, and Purchase Orders")
public class ProcurementController {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository poRepository;

    @GetMapping("/suppliers")
    @PreAuthorize("hasAuthority('supplier:manage') or hasRole('PROCUREMENT_MANAGER') or hasRole('PURCHASE_EXECUTIVE')")
    @Operation(summary = "List Suppliers")
    public ResponseEntity<ApiResponse<PageResponse<Supplier>>> listSuppliers(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Supplier> page = supplierRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }

    @GetMapping("/purchase-orders")
    @PreAuthorize("hasAuthority('purchase_order:create') or hasRole('PROCUREMENT_MANAGER') or hasRole('PURCHASE_EXECUTIVE')")
    @Operation(summary = "List Purchase Orders")
    public ResponseEntity<ApiResponse<PageResponse<PurchaseOrder>>> listPurchaseOrders(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<PurchaseOrder> page = poRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
