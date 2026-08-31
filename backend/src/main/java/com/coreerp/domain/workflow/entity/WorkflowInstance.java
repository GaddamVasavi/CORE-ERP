package com.coreerp.domain.workflow.entity;

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
