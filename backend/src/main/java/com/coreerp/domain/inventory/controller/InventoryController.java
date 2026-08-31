package com.coreerp.domain.inventory.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.inventory.entity.*;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@Tag(name = "Inventory & Warehouse (WMS)", description = "Product Catalog, Stock Balances, Warehouses, Movements")
public class InventoryController {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryItemRepository inventoryItemRepository;

    @GetMapping("/products")
    @PreAuthorize("hasAuthority('inventory:read') or hasRole('INVENTORY_MANAGER') or hasRole('WAREHOUSE_MANAGER')")
    @Operation(summary = "List Products with SKUs")
    public ResponseEntity<ApiResponse<PageResponse<Product>>> listProducts(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Product> page = productRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }

    @GetMapping("/warehouses")
    @PreAuthorize("hasAuthority('inventory:read') or hasRole('WAREHOUSE_MANAGER')")
    @Operation(summary = "List Warehouses")
    public ResponseEntity<ApiResponse<List<Warehouse>>> listWarehouses() {
        String tenantId = TenantContext.getTenantId();
        List<Warehouse> warehouses = warehouseRepository.findAllByTenantIdAndIsDeletedFalse(tenantId);
        return ResponseEntity.ok(ApiResponse.ok(warehouses));
    }

    @GetMapping("/stock")
    @PreAuthorize("hasAuthority('inventory:read') or hasRole('INVENTORY_MANAGER')")
    @Operation(summary = "Get stock levels and batches")
    public ResponseEntity<ApiResponse<PageResponse<InventoryItem>>> getStockLevels(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<InventoryItem> page = inventoryItemRepository.findAllByTenantId(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
