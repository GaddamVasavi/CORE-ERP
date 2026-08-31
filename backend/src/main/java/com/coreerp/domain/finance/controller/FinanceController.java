package com.coreerp.domain.finance.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.finance.entity.ChartOfAccounts;
import com.coreerp.domain.finance.entity.JournalEntry;
import com.coreerp.domain.finance.repository.ChartOfAccountsRepository;
import com.coreerp.domain.finance.repository.JournalEntryRepository;
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
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
@Tag(name = "Finance & General Ledger", description = "Chart of Accounts, Journal Entries, Double-Entry Posting")
public class FinanceController {

    private final ChartOfAccountsRepository coaRepository;
    private final JournalEntryRepository journalEntryRepository;

    @GetMapping("/accounts")
    @PreAuthorize("hasAuthority('gl:read') or hasRole('ACCOUNTANT') or hasRole('FINANCE_MANAGER') or hasRole('CFO')")
    @Operation(summary = "Get Chart of Accounts hierarchy")
    public ResponseEntity<ApiResponse<List<ChartOfAccounts>>> getChartOfAccounts() {
        String tenantId = TenantContext.getTenantId();
        List<ChartOfAccounts> accounts = coaRepository.findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(tenantId);
        return ResponseEntity.ok(ApiResponse.ok(accounts));
    }

    @GetMapping("/journal-entries")
    @PreAuthorize("hasAuthority('gl:read') or hasRole('ACCOUNTANT') or hasRole('FINANCE_MANAGER')")
    @Operation(summary = "List Journal Entries with pagination")
    public ResponseEntity<ApiResponse<PageResponse<JournalEntry>>> getJournalEntries(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<JournalEntry> page = journalEntryRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
