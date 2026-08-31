package com.coreerp.analytics;

import com.coreerp.domain.analytics.service.AnalyticsEnterpriseServicePart8;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class AnalyticsServicePart8Tests {

    private AnalyticsEnterpriseServicePart8 service;

    @BeforeEach
    void setUp() {
        service = new AnalyticsEnterpriseServicePart8();
    }

    @Test
    @DisplayName("Verify valid analytics operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        AnalyticsEnterpriseServicePart8.TransactionContext context =
                AnalyticsEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-ANALYTICS-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_ANALYTICS_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        AnalyticsEnterpriseServicePart8.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify analytics validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        AnalyticsEnterpriseServicePart8.TransactionContext context =
                AnalyticsEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-ANALYTICS-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        AnalyticsEnterpriseServicePart8.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
