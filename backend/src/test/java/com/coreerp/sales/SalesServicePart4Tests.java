package com.coreerp.sales;

import com.coreerp.domain.sales.service.SalesEnterpriseServicePart4;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class SalesServicePart4Tests {

    private SalesEnterpriseServicePart4 service;

    @BeforeEach
    void setUp() {
        service = new SalesEnterpriseServicePart4();
    }

    @Test
    @DisplayName("Verify valid sales operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        SalesEnterpriseServicePart4.TransactionContext context =
                SalesEnterpriseServicePart4.TransactionContext.builder()
                        .transactionId("TX-SALES-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_SALES_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        SalesEnterpriseServicePart4.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify sales validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        SalesEnterpriseServicePart4.TransactionContext context =
                SalesEnterpriseServicePart4.TransactionContext.builder()
                        .transactionId("TX-SALES-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        SalesEnterpriseServicePart4.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
