package com.coreerp.domain.finance.engine;

import com.coreerp.common.exception.BadRequestException;
import com.coreerp.domain.finance.entity.ChartOfAccounts;
import com.coreerp.domain.finance.entity.JournalEntry;
import com.coreerp.domain.finance.entity.JournalEntryLine;
import com.coreerp.domain.finance.entity.JournalStatus;
import com.coreerp.domain.finance.repository.ChartOfAccountsRepository;
import com.coreerp.domain.finance.repository.JournalEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DoubleEntryLedgerEngine {

    private final ChartOfAccountsRepository coaRepository;
    private final JournalEntryRepository journalEntryRepository;

    public void validateBalance(JournalEntry entry) {
        if (entry.getLines() == null || entry.getLines().isEmpty()) {
            throw new BadRequestException("Journal entry must contain at least two transaction lines.");
        }

        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;

        for (JournalEntryLine line : entry.getLines()) {
            if (line.getDebitAmount() != null) {
                totalDebit = totalDebit.add(line.getDebitAmount());
            }
            if (line.getCreditAmount() != null) {
                totalCredit = totalCredit.add(line.getCreditAmount());
            }
        }

        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new BadRequestException(String.format(
                "Double-entry validation failed: Total Debits (%s) do not equal Total Credits (%s)",
                totalDebit.toPlainString(), totalCredit.toPlainString()
            ));
        }

        if (totalDebit.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Journal entry amount must be greater than zero.");
        }

        entry.setTotalDebit(totalDebit);
        entry.setTotalCredit(totalCredit);
    }

    @Transactional
    public JournalEntry postEntry(String tenantId, String entryId, String postedByUserId) {
        JournalEntry entry = journalEntryRepository.findById(entryId)
                .orElseThrow(() -> new BadRequestException("Journal entry not found: " + entryId));

        if (entry.getStatus() == JournalStatus.POSTED) {
            throw new BadRequestException("Journal entry is already posted.");
        }

        validateBalance(entry);

        for (JournalEntryLine line : entry.getLines()) {
            ChartOfAccounts account = line.getAccount();
            BigDecimal balanceChange = BigDecimal.ZERO;

            switch (account.getAccountType()) {
                case ASSET:
                case EXPENSE:
                    balanceChange = line.getDebitAmount().subtract(line.getCreditAmount());
                    break;
                case LIABILITY:
                case EQUITY:
                case REVENUE:
                    balanceChange = line.getCreditAmount().subtract(line.getDebitAmount());
                    break;
            }

            account.setCurrentBalance(account.getCurrentBalance().add(balanceChange));
            coaRepository.save(account);
        }

        entry.setStatus(JournalStatus.POSTED);
        entry.setPostedAt(Instant.now());
        entry.setPostedBy(postedByUserId);

        log.info("Posted Journal Entry [{}] for Tenant [{}] by User [{}]", entry.getEntryNumber(), tenantId, postedByUserId);
        return journalEntryRepository.save(entry);
    }
}
