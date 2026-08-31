package com.coreerp.domain.security.repository;

import com.coreerp.domain.security.entity.RefreshToken;
import com.coreerp.domain.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);
    @Modifying
    int deleteByUser(User user);
}
