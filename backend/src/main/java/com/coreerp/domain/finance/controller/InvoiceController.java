package com.coreerp.domain.finance.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.finance.entity.Invoice;
import com.coreerp.domain.finance.entity.InvoiceType;
import com.coreerp.domain.finance.repository.InvoiceRepository;
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
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices (AP / AR)", description = "Customer & Supplier Invoices and Billing")
public class InvoiceController {

    private final InvoiceRepository invoiceRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('invoice:read') or hasRole('ACCOUNTANT') or hasRole('SALES_MANAGER')")
    @Operation(summary = "List Invoices (AR / AP)")
    public ResponseEntity<ApiResponse<PageResponse<Invoice>>> listInvoices(
            @RequestParam(defaultValue = "CUSTOMER_INVOICE") InvoiceType type,
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Invoice> page = invoiceRepository.findAllByTenantIdAndInvoiceTypeAndIsDeletedFalse(tenantId, type, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
