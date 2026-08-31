package com.coreerp.inventory;

import com.coreerp.domain.inventory.service.InventoryEnterpriseServicePart1;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class InventoryServicePart1Tests {

    private InventoryEnterpriseServicePart1 service;

    @BeforeEach
    void setUp() {
        service = new InventoryEnterpriseServicePart1();
    }

    @Test
    @DisplayName("Verify valid inventory operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        InventoryEnterpriseServicePart1.TransactionContext context =
                InventoryEnterpriseServicePart1.TransactionContext.builder()
                        .transactionId("TX-INVENTORY-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_INVENTORY_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        InventoryEnterpriseServicePart1.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify inventory validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        InventoryEnterpriseServicePart1.TransactionContext context =
                InventoryEnterpriseServicePart1.TransactionContext.builder()
                        .transactionId("TX-INVENTORY-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        InventoryEnterpriseServicePart1.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
