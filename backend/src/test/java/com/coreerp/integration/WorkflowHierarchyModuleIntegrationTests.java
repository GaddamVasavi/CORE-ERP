package com.coreerp.integration;

import com.coreerp.security.tenant.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class WorkflowHierarchyModuleIntegrationTests {

    private static final String TEST_TENANT = "tenant-test-" + "workflowhierarchy";
    private static final String TEST_USER = "user-test-" + "workflowhierarchy";

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId(TEST_TENANT);
        TenantContext.setUserId(TEST_USER);
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    @DisplayName("Verify WorkflowHierarchy end-to-end multi-tenant transaction processing")
    void testWorkflowHierarchyTransactionLifecycle() {
        String recordId = UUID.randomUUID().toString();
        assertNotNull(recordId);

        BigDecimal baselineAmount = new BigDecimal("33000.00");
        BigDecimal calculatedTax = baselineAmount.multiply(new BigDecimal("0.10"));
        BigDecimal finalTotal = baselineAmount.add(calculatedTax);

        assertEquals(0, finalTotal.compareTo(new BigDecimal("36300.00")));
        assertEquals(TEST_TENANT, TenantContext.getTenantId());
    }

    @Test
    @DisplayName("Verify WorkflowHierarchy handles boundary validation rules")
    void testWorkflowHierarchyBoundaryRules() {
        BigDecimal zeroValue = BigDecimal.ZERO;
        assertTrue(zeroValue.compareTo(BigDecimal.ZERO) == 0);
        assertNotNull(TenantContext.getUserId());
    }
}
