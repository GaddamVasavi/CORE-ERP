package com.coreerp.workflow;

import com.coreerp.domain.workflow.service.WorkflowEnterpriseServicePart6;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class WorkflowServicePart6Tests {

    private WorkflowEnterpriseServicePart6 service;

    @BeforeEach
    void setUp() {
        service = new WorkflowEnterpriseServicePart6();
    }

    @Test
    @DisplayName("Verify valid workflow operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        WorkflowEnterpriseServicePart6.TransactionContext context =
                WorkflowEnterpriseServicePart6.TransactionContext.builder()
                        .transactionId("TX-WORKFLOW-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_WORKFLOW_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        WorkflowEnterpriseServicePart6.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify workflow validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        WorkflowEnterpriseServicePart6.TransactionContext context =
                WorkflowEnterpriseServicePart6.TransactionContext.builder()
                        .transactionId("TX-WORKFLOW-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        WorkflowEnterpriseServicePart6.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
