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

// -------------------------------------------------------------
// Security Context & Entities
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/tenant/entity/SubscriptionPlan.java', `package com.coreerp.domain.tenant.entity;

public enum SubscriptionPlan {
    STARTER,
    PROFESSIONAL,
    ENTERPRISE,
    UNLIMITED
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/tenant/entity/TenantStatus.java', `package com.coreerp.domain.tenant.entity;

public enum TenantStatus {
    ACTIVE,
    SUSPENDED,
    TRIAL,
    EXPIRED,
    CANCELLED
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/tenant/entity/Tenant.java', `package com.coreerp.domain.tenant.entity;

import com.coreerp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tenant extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "subdomain", nullable = false, unique = true)
    private String subdomain;

    @Column(name = "custom_domain", unique = true)
    private String customDomain;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_plan", nullable = false)
    @Builder.Default
    private SubscriptionPlan subscriptionPlan = SubscriptionPlan.ENTERPRISE;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private TenantStatus status = TenantStatus.ACTIVE;

    @Column(name = "currency", nullable = false)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "fiscal_year_start_month", nullable = false)
    @Builder.Default
    private int fiscalYearStartMonth = 1;

    @Column(name = "time_zone", nullable = false)
    @Builder.Default
    private String timeZone = "UTC";

    @Column(name = "tax_identifier")
    private String taxIdentifier;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/tenant/entity/TenantSetting.java', `package com.coreerp.domain.tenant.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tenant_settings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "setting_key"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantSetting extends TenantAwareEntity {

    @Column(name = "setting_key", nullable = false, length = 100)
    private String settingKey;

    @Column(name = "setting_value", nullable = false, columnDefinition = "TEXT")
    private String settingValue;

    @Column(name = "category", nullable = false, length = 100)
    @Builder.Default
    private String category = "GENERAL";

    @Column(name = "description")
    private String description;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/entity/UserStatus.java', `package com.coreerp.domain.security.entity;

public enum UserStatus {
    ACTIVE,
    INACTIVE,
    PENDING_VERIFICATION,
    LOCKED,
    SUSPENDED
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/entity/Department.java', `package com.coreerp.domain.security.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Department extends TenantAwareEntity {

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_department_id")
    private Department parentDepartment;

    @Column(name = "manager_id")
    private String managerId;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/entity/Permission.java', `package com.coreerp.domain.security.entity;

import com.coreerp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Permission extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "module", nullable = false, length = 100)
    private String module;

    @Column(name = "action", nullable = false, length = 50)
    private String action;

    @Column(name = "description")
    private String description;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/entity/Role.java', `package com.coreerp.domain.security.entity;

import com.coreerp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Role extends BaseEntity {

    @Column(name = "tenant_id", length = 36)
    private String tenantId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "code", nullable = false, length = 100)
    private String code;

    @Column(name = "description")
    private String description;

    @Column(name = "is_system_role", nullable = false)
    @Builder.Default
    private boolean isSystemRole = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "role_permissions",
        joinColumns = @JoinColumn(name = "role_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/entity/User.java', `package com.coreerp.domain.security.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends TenantAwareEntity {

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "phone_number", length = 50)
    private String phoneNumber;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "is_super_admin", nullable = false)
    @Builder.Default
    private boolean isSuperAdmin = false;

    @Column(name = "is_email_verified", nullable = false)
    @Builder.Default
    private boolean isEmailVerified = false;

    @Column(name = "two_factor_enabled", nullable = false)
    @Builder.Default
    private boolean twoFactorEnabled = false;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private int failedLoginAttempts = 0;

    @Column(name = "lockout_until")
    private Instant lockoutUntil;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/entity/RefreshToken.java', `package com.coreerp.domain.security.entity;

import com.coreerp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "token", nullable = false, unique = true, length = 500)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "revoked", nullable = false)
    @Builder.Default
    private boolean revoked = false;

    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/entity/AuditLog.java', `package com.coreerp.domain.security.entity;

