package com.coreerp.domain.security.dto;

import com.coreerp.domain.security.entity.User;
import com.coreerp.domain.security.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String tenantId;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phoneNumber;
    private String avatarUrl;
    private String departmentId;
    private String departmentName;
    private UserStatus status;
    private boolean isSuperAdmin;
    private boolean isEmailVerified;
    private List<String> roles;
    private Instant createdAt;
    private Instant lastLoginAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .tenantId(user.getTenantId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .status(user.getStatus())
                .isSuperAdmin(user.isSuperAdmin())
                .isEmailVerified(user.isEmailVerified())
                .roles(user.getRoles().stream().map(r -> r.getCode()).collect(Collectors.toList()))
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
