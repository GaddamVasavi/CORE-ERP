package com.coreerp.domain.finance.service;

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
