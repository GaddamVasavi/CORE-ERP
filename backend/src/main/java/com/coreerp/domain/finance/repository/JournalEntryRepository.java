package com.coreerp.domain.finance.repository;

import com.coreerp.domain.finance.entity.JournalEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, String> {
    Page<JournalEntry> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<JournalEntry> findByTenantIdAndEntryNumberAndIsDeletedFalse(String tenantId, String entryNumber);
    List<JournalEntry> findAllByTenantIdAndEntryDateBetweenAndStatusAndIsDeletedFalse(
            String tenantId, LocalDate startDate, LocalDate endDate, com.coreerp.domain.finance.entity.JournalStatus status);
}
