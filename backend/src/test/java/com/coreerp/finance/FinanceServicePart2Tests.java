package com.coreerp.finance;

import com.coreerp.domain.finance.service.FinanceEnterpriseServicePart2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class FinanceServicePart2Tests {

    private FinanceEnterpriseServicePart2 service;

    @BeforeEach
    void setUp() {
        service = new FinanceEnterpriseServicePart2();
    }

    @Test
    @DisplayName("Verify valid finance operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        FinanceEnterpriseServicePart2.TransactionContext context =
                FinanceEnterpriseServicePart2.TransactionContext.builder()
                        .transactionId("TX-FINANCE-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_FINANCE_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        FinanceEnterpriseServicePart2.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify finance validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        FinanceEnterpriseServicePart2.TransactionContext context =
                FinanceEnterpriseServicePart2.TransactionContext.builder()
                        .transactionId("TX-FINANCE-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        FinanceEnterpriseServicePart2.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
