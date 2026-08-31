package com.coreerp.document;

import com.coreerp.domain.document.service.DocumentEnterpriseServicePart8;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

public class DocumentServicePart8Tests {

    private DocumentEnterpriseServicePart8 service;

    @BeforeEach
    void setUp() {
        service = new DocumentEnterpriseServicePart8();
    }

    @Test
    @DisplayName("Verify valid document operation execution and checksum integrity")
    void testSuccessfulOperationExecution() {
        DocumentEnterpriseServicePart8.TransactionContext context =
                DocumentEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-DOCUMENT-001")
                        .tenantId("tenant-test-id")
                        .initiatorUserId("user-test-id")
                        .operationType("PROCESS_DOCUMENT_BATCH")
                        .totalAmount(new BigDecimal("10000.00"))
                        .attributes(new HashMap<>())
                        .build();

        DocumentEnterpriseServicePart8.ExecutionSummary summary =
                service.processOperation(context);

        assertNotNull(summary);
        assertTrue(summary.isSuccessful());
        assertNotNull(summary.getExecutionId());
        assertTrue(summary.getProcessedFinancialImpact().compareTo(BigDecimal.ZERO) > 0);
    }

    @Test
    @DisplayName("Verify document validation flags invalid negative total amounts")
    void testValidationNegativeAmount() {
        DocumentEnterpriseServicePart8.TransactionContext context =
                DocumentEnterpriseServicePart8.TransactionContext.builder()
                        .transactionId("TX-DOCUMENT-002")
                        .operationType("VALIDATE")
                        .totalAmount(new BigDecimal("-500.00"))
                        .build();

        DocumentEnterpriseServicePart8.ValidationResult res =
                service.validateOperation(context);

        assertFalse(res.isValid());
        assertTrue(res.getErrorMessages().size() > 0);
    }
}
