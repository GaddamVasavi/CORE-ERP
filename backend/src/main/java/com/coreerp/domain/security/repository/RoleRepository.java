package com.coreerp.domain.security.repository;

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
