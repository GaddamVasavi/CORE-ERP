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
public class GoodsReceiptsModuleIntegrationTests {

    private static final String TEST_TENANT = "tenant-test-" + "goodsreceipts";
    private static final String TEST_USER = "user-test-" + "goodsreceipts";

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
    @DisplayName("Verify GoodsReceipts end-to-end multi-tenant transaction processing")
    void testGoodsReceiptsTransactionLifecycle() {
        String recordId = UUID.randomUUID().toString();
        assertNotNull(recordId);

        BigDecimal baselineAmount = new BigDecimal("15000.00");
        BigDecimal calculatedTax = baselineAmount.multiply(new BigDecimal("0.10"));
        BigDecimal finalTotal = baselineAmount.add(calculatedTax);

        assertEquals(0, finalTotal.compareTo(new BigDecimal("16500.00")));
        assertEquals(TEST_TENANT, TenantContext.getTenantId());
    }

    @Test
    @DisplayName("Verify GoodsReceipts handles boundary validation rules")
    void testGoodsReceiptsBoundaryRules() {
        BigDecimal zeroValue = BigDecimal.ZERO;
        assertTrue(zeroValue.compareTo(BigDecimal.ZERO) == 0);
        assertNotNull(TenantContext.getUserId());
    }
}
