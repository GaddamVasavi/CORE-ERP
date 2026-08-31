package com.coreerp.domain.finance.service;

import com.coreerp.domain.finance.entity.BankAccount;
import com.coreerp.domain.finance.entity.BankTransaction;
import com.coreerp.domain.finance.repository.BankAccountRepository;
import com.coreerp.domain.finance.repository.BankTransactionRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BankReconciliationService {

    private final BankAccountRepository bankAccountRepository;
    private final BankTransactionRepository bankTransactionRepository;

    @Data
    @Builder
    public static class ReconciliationResult {
        private String bankAccountId;
        private String bankAccountName;
        private BigDecimal statementEndingBalance;
        private BigDecimal glBookBalance;
        private BigDecimal totalReconciledDeposits;
        private BigDecimal totalReconciledWithdrawals;
        private BigDecimal unreconciledDifference;
        private boolean isReconciled;
        private List<String> reconciledTransactionIds;
    }

    @Transactional
    public ReconciliationResult performReconciliation(
            String tenantId,
            String bankAccountId,
            BigDecimal statementEndingBalance,
            LocalDate asOfDate,
            List<String> matchedTransactionIds) {

        BankAccount account = bankAccountRepository.findById(bankAccountId)
                .orElseThrow(() -> new IllegalArgumentException("Bank account not found: " + bankAccountId));

        BigDecimal totalDeposits = BigDecimal.ZERO;
        BigDecimal totalWithdrawals = BigDecimal.ZERO;
        List<String> reconciledIds = new ArrayList<>();

        for (String txId : matchedTransactionIds) {
            BankTransaction tx = bankTransactionRepository.findById(txId)
                    .orElse(null);

            if (tx != null && !tx.isReconciled()) {
                tx.setReconciled(true);
                tx.setReconciledAt(Instant.now());
                bankTransactionRepository.save(tx);
                reconciledIds.add(tx.getId());

                if ("DEPOSIT".equalsIgnoreCase(tx.getTransactionType())) {
                    totalDeposits = totalDeposits.add(tx.getAmount());
                } else if ("WITHDRAWAL".equalsIgnoreCase(tx.getTransactionType()) || "FEE".equalsIgnoreCase(tx.getTransactionType())) {
                    totalWithdrawals = totalWithdrawals.add(tx.getAmount());
                }
            }
        }

        BigDecimal glBookBalance = account.getCurrentBalance();
        BigDecimal adjustedBookBalance = glBookBalance.add(totalDeposits).subtract(totalWithdrawals);
        BigDecimal difference = statementEndingBalance.subtract(adjustedBookBalance);
        boolean isBalanced = difference.compareTo(BigDecimal.ZERO) == 0;

        return ReconciliationResult.builder()
                .bankAccountId(account.getId())
                .bankAccountName(account.getAccountName())
                .statementEndingBalance(statementEndingBalance)
                .glBookBalance(glBookBalance)
                .totalReconciledDeposits(totalDeposits)
                .totalReconciledWithdrawals(totalWithdrawals)
                .unreconciledDifference(difference)
                .isReconciled(isBalanced)
                .reconciledTransactionIds(reconciledIds)
                .build();
    }
}
