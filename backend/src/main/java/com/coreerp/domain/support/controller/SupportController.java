package com.coreerp.domain.support.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.support.entity.SupportTicket;
import com.coreerp.domain.support.entity.SupportTicketRepository;
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
@RequestMapping("/api/v1/support")
@RequiredArgsConstructor
@Tag(name = "Customer Support & SLA", description = "Enterprise Helpdesk, Ticketing, and CSAT")
public class SupportController {

    private final SupportTicketRepository supportTicketRepository;

    @GetMapping("/tickets")
    @PreAuthorize("hasAuthority('support:manage') or hasRole('SUPPORT_AGENT')")
    @Operation(summary = "List Support Tickets")
    public ResponseEntity<ApiResponse<PageResponse<SupportTicket>>> listTickets(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<SupportTicket> page = supportTicketRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
