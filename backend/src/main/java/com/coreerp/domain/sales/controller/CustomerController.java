package com.coreerp.domain.sales.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.sales.entity.Customer;
import com.coreerp.domain.sales.entity.CustomerRepository;
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
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Tag(name = "Customer Management", description = "Customer Master and CRM 360")
public class CustomerController {

    private final CustomerRepository customerRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('customer:read') or hasRole('SALES_EXECUTIVE') or hasRole('SALES_MANAGER')")
    @Operation(summary = "List Customers for Tenant")
    public ResponseEntity<ApiResponse<PageResponse<Customer>>> listCustomers(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Customer> page = customerRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
