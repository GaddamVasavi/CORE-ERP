package com.coreerp.domain.document.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {
    Page<Document> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
