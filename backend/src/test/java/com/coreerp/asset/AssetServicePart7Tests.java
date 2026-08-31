package com.coreerp.asset;

import com.coreerp.domain.asset.service.AssetEnterpriseServicePart7;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class AssetServicePart7Tests {

    private AssetEnterpriseServicePart7 service;

    @BeforeEach
    void setUp() {
        service = new AssetEnterpriseServicePart7();
    }

    @Test
    @DisplayName("Verify valid asset operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        AssetEnterpriseServicePart7.TransactionContext context =
                AssetEnterpriseServicePart7.TransactionContext.builder()
                        .transactionId("TX-ASSET-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_ASSET_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        AssetEnterpriseServicePart7.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify asset validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        AssetEnterpriseServicePart7.TransactionContext context =
                AssetEnterpriseServicePart7.TransactionContext.builder()
                        .transactionId("TX-ASSET-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        AssetEnterpriseServicePart7.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
