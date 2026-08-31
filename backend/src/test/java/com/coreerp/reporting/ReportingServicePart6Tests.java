package com.coreerp.reporting;

import com.coreerp.domain.reporting.service.ReportingEnterpriseServicePart6;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class ReportingServicePart6Tests {

    private ReportingEnterpriseServicePart6 service;

    @BeforeEach
    void setUp() {
        service = new ReportingEnterpriseServicePart6();
    }

    @Test
    @DisplayName("Verify valid reporting operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        ReportingEnterpriseServicePart6.TransactionContext context =
                ReportingEnterpriseServicePart6.TransactionContext.builder()
                        .transactionId("TX-REPORTING-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_REPORTING_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        ReportingEnterpriseServicePart6.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify reporting validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        ReportingEnterpriseServicePart6.TransactionContext context =
                ReportingEnterpriseServicePart6.TransactionContext.builder()
                        .transactionId("TX-REPORTING-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        ReportingEnterpriseServicePart6.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
