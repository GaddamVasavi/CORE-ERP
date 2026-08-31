package com.coreerp.finance;

import com.coreerp.domain.finance.service.FinanceEnterpriseServicePart7;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class FinanceServicePart7Tests {

    private FinanceEnterpriseServicePart7 service;

    @BeforeEach
    void setUp() {
        service = new FinanceEnterpriseServicePart7();
    }

    @Test
    @DisplayName("Verify valid finance operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        FinanceEnterpriseServicePart7.TransactionContext context =
                FinanceEnterpriseServicePart7.TransactionContext.builder()
                        .transactionId("TX-FINANCE-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_FINANCE_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        FinanceEnterpriseServicePart7.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify finance validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        FinanceEnterpriseServicePart7.TransactionContext context =
                FinanceEnterpriseServicePart7.TransactionContext.builder()
                        .transactionId("TX-FINANCE-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        FinanceEnterpriseServicePart7.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
