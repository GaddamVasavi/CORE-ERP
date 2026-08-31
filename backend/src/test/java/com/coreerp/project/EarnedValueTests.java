package com.coreerp.project;

import com.coreerp.domain.project.entity.Project;
import com.coreerp.domain.project.service.EarnedValueManagementService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class EarnedValueTests {

    private final EarnedValueManagementService evmService = new EarnedValueManagementService();

    @Test
    @DisplayName("Verify Earned Value Management (EVM) CPI and SPI index calculations")
    void testEvmCalculations() {
        Project project = Project.builder()
                .projectCode("PRJ-EVM-01")
                .budgetAmount(new BigDecimal("100000.00"))
                .costAmount(new BigDecimal("40000.00"))
                .build();

        BigDecimal actualProgress = new BigDecimal("50.00"); // 50% done = $50,000 EV
        BigDecimal plannedProgress = new BigDecimal("45.00"); // 45% planned = $45,000 PV

        EarnedValueManagementService.ProjectPerformanceMetrics metrics =
                evmService.computeEvm(project, actualProgress, plannedProgress);

        assertEquals(new BigDecimal("50000.0000"), metrics.getEarnedValue());
        assertEquals(new BigDecimal("45000.0000"), metrics.getPlannedValue());
        assertEquals(new BigDecimal("10000.0000"), metrics.getCostVariance());
        assertEquals(new BigDecimal("5000.0000"), metrics.getScheduleVariance());
        assertEquals(new BigDecimal("1.25"), metrics.getCostPerformanceIndex()); // 50000 / 40000 = 1.25
        assertEquals(new BigDecimal("1.11"), metrics.getSchedulePerformanceIndex()); // 50000 / 45000 = 1.11
        assertTrue(metrics.isUnderBudget());
        assertTrue(metrics.isAheadOfSchedule());
    }
}
