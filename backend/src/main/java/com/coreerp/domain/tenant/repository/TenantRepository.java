package com.coreerp.domain.tenant.repository;

import com.coreerp.domain.tenant.entity.Tenant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, String> {
    Optional<Tenant> findBySubdomainAndIsDeletedFalse(String subdomain);
    Optional<Tenant> findByCustomDomainAndIsDeletedFalse(String customDomain);
    Optional<Tenant> findByIdAndIsDeletedFalse(String id);
    Page<Tenant> findAllByIsDeletedFalse(Pageable pageable);
    boolean existsBySubdomain(String subdomain);
}
