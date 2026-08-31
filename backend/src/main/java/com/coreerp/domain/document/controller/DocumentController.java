package com.coreerp.domain.document.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.document.entity.Document;
import com.coreerp.domain.document.entity.DocumentRepository;
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
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@Tag(name = "Document Management System (DMS)", description = "Enterprise document attachments, versioning, and secure access")
public class DocumentController {

    private final DocumentRepository documentRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('document:manage') or isAuthenticated()")
    @Operation(summary = "List Enterprise Documents")
    public ResponseEntity<ApiResponse<PageResponse<Document>>> listDocuments(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Document> page = documentRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
