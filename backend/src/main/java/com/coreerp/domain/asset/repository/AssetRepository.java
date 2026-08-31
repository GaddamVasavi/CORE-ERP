package com.coreerp.domain.asset.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, String> {
    Page<Asset> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
