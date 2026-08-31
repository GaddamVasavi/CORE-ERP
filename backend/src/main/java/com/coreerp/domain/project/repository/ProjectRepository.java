package com.coreerp.domain.project.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    Page<Project> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
