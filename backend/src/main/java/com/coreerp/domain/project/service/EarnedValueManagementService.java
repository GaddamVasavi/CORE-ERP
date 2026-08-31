package com.coreerp.domain.project.service;

import com.coreerp.domain.project.entity.Project;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class EarnedValueManagementService {

    @Data
    @Builder
    public static class ProjectPerformanceMetrics {
        private String projectId;
        private String projectCode;
        private BigDecimal plannedValue;   // PV
        private BigDecimal actualCost;     // AC
        private BigDecimal earnedValue;   // EV
        private BigDecimal costVariance;  // CV = EV - AC
        private BigDecimal scheduleVariance; // SV = EV - PV
        private BigDecimal costPerformanceIndex; // CPI = EV / AC
        private BigDecimal schedulePerformanceIndex; // SPI = EV / PV
        private boolean isUnderBudget;
        private boolean isAheadOfSchedule;
    }

    public ProjectPerformanceMetrics computeEvm(
            Project project,
            BigDecimal percentCompleted,
            BigDecimal plannedProgressPercent) {

        BigDecimal budget = project.getBudgetAmount();
        BigDecimal actualCost = project.getCostAmount();

        BigDecimal earnedValue = budget.multiply(percentCompleted).divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal plannedValue = budget.multiply(plannedProgressPercent).divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);

        BigDecimal costVariance = earnedValue.subtract(actualCost);
        BigDecimal scheduleVariance = earnedValue.subtract(plannedValue);

        BigDecimal cpi = BigDecimal.ONE;
        if (actualCost.compareTo(BigDecimal.ZERO) > 0) {
            cpi = earnedValue.divide(actualCost, 2, RoundingMode.HALF_UP);
        }

        BigDecimal spi = BigDecimal.ONE;
        if (plannedValue.compareTo(BigDecimal.ZERO) > 0) {
            spi = earnedValue.divide(plannedValue, 2, RoundingMode.HALF_UP);
        }

        return ProjectPerformanceMetrics.builder()
                .projectId(project.getId())
                .projectCode(project.getProjectCode())
                .plannedValue(plannedValue)
                .actualCost(actualCost)
                .earnedValue(earnedValue)
                .costVariance(costVariance)
                .scheduleVariance(scheduleVariance)
                .costPerformanceIndex(cpi)
                .schedulePerformanceIndex(spi)
                .isUnderBudget(costVariance.compareTo(BigDecimal.ZERO) >= 0)
                .isAheadOfSchedule(scheduleVariance.compareTo(BigDecimal.ZERO) >= 0)
                .build();
    }
}
