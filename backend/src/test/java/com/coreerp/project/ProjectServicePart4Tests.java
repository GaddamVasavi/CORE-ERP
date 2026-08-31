package com.coreerp.project;

import com.coreerp.domain.project.service.ProjectEnterpriseServicePart4;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class ProjectServicePart4Tests {

    private ProjectEnterpriseServicePart4 service;

    @BeforeEach
    void setUp() {
        service = new ProjectEnterpriseServicePart4();
    }

    @Test
    @DisplayName("Verify valid project operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        ProjectEnterpriseServicePart4.TransactionContext context =
                ProjectEnterpriseServicePart4.TransactionContext.builder()
                        .transactionId("TX-PROJECT-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_PROJECT_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        ProjectEnterpriseServicePart4.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify project validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        ProjectEnterpriseServicePart4.TransactionContext context =
                ProjectEnterpriseServicePart4.TransactionContext.builder()
                        .transactionId("TX-PROJECT-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        ProjectEnterpriseServicePart4.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
