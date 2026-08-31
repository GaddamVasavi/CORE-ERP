package com.coreerp.domain.security.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private String userId;
    private String tenantId;
    private String email;
    private String fullName;
    private List<String> roles;
    private List<String> permissions;
    private boolean requiresMfa;
}
