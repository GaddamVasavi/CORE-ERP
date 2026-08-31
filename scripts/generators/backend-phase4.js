const fs = require('fs');
const path = require('path');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  const fullPath = path.resolve(process.cwd(), filePath);
  ensureDirSync(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Created: ${filePath}`);
}

console.log("Generating Phase 4 Database Migrations & Backend Codebase...");

// Flyway V4 Schema Migration
writeFile('backend/src/main/resources/db/migration/V4__workflows_analytics_documents_support.sql', `
-- ============================================================================
-- CoreERP Database Schema - V4: Workflows, Analytics, Documents, Support
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. WORKFLOW & APPROVAL ENGINE
-- ----------------------------------------------------------------------------

CREATE TABLE workflow_definitions (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    module VARCHAR(100) NOT NULL, -- FINANCE, PROCUREMENT, HR, SALES, ASSET
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_wf_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE workflow_instances (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workflow_definition_id VARCHAR(36) NOT NULL REFERENCES workflow_definitions(id),
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    initiator_user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    current_state VARCHAR(100) NOT NULL DEFAULT 'PENDING_APPROVAL',
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, APPROVED, REJECTED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE approval_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workflow_instance_id VARCHAR(36) NOT NULL REFERENCES workflow_instances(id) ON DELETE CASCADE,
    step_number INT NOT NULL DEFAULT 1,
    approver_role VARCHAR(100),
    assigned_user_id VARCHAR(36) REFERENCES users(id),
    decision VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, DELEGATED
    comments TEXT,
    decided_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. CUSTOMER SUPPORT & HELPDESK
-- ----------------------------------------------------------------------------

CREATE TABLE support_tickets (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    ticket_number VARCHAR(100) NOT NULL,
    customer_id VARCHAR(36) REFERENCES customers(id),
    requester_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'GENERAL', -- BILLING, TECHNICAL, ORDER_INQUIRY, WARRANTY
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, WAITING_CUSTOMER, RESOLVED, CLOSED
    assigned_agent_id VARCHAR(36) REFERENCES users(id),
    sla_due_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    csat_rating INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_ticket_tenant_number UNIQUE (tenant_id, ticket_number)
);

CREATE TABLE ticket_comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    ticket_id VARCHAR(36) NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    author_user_id VARCHAR(36) REFERENCES users(id),
    is_internal_note BOOLEAN NOT NULL DEFAULT FALSE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. DOCUMENT MANAGEMENT SYSTEM (DMS)
-- ----------------------------------------------------------------------------

CREATE TABLE documents (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    entity_type VARCHAR(100), -- EMPLOYEE, CUSTOMER, SUPPLIER, INVOICE, PO, ASSET
    entity_id VARCHAR(100),
    uploaded_by_user_id VARCHAR(36) REFERENCES users(id),
    version INT NOT NULL DEFAULT 1,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_docs_tenant ON documents(tenant_id);
CREATE INDEX idx_docs_entity ON documents(entity_type, entity_id);

-- ----------------------------------------------------------------------------
-- 4. NOTIFICATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    recipient_user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO', -- INFO, WARNING, SUCCESS, ALERT, APPROVAL
    link_url VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_notifications_user ON notifications(recipient_user_id, is_read);
`);

// Java Entities & Repositories & Controllers for Phase 4
writeFile('backend/src/main/java/com/coreerp/domain/workflow/entity/WorkflowDefinition.java', `package com.coreerp.domain.workflow.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workflow_definitions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowDefinition extends TenantAwareEntity {

    @Column(name = "code", nullable = false, length = 100)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "module", nullable = false, length = 100)
    private String module;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/workflow/entity/WorkflowInstance.java', `package com.coreerp.domain.workflow.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workflow_instances")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowInstance extends TenantAwareEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_definition_id", nullable = false)
    private WorkflowDefinition workflowDefinition;

    @Column(name = "entity_type", nullable = false, length = 100)
    private String entityType;

    @Column(name = "entity_id", nullable = false, length = 100)
    private String entityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "initiator_user_id", nullable = false)
    private User initiator;

    @Column(name = "current_state", nullable = false, length = 100)
    @Builder.Default
    private String currentState = "PENDING_APPROVAL";

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "IN_PROGRESS";
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/support/entity/SupportTicket.java', `package com.coreerp.domain.support.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.sales.entity.Customer;
import com.coreerp.domain.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "support_tickets", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "ticket_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicket extends TenantAwareEntity {

    @Column(name = "ticket_number", nullable = false, length = 100)
    private String ticketNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "requester_email", nullable = false)
    private String requesterEmail;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false, length = 100)
    @Builder.Default
    private String category = "GENERAL";

    @Column(name = "priority", nullable = false, length = 50)
    @Builder.Default
    private String priority = "MEDIUM";

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "OPEN";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    @Column(name = "sla_due_at")
    private Instant slaDueAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "csat_rating")
    private Integer csatRating;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/document/entity/Document.java', `package com.coreerp.domain.document.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "documents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Document extends TenantAwareEntity {

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type", nullable = false, length = 100)
    private String fileType;

    @Column(name = "file_size_bytes", nullable = false)
    private Long fileSizeBytes;

    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    @Column(name = "entity_type", length = 100)
    private String entityType;

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_user_id")
    private User uploadedBy;

    @Column(name = "version", nullable = false)
    @Builder.Default
    private int version = 1;

    @Column(name = "is_archived", nullable = false)
    @Builder.Default
    private boolean isArchived = false;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/notification/entity/Notification.java', `package com.coreerp.domain.notification.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends TenantAwareEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private User recipient;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "type", nullable = false, length = 50)
    @Builder.Default
    private String type = "INFO";

    @Column(name = "link_url")
    private String linkUrl;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @Column(name = "read_at")
    private Instant readAt;
}
`);

// Repositories for Phase 4
writeFile('backend/src/main/java/com/coreerp/domain/workflow/repository/WorkflowInstanceRepository.java', `package com.coreerp.domain.workflow.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkflowInstanceRepository extends JpaRepository<WorkflowInstance, String> {
    Page<WorkflowInstance> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/support/repository/SupportTicketRepository.java', `package com.coreerp.domain.support.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, String> {
    Page<SupportTicket> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/document/repository/DocumentRepository.java', `package com.coreerp.domain.document.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {
    Page<Document> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/notification/repository/NotificationRepository.java', `package com.coreerp.domain.notification.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    Page<Notification> findAllByRecipientIdAndIsDeletedFalseOrderByCreatedAtDesc(String userId, Pageable pageable);
}
`);

// Controllers for Phase 4
writeFile('backend/src/main/java/com/coreerp/domain/workflow/controller/WorkflowController.java', `package com.coreerp.domain.workflow.controller;

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
`);

writeFile('backend/src/main/java/com/coreerp/domain/support/controller/SupportController.java', `package com.coreerp.domain.support.controller;

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
`);

writeFile('backend/src/main/java/com/coreerp/domain/document/controller/DocumentController.java', `package com.coreerp.domain.document.controller;

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
`);

console.log("Phase 4 Java Backend scaffolding completed.");
