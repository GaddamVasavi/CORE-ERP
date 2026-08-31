package com.coreerp.manufacturing;

import com.coreerp.domain.manufacturing.service.ManufacturingEnterpriseServicePart1;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class ManufacturingServicePart1Tests {

    private ManufacturingEnterpriseServicePart1 service;

    @BeforeEach
    void setUp() {
        service = new ManufacturingEnterpriseServicePart1();
    }

    @Test
    @DisplayName("Verify valid manufacturing operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        ManufacturingEnterpriseServicePart1.TransactionContext context =
                ManufacturingEnterpriseServicePart1.TransactionContext.builder()
                        .transactionId("TX-MANUFACTURING-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_MANUFACTURING_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        ManufacturingEnterpriseServicePart1.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify manufacturing validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        ManufacturingEnterpriseServicePart1.TransactionContext context =
                ManufacturingEnterpriseServicePart1.TransactionContext.builder()
                        .transactionId("TX-MANUFACTURING-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        ManufacturingEnterpriseServicePart1.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
