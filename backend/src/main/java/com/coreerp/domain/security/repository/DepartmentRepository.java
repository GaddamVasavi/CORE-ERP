package com.coreerp.domain.security.repository;

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
