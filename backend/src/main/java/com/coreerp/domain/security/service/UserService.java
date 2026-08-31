package com.coreerp.domain.security.service;

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
