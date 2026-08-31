package com.coreerp.domain.security.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.domain.security.dto.LoginRequest;
import com.coreerp.domain.security.dto.LoginResponse;
import com.coreerp.domain.security.dto.RefreshTokenRequest;
import com.coreerp.domain.security.dto.RegisterRequest;
import com.coreerp.domain.security.service.AuthService;
import com.coreerp.domain.tenant.dto.TenantResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & Onboarding", description = "Endpoints for login, register, token refresh, and session management")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and get JWT tokens")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new tenant company and administrator")
    public ResponseEntity<ApiResponse<TenantResponse>> register(@Valid @RequestBody RegisterRequest request) {
        TenantResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Tenant registered successfully", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using valid refresh token")
    public ResponseEntity<ApiResponse<LoginResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke user refresh token")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        authService.logout(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }
}
