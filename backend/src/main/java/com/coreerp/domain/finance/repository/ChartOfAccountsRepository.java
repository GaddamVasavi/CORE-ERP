package com.coreerp.domain.finance.repository;

import com.coreerp.domain.finance.entity.AccountType;
import com.coreerp.domain.finance.entity.ChartOfAccounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChartOfAccountsRepository extends JpaRepository<ChartOfAccounts, String> {
    List<ChartOfAccounts> findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(String tenantId);
    Optional<ChartOfAccounts> findByTenantIdAndAccountCodeAndIsDeletedFalse(String tenantId, String accountCode);
    List<ChartOfAccounts> findAllByTenantIdAndAccountTypeAndIsDeletedFalse(String tenantId, AccountType accountType);
}
