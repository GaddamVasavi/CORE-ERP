package com.coreerp.domain.workflow.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.workflow.entity.WorkflowInstance;
import com.coreerp.domain.workflow.entity.WorkflowInstanceRepository;
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
@RequestMapping("/api/v1/workflows")
@RequiredArgsConstructor
@Tag(name = "Workflow & Approval Engine", description = "Multi-level approval matrices, rules, and lifecycle tracking")
public class WorkflowController {

    private final WorkflowInstanceRepository workflowInstanceRepository;

    @GetMapping("/instances")
    @PreAuthorize("hasAuthority('workflow:manage') or isAuthenticated()")
    @Operation(summary = "List Active Workflow Instances")
    public ResponseEntity<ApiResponse<PageResponse<WorkflowInstance>>> listInstances(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<WorkflowInstance> page = workflowInstanceRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
