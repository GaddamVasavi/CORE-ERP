package com.coreerp.domain.hr.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Page<Employee> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<Employee> findByTenantIdAndEmployeeCodeAndIsDeletedFalse(String tenantId, String employeeCode);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
