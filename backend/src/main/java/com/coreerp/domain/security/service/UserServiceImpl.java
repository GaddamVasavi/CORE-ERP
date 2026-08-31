package com.coreerp.domain.security.service;

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
