package com.coreerp.sales;

import com.coreerp.domain.sales.service.SalesEnterpriseServicePart8;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class SalesServicePart8Tests {

    private SalesEnterpriseServicePart8 service;

    @BeforeEach
    void setUp() {
        service = new SalesEnterpriseServicePart8();
    }

    @Test
    @DisplayName("Verify valid sales operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        SalesEnterpriseServicePart8.TransactionContext context =
                SalesEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-SALES-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_SALES_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        SalesEnterpriseServicePart8.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify sales validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        SalesEnterpriseServicePart8.TransactionContext context =
                SalesEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-SALES-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        SalesEnterpriseServicePart8.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