import com.coreerp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog extends BaseEntity {

    @Column(name = "tenant_id", length = 36)
    private String tenantId;

    @Column(name = "user_id", length = 36)
    private String userId;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "entity_name", nullable = false, length = 100)
    private String entityName;

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @Column(name = "ip_address", length = 100)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "old_state", columnDefinition = "JSONB")
    private String oldState;

    @Column(name = "new_state", columnDefinition = "JSONB")
    private String newState;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "SUCCESS";
}
`);

// -------------------------------------------------------------
// Repositories
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/tenant/repository/TenantRepository.java', `package com.coreerp.domain.tenant.repository;

import com.coreerp.domain.tenant.entity.Tenant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, String> {
    Optional<Tenant> findBySubdomainAndIsDeletedFalse(String subdomain);
    Optional<Tenant> findByCustomDomainAndIsDeletedFalse(String customDomain);
    Optional<Tenant> findByIdAndIsDeletedFalse(String id);
    Page<Tenant> findAllByIsDeletedFalse(Pageable pageable);
    boolean existsBySubdomain(String subdomain);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/tenant/repository/TenantSettingRepository.java', `package com.coreerp.domain.tenant.repository;

import com.coreerp.domain.tenant.entity.TenantSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantSettingRepository extends JpaRepository<TenantSetting, String> {
    List<TenantSetting> findByTenantIdAndIsDeletedFalse(String tenantId);
    Optional<TenantSetting> findByTenantIdAndSettingKeyAndIsDeletedFalse(String tenantId, String settingKey);
    List<TenantSetting> findByTenantIdAndCategoryAndIsDeletedFalse(String tenantId, String category);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/repository/UserRepository.java', `package com.coreerp.domain.security.repository;

import com.coreerp.domain.security.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    Optional<User> findByIdAndIsDeletedFalse(String id);
    Page<User> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    boolean existsByEmail(String email);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/repository/RoleRepository.java', `package com.coreerp.domain.security.repository;

import com.coreerp.domain.security.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByCode(String code);
    Optional<Role> findByTenantIdAndCode(String tenantId, String code);
    List<Role> findByTenantIdOrTenantIdIsNull(String tenantId);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/repository/PermissionRepository.java', `package com.coreerp.domain.security.repository;

import com.coreerp.domain.security.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {
    Optional<Permission> findByName(String name);
    List<Permission> findByModule(String module);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/repository/RefreshTokenRepository.java', `package com.coreerp.domain.security.repository;

import com.coreerp.domain.security.entity.RefreshToken;
import com.coreerp.domain.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);
    @Modifying
    int deleteByUser(User user);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/repository/AuditLogRepository.java', `package com.coreerp.domain.security.repository;

import com.coreerp.domain.security.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    Page<AuditLog> findAllByTenantId(String tenantId, Pageable pageable);
    Page<AuditLog> findAllByEntityNameAndEntityId(String entityName, String entityId, Pageable pageable);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/repository/DepartmentRepository.java', `package com.coreerp.domain.security.repository;

import com.coreerp.domain.security.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    List<Department> findAllByTenantIdAndIsDeletedFalse(String tenantId);
    Optional<Department> findByTenantIdAndCodeAndIsDeletedFalse(String tenantId, String code);
}
`);

// -------------------------------------------------------------
// DTOs & Services & Security Context
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/security/service/CustomUserDetails.java', `package com.coreerp.security.service;

import com.coreerp.domain.security.entity.User;
import com.coreerp.domain.security.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final String id;
    private final String tenantId;
    private final String email;
    private final String password;
    private final String fullName;
    private final boolean isSuperAdmin;
    private final boolean isEmailVerified;
    private final UserStatus status;
    private final Collection<? extends GrantedAuthority> authorities;

    public static CustomUserDetails build(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();

        if (user.isSuperAdmin()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
        }

        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
            role.getPermissions().forEach(permission -> {
                authorities.add(new SimpleGrantedAuthority(permission.getName()));
            });
        });

        return new CustomUserDetails(
                user.getId(),
                user.getTenantId(),
                user.getEmail(),
                user.getPasswordHash(),
                user.getFullName(),
                user.isSuperAdmin(),
                user.isEmailVerified(),
                user.getStatus(),
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != UserStatus.LOCKED && status != UserStatus.SUSPENDED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return status == UserStatus.ACTIVE;
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/security/service/UserDetailsServiceImpl.java', `package com.coreerp.security.service;

import com.coreerp.domain.security.entity.User;
import com.coreerp.domain.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return CustomUserDetails.build(user);
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/security/config/SecurityConfig.java', `package com.coreerp.security.config;

import com.coreerp.security.jwt.JwtAuthEntryPoint;
import com.coreerp.security.jwt.JwtAuthenticationFilter;
import com.coreerp.security.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/v1/auth/**",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/actuator/**"
                ).permitAll()
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
`);

// Auth & Tenant DTOs
writeFile('backend/src/main/java/com/coreerp/domain/security/dto/LoginRequest.java', `package com.coreerp.domain.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String twoFactorCode;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/dto/LoginResponse.java', `package com.coreerp.domain.security.dto;

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
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/dto/RegisterRequest.java', `package com.coreerp.domain.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Company / Tenant name is required")
    private String companyName;

    @NotBlank(message = "Subdomain is required")
    private String subdomain;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private String currency = "USD";
    private String timeZone = "UTC";
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/dto/RefreshTokenRequest.java', `package com.coreerp.domain.security.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/dto/UserResponse.java', `package com.coreerp.domain.security.dto;

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
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/dto/UserCreateRequest.java', `package com.coreerp.domain.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UserCreateRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private String phoneNumber;
    private String departmentId;
    private List<String> roleCodes;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/dto/RoleResponse.java', `package com.coreerp.domain.security.dto;

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
`);

writeFile('backend/src/main/java/com/coreerp/domain/tenant/dto/TenantResponse.java', `package com.coreerp.domain.tenant.dto;

import com.coreerp.domain.tenant.entity.SubscriptionPlan;
import com.coreerp.domain.tenant.entity.Tenant;
import com.coreerp.domain.tenant.entity.TenantStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantResponse {
    private String id;
    private String name;
    private String subdomain;
    private String customDomain;
    private SubscriptionPlan subscriptionPlan;
    private TenantStatus status;
    private String currency;
    private int fiscalYearStartMonth;
    private String timeZone;
    private String taxIdentifier;
    private Instant createdAt;

    public static TenantResponse from(Tenant tenant) {
        return TenantResponse.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .subdomain(tenant.getSubdomain())
                .customDomain(tenant.getCustomDomain())
                .subscriptionPlan(tenant.getSubscriptionPlan())
                .status(tenant.getStatus())
                .currency(tenant.getCurrency())
                .fiscalYearStartMonth(tenant.getFiscalYearStartMonth())
                .timeZone(tenant.getTimeZone())
                .taxIdentifier(tenant.getTaxIdentifier())
                .createdAt(tenant.getCreatedAt())
                .build();
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/dto/AuditLogResponse.java', `package com.coreerp.domain.security.dto;

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
`);

// -------------------------------------------------------------
// Services & Controllers
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/security/service/AuthService.java', `package com.coreerp.domain.security.service;

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
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/service/AuthServiceImpl.java', `package com.coreerp.domain.security.service;

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

    @Value("\${jwt.refreshExpirationMs:604800000}")
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
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/controller/AuthController.java', `package com.coreerp.domain.security.controller;

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
`);

// User & Role Services and Controllers
writeFile('backend/src/main/java/com/coreerp/domain/security/service/UserService.java', `package com.coreerp.domain.security.service;

import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.security.dto.UserCreateRequest;
import com.coreerp.domain.security.dto.UserResponse;
import org.springframework.data.domain.Pageable;

public interface UserService {
    PageResponse<UserResponse> listUsers(String tenantId, Pageable pageable);
    UserResponse getUserById(String id);
    UserResponse createUser(String tenantId, UserCreateRequest request);
    void deleteUser(String id);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/service/UserServiceImpl.java', `package com.coreerp.domain.security.service;

import com.coreerp.common.dto.PageResponse;
import com.coreerp.common.exception.BadRequestException;
import com.coreerp.common.exception.ResourceNotFoundException;
import com.coreerp.domain.security.dto.UserCreateRequest;
import com.coreerp.domain.security.dto.UserResponse;
import com.coreerp.domain.security.entity.Department;
import com.coreerp.domain.security.entity.Role;
import com.coreerp.domain.security.entity.User;
import com.coreerp.domain.security.entity.UserStatus;
import com.coreerp.domain.security.repository.DepartmentRepository;
import com.coreerp.domain.security.repository.RoleRepository;
import com.coreerp.domain.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> listUsers(String tenantId, Pageable pageable) {
        Page<User> page = userRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return PageResponse.from(page.map(UserResponse::from));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        User user = userRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(String tenantId, UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElse(null);
        }

        Set<Role> roles = new HashSet<>();
        if (request.getRoleCodes() != null && !request.getRoleCodes().isEmpty()) {
            for (String code : request.getRoleCodes()) {
                roleRepository.findByCode(code).ifPresent(roles::add);
            }
        }
        if (roles.isEmpty()) {
            roleRepository.findByCode("EMPLOYEE").ifPresent(roles::add);
        }

        User user = User.builder()
                .tenantId(tenantId)
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .department(department)
                .status(UserStatus.ACTIVE)
                .roles(roles)
                .build();

        user = userRepository.save(user);
        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setDeleted(true);
        userRepository.save(user);
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/controller/UserController.java', `package com.coreerp.domain.security.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.security.dto.UserCreateRequest;
import com.coreerp.domain.security.dto.UserResponse;
import com.coreerp.domain.security.service.UserService;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Endpoints for managing enterprise users within tenant")
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('user:read') or hasRole('TENANT_ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "List users for the current tenant")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> listUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        PageResponse<UserResponse> response = userService.listUsers(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('user:read') or hasRole('TENANT_ADMIN')")
    @Operation(summary = "Get user details by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable String id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('user:create') or hasRole('TENANT_ADMIN')")
    @Operation(summary = "Create a new user within the current tenant")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody UserCreateRequest request) {
        String tenantId = TenantContext.getTenantId();
        UserResponse response = userService.createUser(tenantId, request);
        return ResponseEntity.ok(ApiResponse.ok("User created successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('user:delete') or hasRole('TENANT_ADMIN')")
    @Operation(summary = "Soft delete a user")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/security/controller/AuditController.java', `package com.coreerp.domain.security.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.security.dto.AuditLogResponse;
import com.coreerp.domain.security.entity.AuditLog;
import com.coreerp.domain.security.repository.AuditLogRepository;
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
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "Query enterprise security and business operation audit logs")
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('audit:read') or hasRole('TENANT_ADMIN') or hasRole('SUPER_ADMIN') or hasRole('AUDITOR')")
    @Operation(summary = "Query audit logs for the current tenant")
    public ResponseEntity<ApiResponse<PageResponse<AuditLogResponse>>> listAuditLogs(
            @PageableDefault(size = 50) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<AuditLog> page = auditLogRepository.findAllByTenantId(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page.map(AuditLogResponse::from))));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/tenant/controller/TenantController.java', `package com.coreerp.domain.tenant.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.exception.ResourceNotFoundException;
import com.coreerp.domain.tenant.dto.TenantResponse;
import com.coreerp.domain.tenant.entity.Tenant;
import com.coreerp.domain.tenant.repository.TenantRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
@Tag(name = "Tenants", description = "Multi-tenant configuration and subscription management")
public class TenantController {

    private final TenantRepository tenantRepository;

    @GetMapping("/current")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current tenant configuration")
    public ResponseEntity<ApiResponse<TenantResponse>> getCurrentTenant() {
        String tenantId = TenantContext.getTenantId();
        Tenant tenant = tenantRepository.findByIdAndIsDeletedFalse(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant", "id", tenantId));
        return ResponseEntity.ok(ApiResponse.ok(TenantResponse.from(tenant)));
    }
}
`);

console.log("Phase 1 Backend scaffolding completed.");
