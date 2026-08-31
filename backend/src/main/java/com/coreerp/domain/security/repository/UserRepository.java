package com.coreerp.domain.security.repository;

import com.coreerp.domain.security.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    Optional<User> findByIdAndIsDeletedFalse(String id);
    Page<User> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    boolean existsByEmail(String email);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
