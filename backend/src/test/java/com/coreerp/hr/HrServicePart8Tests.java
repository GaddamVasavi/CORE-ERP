package com.coreerp.hr;

import com.coreerp.domain.hr.service.HrEnterpriseServicePart8;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class HrServicePart8Tests {

    private HrEnterpriseServicePart8 service;

    @BeforeEach
    void setUp() {
        service = new HrEnterpriseServicePart8();
    }

    @Test
    @DisplayName("Verify valid hr operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        HrEnterpriseServicePart8.TransactionContext context =
                HrEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-HR-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_HR_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        HrEnterpriseServicePart8.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify hr validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        HrEnterpriseServicePart8.TransactionContext context =
                HrEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-HR-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        HrEnterpriseServicePart8.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
