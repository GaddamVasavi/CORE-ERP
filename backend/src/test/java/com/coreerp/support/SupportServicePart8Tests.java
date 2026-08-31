package com.coreerp.support;

import com.coreerp.domain.support.service.SupportEnterpriseServicePart8;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class SupportServicePart8Tests {

    private SupportEnterpriseServicePart8 service;

    @BeforeEach
    void setUp() {
        service = new SupportEnterpriseServicePart8();
    }

    @Test
    @DisplayName("Verify valid support operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        SupportEnterpriseServicePart8.TransactionContext context =
                SupportEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-SUPPORT-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_SUPPORT_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        SupportEnterpriseServicePart8.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify support validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        SupportEnterpriseServicePart8.TransactionContext context =
                SupportEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-SUPPORT-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        SupportEnterpriseServicePart8.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
