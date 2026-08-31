package com.coreerp.domain.security.service;

import com.coreerp.common.exception.BadRequestException;
import com.coreerp.common.exception.ResourceNotFoundException;
import com.coreerp.domain.security.dto.LoginRequest;
import com.coreerp.domain.security.dto.LoginResponse;
import com.coreerp.domain.security.dto.RefreshTokenRequest;
import com.coreerp.domain.security.dto.RegisterRequest;
import com.coreerp.domain.security.entity.*;
import com.coreerp.domain.security.repository.RefreshTokenRepository;
import com.coreerp.domain.security.repository.RoleRepository;
import com.coreerp.domain.security.repository.UserRepository;
import com.coreerp.domain.tenant.dto.TenantResponse;
import com.coreerp.domain.tenant.entity.SubscriptionPlan;
import com.coreerp.domain.tenant.entity.Tenant;
import com.coreerp.domain.tenant.entity.TenantStatus;
import com.coreerp.domain.tenant.repository.TenantRepository;
import com.coreerp.security.jwt.JwtUtils;
import com.coreerp.security.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Value("${jwt.refreshExpirationMs:604800000}")
    private long refreshExpirationMs;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

        user.setLastLoginAt(Instant.now());
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        String jwt = jwtUtils.generateJwtToken(authentication, userDetails.getTenantId(), userDetails.getId());
        String refreshToken = createRefreshToken(user);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> auth.startsWith("ROLE_"))
                .map(auth -> auth.substring(5))
                .collect(Collectors.toList());

        List<String> permissions = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(auth -> !auth.startsWith("ROLE_"))
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .tenantId(user.getTenantId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .permissions(permissions)
                .requiresMfa(false)
                .build();
    }

    @Override
    @Transactional
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken token = refreshTokenRepository.findByTokenAndRevokedFalse(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid or revoked refresh token"));

        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new BadRequestException("Refresh token was expired. Please make a new signin request");
        }

        User user = token.getUser();
        CustomUserDetails userDetails = CustomUserDetails.build(user);

        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String newAccessToken = jwtUtils.generateJwtToken(auth, user.getTenantId(), user.getId());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring(5))
                .collect(Collectors.toList());

        List<String> permissions = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> !a.startsWith("ROLE_"))
                .collect(Collectors.toList());

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token.getToken())
                .tokenType("Bearer")
                .userId(user.getId())
                .tenantId(user.getTenantId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roles)
                .permissions(permissions)
                .build();
    }

    @Override
    @Transactional
    public TenantResponse register(RegisterRequest request) {
        if (tenantRepository.existsBySubdomain(request.getSubdomain())) {
            throw new BadRequestException("Subdomain is already taken: " + request.getSubdomain());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use: " + request.getEmail());
        }

        Tenant tenant = Tenant.builder()
                .name(request.getCompanyName())
                .subdomain(request.getSubdomain().toLowerCase().trim())
                .currency(request.getCurrency())
                .timeZone(request.getTimeZone())
                .subscriptionPlan(SubscriptionPlan.ENTERPRISE)
                .status(TenantStatus.ACTIVE)
                .build();

        tenant = tenantRepository.save(tenant);

        Role adminRole = roleRepository.findByCode("TENANT_ADMIN")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "code", "TENANT_ADMIN"));

        User user = User.builder()
                .tenantId(tenant.getId())
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .status(UserStatus.ACTIVE)
                .isEmailVerified(true)
                .roles(new HashSet<>(Collections.singletonList(adminRole)))
                .build();

        userRepository.save(user);

        return TenantResponse.from(tenant);
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByTokenAndRevokedFalse(refreshToken)
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                });
    }

    private String createRefreshToken(User user) {
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plusMillis(refreshExpirationMs))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(token).getToken();
    }
}
