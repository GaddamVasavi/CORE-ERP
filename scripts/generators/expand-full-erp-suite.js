const fs = require('fs');
const path = require('path');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  const fullPath = path.resolve(process.cwd(), filePath);
  ensureDirSync(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

console.log("Generating Full Production-Grade Enterprise ERP Suite...");

// -------------------------------------------------------------
// 1. Comprehensive Backend Services
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/finance/service/FinancialReportService.java', `package com.coreerp.domain.finance.service;

import com.coreerp.domain.finance.entity.AccountType;
import com.coreerp.domain.finance.entity.ChartOfAccounts;
import com.coreerp.domain.finance.entity.JournalStatus;
import com.coreerp.domain.finance.repository.ChartOfAccountsRepository;
import com.coreerp.domain.finance.repository.JournalEntryRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FinancialReportService {

    private final ChartOfAccountsRepository coaRepository;
    private final JournalEntryRepository journalEntryRepository;

    @Data
    @Builder
    public static class AccountBalanceSummary {
        private String accountCode;
        private String accountName;
        private AccountType accountType;
        private BigDecimal balance;
    }

    @Data
    @Builder
    public static class IncomeStatementReport {
        private LocalDate startDate;
        private LocalDate endDate;
        private List<AccountBalanceSummary> revenueAccounts;
        private List<AccountBalanceSummary> expenseAccounts;
        private BigDecimal totalRevenue;
        private BigDecimal totalExpenses;
        private BigDecimal netIncome;
    }

    @Data
    @Builder
    public static class BalanceSheetReport {
        private LocalDate asOfDate;
        private List<AccountBalanceSummary> assetAccounts;
        private List<AccountBalanceSummary> liabilityAccounts;
        private List<AccountBalanceSummary> equityAccounts;
        private BigDecimal totalAssets;
        private BigDecimal totalLiabilities;
        private BigDecimal totalEquity;
        private boolean isBalanced;
    }

    @Transactional(readOnly = true)
    public IncomeStatementReport generateIncomeStatement(String tenantId, LocalDate startDate, LocalDate endDate) {
        List<ChartOfAccounts> allAccounts = coaRepository.findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(tenantId);

        List<AccountBalanceSummary> revenues = new ArrayList<>();
        List<AccountBalanceSummary> expenses = new ArrayList<>();
        BigDecimal totalRev = BigDecimal.ZERO;
        BigDecimal totalExp = BigDecimal.ZERO;

        for (ChartOfAccounts acc : allAccounts) {
            if (acc.getAccountType() == AccountType.REVENUE) {
                revenues.add(AccountBalanceSummary.builder()
                        .accountCode(acc.getAccountCode())
                        .accountName(acc.getAccountName())
                        .accountType(acc.getAccountType())
                        .balance(acc.getCurrentBalance())
                        .build());
                totalRev = totalRev.add(acc.getCurrentBalance());
            } else if (acc.getAccountType() == AccountType.EXPENSE) {
                expenses.add(AccountBalanceSummary.builder()
                        .accountCode(acc.getAccountCode())
                        .accountName(acc.getAccountName())
                        .accountType(acc.getAccountType())
                        .balance(acc.getCurrentBalance())
                        .build());
                totalExp = totalExp.add(acc.getCurrentBalance());
            }
        }

        BigDecimal netIncome = totalRev.subtract(totalExp);

        return IncomeStatementReport.builder()
                .startDate(startDate)
                .endDate(endDate)
                .revenueAccounts(revenues)
                .expenseAccounts(expenses)
                .totalRevenue(totalRev)
                .totalExpenses(totalExp)
                .netIncome(netIncome)
                .build();
    }

    @Transactional(readOnly = true)
    public BalanceSheetReport generateBalanceSheet(String tenantId, LocalDate asOfDate) {
        List<ChartOfAccounts> allAccounts = coaRepository.findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(tenantId);

        List<AccountBalanceSummary> assets = new ArrayList<>();
        List<AccountBalanceSummary> liabilities = new ArrayList<>();
        List<AccountBalanceSummary> equity = new ArrayList<>();
        BigDecimal totalAssets = BigDecimal.ZERO;
        BigDecimal totalLiabilities = BigDecimal.ZERO;
        BigDecimal totalEquity = BigDecimal.ZERO;

        for (ChartOfAccounts acc : allAccounts) {
            if (acc.getAccountType() == AccountType.ASSET) {
                assets.add(AccountBalanceSummary.builder()
                        .accountCode(acc.getAccountCode())
                        .accountName(acc.getAccountName())
                        .accountType(acc.getAccountType())
                        .balance(acc.getCurrentBalance())
                        .build());
                totalAssets = totalAssets.add(acc.getCurrentBalance());
            } else if (acc.getAccountType() == AccountType.LIABILITY) {
                liabilities.add(AccountBalanceSummary.builder()
                        .accountCode(acc.getAccountCode())
                        .accountName(acc.getAccountName())
                        .accountType(acc.getAccountType())
                        .balance(acc.getCurrentBalance())
                        .build());
                totalLiabilities = totalLiabilities.add(acc.getCurrentBalance());
            } else if (acc.getAccountType() == AccountType.EQUITY) {
                equity.add(AccountBalanceSummary.builder()
                        .accountCode(acc.getAccountCode())
                        .accountName(acc.getAccountName())
                        .accountType(acc.getAccountType())
                        .balance(acc.getCurrentBalance())
                        .build());
                totalEquity = totalEquity.add(acc.getCurrentBalance());
            }
        }

        BigDecimal totalLiabilitiesAndEquity = totalLiabilities.add(totalEquity);
        boolean balanced = totalAssets.compareTo(totalLiabilitiesAndEquity) == 0;

        return BalanceSheetReport.builder()
                .asOfDate(asOfDate)
                .assetAccounts(assets)
                .liabilityAccounts(liabilities)
                .equityAccounts(equity)
                .totalAssets(totalAssets)
                .totalLiabilities(totalLiabilities)
                .totalEquity(totalEquity)
                .isBalanced(balanced)
                .build();
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/sales/service/SalesPricingService.java', `package com.coreerp.domain.sales.service;

import com.coreerp.domain.inventory.entity.Product;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class SalesPricingService {

    @Data
    @Builder
    public static class PriceCalculationResult {
        private BigDecimal unitPrice;
        private BigDecimal quantity;
        private BigDecimal grossAmount;
        private BigDecimal discountPercent;
        private BigDecimal discountAmount;
        private BigDecimal taxableAmount;
        private BigDecimal taxPercent;
        private BigDecimal taxAmount;
        private BigDecimal netTotalAmount;
        private BigDecimal profitMarginPercent;
    }

    public PriceCalculationResult calculateLineItemPricing(
            Product product,
            BigDecimal quantity,
            BigDecimal discountPercent,
            BigDecimal taxPercent) {

        BigDecimal unitPrice = product.getSalesPrice();
        BigDecimal grossAmount = unitPrice.multiply(quantity);

        BigDecimal discountAmount = grossAmount.multiply(discountPercent)
                .divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal taxableAmount = grossAmount.subtract(discountAmount);

        BigDecimal taxAmount = taxableAmount.multiply(taxPercent)
                .divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal netTotalAmount = taxableAmount.add(taxAmount);

        BigDecimal totalCost = product.getPurchasePrice().multiply(quantity);
        BigDecimal grossProfit = taxableAmount.subtract(totalCost);
        BigDecimal profitMarginPercent = BigDecimal.ZERO;

        if (taxableAmount.compareTo(BigDecimal.ZERO) > 0) {
            profitMarginPercent = grossProfit.multiply(new BigDecimal("100"))
                    .divide(taxableAmount, 2, RoundingMode.HALF_UP);
        }

        return PriceCalculationResult.builder()
                .unitPrice(unitPrice)
                .quantity(quantity)
                .grossAmount(grossAmount)
                .discountPercent(discountPercent)
                .discountAmount(discountAmount)
                .taxableAmount(taxableAmount)
                .taxPercent(taxPercent)
                .taxAmount(taxAmount)
                .netTotalAmount(netTotalAmount)
                .profitMarginPercent(profitMarginPercent)
                .build();
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/hr/service/PayrollCalculationEngine.java', `package com.coreerp.domain.hr.service;

import com.coreerp.domain.hr.entity.Employee;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PayrollCalculationEngine {

    @Data
    @Builder
    public static class PayslipCalculationResult {
        private String employeeId;
        private String employeeCode;
        private String employeeName;
        private BigDecimal basicSalary;
        private BigDecimal allowances;
        private BigDecimal overtimePay;
        private BigDecimal bonus;
        private BigDecimal grossPay;
        private BigDecimal incomeTax;
        private BigDecimal retirementPension;
        private BigDecimal healthInsurance;
        private BigDecimal totalDeductions;
        private BigDecimal netPay;
    }

    public PayslipCalculationResult computeEmployeePayroll(
            Employee employee,
            BigDecimal overtimeHours,
            BigDecimal hourlyOvertimeRate,
            BigDecimal bonus) {

        BigDecimal basicSalary = employee.getSalaryAmount();
        BigDecimal allowances = basicSalary.multiply(new BigDecimal("0.25")).setScale(4, RoundingMode.HALF_UP); // 25% allowance
        BigDecimal overtimePay = overtimeHours.multiply(hourlyOvertimeRate).setScale(4, RoundingMode.HALF_UP);
        BigDecimal grossPay = basicSalary.add(allowances).add(overtimePay).add(bonus);

        // Progressive Tax Model:
        // <= $3000: 5%
        // $3001 - $7000: 10%
        // > $7000: 15%
        BigDecimal incomeTax = BigDecimal.ZERO;
        if (grossPay.compareTo(new BigDecimal("3000.00")) <= 0) {
            incomeTax = grossPay.multiply(new BigDecimal("0.05"));
        } else if (grossPay.compareTo(new BigDecimal("7000.00")) <= 0) {
            incomeTax = new BigDecimal("150.00").add(
                    grossPay.subtract(new BigDecimal("3000.00")).multiply(new BigDecimal("0.10")));
        } else {
            incomeTax = new BigDecimal("550.00").add(
                    grossPay.subtract(new BigDecimal("7000.00")).multiply(new BigDecimal("0.15")));
        }
        incomeTax = incomeTax.setScale(4, RoundingMode.HALF_UP);

        BigDecimal retirementPension = basicSalary.multiply(new BigDecimal("0.05")).setScale(4, RoundingMode.HALF_UP); // 5% pension
        BigDecimal healthInsurance = new BigDecimal("150.0000"); // Flat benefit

        BigDecimal totalDeductions = incomeTax.add(retirementPension).add(healthInsurance);
        BigDecimal netPay = grossPay.subtract(totalDeductions);

        return PayslipCalculationResult.builder()
                .employeeId(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .employeeName(employee.getFullName())
                .basicSalary(basicSalary)
                .allowances(allowances)
                .overtimePay(overtimePay)
                .bonus(bonus)
                .grossPay(grossPay)
                .incomeTax(incomeTax)
                .retirementPension(retirementPension)
                .healthInsurance(healthInsurance)
                .totalDeductions(totalDeductions)
                .netPay(netPay)
                .build();
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/project/service/EarnedValueManagementService.java', `package com.coreerp.domain.project.service;

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
`);

// -------------------------------------------------------------
// 2. Comprehensive Additional Unit Tests
// -------------------------------------------------------------

writeFile('backend/src/test/java/com/coreerp/sales/SalesPricingTests.java', `package com.coreerp.sales;

import com.coreerp.domain.inventory.entity.Product;
import com.coreerp.domain.sales.service.SalesPricingService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class SalesPricingTests {

    private final SalesPricingService pricingService = new SalesPricingService();

    @Test
    @DisplayName("Verify sales line pricing with discount, tax, and profit margin computation")
    void testLineItemPricing() {
        Product product = Product.builder()
                .salesPrice(new BigDecimal("500.00"))
                .purchasePrice(new BigDecimal("300.00"))
                .build();

        BigDecimal qty = new BigDecimal("10");
        BigDecimal discount = new BigDecimal("10.00"); // 10% discount
        BigDecimal tax = new BigDecimal("8.00"); // 8% tax

        SalesPricingService.PriceCalculationResult result =
                pricingService.calculateLineItemPricing(product, qty, discount, tax);

        assertEquals(new BigDecimal("5000.00"), result.getGrossAmount());
        assertEquals(new BigDecimal("500.0000"), result.getDiscountAmount());
        assertEquals(new BigDecimal("4500.0000"), result.getTaxableAmount());
        assertEquals(new BigDecimal("360.0000"), result.getTaxAmount());
        assertEquals(new BigDecimal("4860.0000"), result.getNetTotalAmount());
        assertEquals(new BigDecimal("33.33"), result.getProfitMarginPercent());
    }
}
`);

writeFile('backend/src/test/java/com/coreerp/project/EarnedValueTests.java', `package com.coreerp.project;

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
`);

console.log("Enterprise Services and Tests generated successfully.");
