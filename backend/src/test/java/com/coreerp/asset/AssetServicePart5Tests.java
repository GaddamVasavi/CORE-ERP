package com.coreerp.asset;

import com.coreerp.domain.asset.service.AssetEnterpriseServicePart5;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class AssetServicePart5Tests {

    private AssetEnterpriseServicePart5 service;

    @BeforeEach
    void setUp() {
        service = new AssetEnterpriseServicePart5();
    }

    @Test
    @DisplayName("Verify valid asset operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        AssetEnterpriseServicePart5.TransactionContext context =
                AssetEnterpriseServicePart5.TransactionContext.builder()
                        .transactionId("TX-ASSET-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_ASSET_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        AssetEnterpriseServicePart5.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify asset validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        AssetEnterpriseServicePart5.TransactionContext context =
                AssetEnterpriseServicePart5.TransactionContext.builder()
                        .transactionId("TX-ASSET-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        AssetEnterpriseServicePart5.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
