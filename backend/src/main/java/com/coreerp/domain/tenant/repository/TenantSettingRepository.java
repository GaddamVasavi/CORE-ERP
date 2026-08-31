package com.coreerp.domain.tenant.repository;

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
