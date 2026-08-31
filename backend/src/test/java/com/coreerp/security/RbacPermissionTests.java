package com.coreerp.security;

import com.coreerp.domain.security.entity.Permission;
import com.coreerp.domain.security.entity.Role;
import com.coreerp.domain.security.entity.User;
import com.coreerp.security.service.CustomUserDetails;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

public class RbacPermissionTests {

    @Test
    @DisplayName("Verify UserDetails correctly grants authorities from granular permissions")
    void testUserDetailsPermissions() {
        Permission perm1 = Permission.builder().name("invoice:approve").module("FINANCE").action("APPROVE").build();
        Permission perm2 = Permission.builder().name("invoice:pay").module("FINANCE").action("PAY").build();

        Role cfoRole = Role.builder()
                .code("CFO")
                .name("Chief Financial Officer")
                .permissions(new HashSet<>(java.util.Arrays.asList(perm1, perm2)))
                .build();

        User user = User.builder()
                .email("cfo@enterprise.com")
                .firstName("Sarah")
                .lastName("Connor")
                .roles(new HashSet<>(Collections.singletonList(cfoRole)))
                .isSuperAdmin(false)
                .build();

        CustomUserDetails userDetails = CustomUserDetails.build(user);

        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CFO")));
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("invoice:approve")));
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("invoice:pay")));
        assertFalse(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN")));
    }
}
