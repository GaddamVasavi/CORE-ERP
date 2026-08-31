package com.coreerp.domain.security.dto;

import com.coreerp.domain.security.entity.AuditLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private String id;
    private String tenantId;
    private String userId;
    private String userEmail;
    private String action;
    private String entityName;
    private String entityId;
    private String ipAddress;
    private String userAgent;
    private String oldState;
    private String newState;
    private String details;
    private String status;
    private Instant createdAt;

    public static AuditLogResponse from(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .tenantId(log.getTenantId())
                .userId(log.getUserId())
                .userEmail(log.getUserEmail())
                .action(log.getAction())
                .entityName(log.getEntityName())
                .entityId(log.getEntityId())
                .ipAddress(log.getIpAddress())
                .userAgent(log.getUserAgent())
                .oldState(log.getOldState())
                .newState(log.getNewState())
                .details(log.getDetails())
                .status(log.getStatus())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
