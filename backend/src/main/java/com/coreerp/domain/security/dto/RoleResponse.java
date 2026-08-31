package com.coreerp.domain.security.dto;

import com.coreerp.domain.security.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleResponse {
    private String id;
    private String tenantId;
    private String name;
    private String code;
    private String description;
    private boolean isSystemRole;
    private List<String> permissions;

    public static RoleResponse from(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .tenantId(role.getTenantId())
                .name(role.getName())
                .code(role.getCode())
                .description(role.getDescription())
                .isSystemRole(role.isSystemRole())
                .permissions(role.getPermissions().stream().map(p -> p.getName()).collect(Collectors.toList()))
                .build();
    }
}
