package com.coreerp.domain.security.service;

import com.coreerp.domain.security.dto.LoginRequest;
import com.coreerp.domain.security.dto.LoginResponse;
import com.coreerp.domain.security.dto.RefreshTokenRequest;
import com.coreerp.domain.security.dto.RegisterRequest;
import com.coreerp.domain.tenant.dto.TenantResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse refreshToken(RefreshTokenRequest request);
    TenantResponse register(RegisterRequest request);
    void logout(String refreshToken);
}
