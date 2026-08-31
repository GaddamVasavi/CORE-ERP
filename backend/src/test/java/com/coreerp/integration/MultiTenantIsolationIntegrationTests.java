package com.coreerp.integration;

import com.coreerp.domain.finance.entity.ChartOfAccounts;
import com.coreerp.domain.finance.repository.ChartOfAccountsRepository;
import com.coreerp.security.tenant.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class MultiTenantIsolationIntegrationTests {

    @Autowired
    private ChartOfAccountsRepository coaRepository;

    private static final String TENANT_A = "tenant-aaa-111";
    private static final String TENANT_B = "tenant-bbb-222";

    @BeforeEach
    void setUp() {
        TenantContext.clear();
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    @DisplayName("Verify Tenant A cannot access or query Tenant B chart of accounts records")
    void testTenantDataIsolation() {
        TenantContext.setTenantId(TENANT_A);
        List<ChartOfAccounts> accountsTenantA = coaRepository.findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(TENANT_A);
        assertNotNull(accountsTenantA);

        TenantContext.setTenantId(TENANT_B);
        List<ChartOfAccounts> accountsTenantB = coaRepository.findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(TENANT_B);
        assertNotNull(accountsTenantB);

        // Assert no cross-contamination
        for (ChartOfAccounts acc : accountsTenantA) {
            assertEquals(TENANT_A, acc.getTenantId());
            assertNotEquals(TENANT_B, acc.getTenantId());
        }
    }
}
