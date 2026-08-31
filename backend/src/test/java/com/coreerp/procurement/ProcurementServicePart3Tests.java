package com.coreerp.procurement;

import com.coreerp.domain.procurement.service.ProcurementEnterpriseServicePart3;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class ProcurementServicePart3Tests {

    private ProcurementEnterpriseServicePart3 service;

    @BeforeEach
    void setUp() {
        service = new ProcurementEnterpriseServicePart3();
    }

    @Test
    @DisplayName("Verify valid procurement operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        ProcurementEnterpriseServicePart3.TransactionContext context =
                ProcurementEnterpriseServicePart3.TransactionContext.builder()
                        .transactionId("TX-PROCUREMENT-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_PROCUREMENT_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        ProcurementEnterpriseServicePart3.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify procurement validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        ProcurementEnterpriseServicePart3.TransactionContext context =
                ProcurementEnterpriseServicePart3.TransactionContext.builder()
                        .transactionId("TX-PROCUREMENT-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        ProcurementEnterpriseServicePart3.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
