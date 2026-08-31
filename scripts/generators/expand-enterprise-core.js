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

console.log("Generating Comprehensive Enterprise Engines, Tests, and UI Modules...");

// -------------------------------------------------------------
// 1. Finance Calculation Engines & Services
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/finance/engine/DoubleEntryLedgerEngine.java', `package com.coreerp.domain.finance.engine;

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
`);

writeFile('backend/src/main/java/com/coreerp/domain/finance/engine/AgingAnalysisEngine.java', `package com.coreerp.domain.finance.engine;

import com.coreerp.domain.finance.entity.Invoice;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class AgingAnalysisEngine {

    @Data
    @Builder
    public static class AgingBucketReport {
        private BigDecimal current0To30;
        private BigDecimal overdue31To60;
        private BigDecimal overdue61To90;
        private BigDecimal overdue90Plus;
        private BigDecimal totalOutstanding;
    }

    public AgingBucketReport computeAging(List<Invoice> unpaidInvoices, LocalDate asOfDate) {
        BigDecimal b0_30 = BigDecimal.ZERO;
        BigDecimal b31_60 = BigDecimal.ZERO;
        BigDecimal b61_90 = BigDecimal.ZERO;
        BigDecimal b90_plus = BigDecimal.ZERO;

        for (Invoice inv : unpaidInvoices) {
            BigDecimal balance = inv.getBalanceAmount();
            long daysPastDue = ChronoUnit.DAYS.between(inv.getDueDate(), asOfDate);

            if (daysPastDue <= 30) {
                b0_30 = b0_30.add(balance);
            } else if (daysPastDue <= 60) {
                b31_60 = b31_60.add(balance);
            } else if (daysPastDue <= 90) {
                b61_90 = b61_90.add(balance);
            } else {
                b90_plus = b90_plus.add(balance);
            }
        }

        BigDecimal total = b0_30.add(b31_60).add(b61_90).add(b90_plus);

        return AgingBucketReport.builder()
                .current0To30(b0_30)
                .overdue31To60(b31_60)
                .overdue61To90(b61_90)
                .overdue90Plus(b90_plus)
                .totalOutstanding(total)
                .build();
    }
}
`);

// -------------------------------------------------------------
// 2. Manufacturing MRP & Quality Engines
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/manufacturing/engine/MrpDemandPlanningEngine.java', `package com.coreerp.domain.manufacturing.engine;

import com.coreerp.domain.inventory.entity.Product;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class MrpDemandPlanningEngine {

    @Data
    @Builder
    public static class MaterialRequirement {
        private String productId;
        private String sku;
        private String productName;
        private BigDecimal grossRequirement;
        private BigDecimal stockOnHand;
        private BigDecimal stockReserved;
        private BigDecimal netRequirement;
        private boolean requiresPurchaseOrder;
        private boolean requiresProductionOrder;
    }

    public MaterialRequirement evaluateRequirement(
            Product product,
            BigDecimal grossDemand,
            BigDecimal currentOnHand,
            BigDecimal currentReserved,
            BigDecimal safetyStock) {

        BigDecimal availableStock = currentOnHand.subtract(currentReserved);
        BigDecimal netDemand = grossDemand.add(safetyStock).subtract(availableStock);

        if (netDemand.compareTo(BigDecimal.ZERO) < 0) {
            netDemand = BigDecimal.ZERO;
        }

        boolean isStorable = "STORABLE".equalsIgnoreCase(product.getType());
        boolean hasShortage = netDemand.compareTo(BigDecimal.ZERO) > 0;

        return MaterialRequirement.builder()
                .productId(product.getId())
                .sku(product.getSku())
                .productName(product.getName())
                .grossRequirement(grossDemand)
                .stockOnHand(currentOnHand)
                .stockReserved(currentReserved)
                .netRequirement(netDemand)
                .requiresPurchaseOrder(hasShortage && isStorable)
                .requiresProductionOrder(hasShortage && !isStorable)
                .build();
    }
}
`);

// -------------------------------------------------------------
// 3. Asset Depreciation Engine
// -------------------------------------------------------------

writeFile('backend/src/main/java/com/coreerp/domain/asset/engine/AssetDepreciationEngine.java', `package com.coreerp.domain.asset.engine;

import com.coreerp.domain.asset.entity.Asset;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Component
public class AssetDepreciationEngine {

    @Data
    @Builder
    public static class MonthlyDepreciationResult {
        private BigDecimal monthlyDepreciationAmount;
        private BigDecimal newAccumulatedDepreciation;
        private BigDecimal newBookValue;
        private boolean isFullyDepreciated;
    }

    public MonthlyDepreciationResult calculateMonthlyDepreciation(Asset asset) {
        if ("STRAIGHT_LINE".equalsIgnoreCase(asset.getDepreciationMethod())) {
            BigDecimal depreciableCost = asset.getPurchaseCost().subtract(asset.getSalvageValue());
            BigDecimal monthlyAmount = depreciableCost.divide(
                    new BigDecimal(asset.getUsefulLifeMonths()), 4, RoundingMode.HALF_UP);

            BigDecimal currentAccum = asset.getAccumulatedDepreciation();
            BigDecimal remainingDepreciable = depreciableCost.subtract(currentAccum);

            if (monthlyAmount.compareTo(remainingDepreciable) > 0) {
                monthlyAmount = remainingDepreciable;
            }

            BigDecimal newAccum = currentAccum.add(monthlyAmount);
            BigDecimal newBookValue = asset.getPurchaseCost().subtract(newAccum);

            return MonthlyDepreciationResult.builder()
                    .monthlyDepreciationAmount(monthlyAmount)
                    .newAccumulatedDepreciation(newAccum)
                    .newBookValue(newBookValue)
                    .isFullyDepreciated(newAccum.compareTo(depreciableCost) >= 0)
                    .build();
        } else {
            // Declining Balance: 20% annual / 12 months
            BigDecimal monthlyRate = new BigDecimal("0.20").divide(new BigDecimal("12"), 4, RoundingMode.HALF_UP);
            BigDecimal monthlyAmount = asset.getCurrentBookValue().multiply(monthlyRate).setScale(4, RoundingMode.HALF_UP);

            BigDecimal newAccum = asset.getAccumulatedDepreciation().add(monthlyAmount);
            BigDecimal newBookValue = asset.getCurrentBookValue().subtract(monthlyAmount);

            return MonthlyDepreciationResult.builder()
                    .monthlyDepreciationAmount(monthlyAmount)
                    .newAccumulatedDepreciation(newAccum)
                    .newBookValue(newBookValue)
                    .isFullyDepreciated(newBookValue.compareTo(asset.getSalvageValue()) <= 0)
                    .build();
        }
    }
}
`);

// -------------------------------------------------------------
// 4. Comprehensive Unit Test Suites
// -------------------------------------------------------------

writeFile('backend/src/test/java/com/coreerp/manufacturing/MrpCalculationTests.java', `package com.coreerp.manufacturing;

import com.coreerp.domain.inventory.entity.Product;
import com.coreerp.domain.manufacturing.engine.MrpDemandPlanningEngine;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class MrpCalculationTests {

    private final MrpDemandPlanningEngine mrpEngine = new MrpDemandPlanningEngine();

    @Test
    @DisplayName("Verify MRP correctly triggers purchase order when stock is deficient")
    void testMrpDeficientStockTriggersPO() {
        Product product = Product.builder()
                .sku("SKU-COMP-01")
                .name("Microcontroller IC")
                .type("STORABLE")
                .build();

        BigDecimal demand = new BigDecimal("1000.00");
        BigDecimal onHand = new BigDecimal("400.00");
        BigDecimal reserved = new BigDecimal("100.00");
        BigDecimal safetyStock = new BigDecimal("50.00");

        MrpDemandPlanningEngine.MaterialRequirement result = mrpEngine.evaluateRequirement(
                product, demand, onHand, reserved, safetyStock);

        assertEquals(new BigDecimal("750.00"), result.getNetRequirement());
        assertTrue(result.isRequiresPurchaseOrder());
    }

    @Test
    @DisplayName("Verify MRP does not trigger purchase when available stock covers demand")
    void testMrpSufficientStockNoPO() {
        Product product = Product.builder()
                .sku("SKU-COMP-02")
                .name("Steel Bracket")
                .type("STORABLE")
                .build();

        BigDecimal demand = new BigDecimal("200.00");
        BigDecimal onHand = new BigDecimal("500.00");
        BigDecimal reserved = new BigDecimal("50.00");
        BigDecimal safetyStock = new BigDecimal("20.00");

        MrpDemandPlanningEngine.MaterialRequirement result = mrpEngine.evaluateRequirement(
                product, demand, onHand, reserved, safetyStock);

        assertEquals(BigDecimal.ZERO, result.getNetRequirement());
        assertFalse(result.isRequiresPurchaseOrder());
    }
}
`);

writeFile('backend/src/test/java/com/coreerp/asset/AssetDepreciationTests.java', `package com.coreerp.asset;

import com.coreerp.domain.asset.engine.AssetDepreciationEngine;
import com.coreerp.domain.asset.entity.Asset;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class AssetDepreciationTests {

    private final AssetDepreciationEngine engine = new AssetDepreciationEngine();

    @Test
    @DisplayName("Verify Straight-Line monthly depreciation schedule")
    void testStraightLineSchedule() {
        Asset asset = Asset.builder()
                .purchaseCost(new BigDecimal("120000.00"))
                .salvageValue(new BigDecimal("12000.00"))
                .usefulLifeMonths(60)
                .depreciationMethod("STRAIGHT_LINE")
                .accumulatedDepreciation(BigDecimal.ZERO)
                .currentBookValue(new BigDecimal("120000.00"))
                .build();

        AssetDepreciationEngine.MonthlyDepreciationResult res = engine.calculateMonthlyDepreciation(asset);

        assertEquals(new BigDecimal("1800.0000"), res.getMonthlyDepreciationAmount());
        assertEquals(new BigDecimal("1800.0000"), res.getNewAccumulatedDepreciation());
        assertEquals(new BigDecimal("118200.0000"), res.getNewBookValue());
        assertFalse(res.isFullyDepreciated());
    }
}
`);

writeFile('backend/src/test/java/com/coreerp/security/RbacPermissionTests.java', `package com.coreerp.security;

import com.coreerp.domain.security.entity.Permission;
import com.coreerp.domain.security.entity.Role;
import com.coreerp.domain.security.entity.User;
import com.coreerp.security.service.CustomUserDetails;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

public class RbacPermissionTests {

    @Test
    @DisplayName("Verify UserDetails correctly grants authorities from granular permissions")
    void testUserDetailsPermissions() {
        Permission perm1 = Permission.builder().name("invoice:approve").module("FINANCE").action("APPROVE").build();
        Permission perm2 = Permission.builder().name("invoice:pay").module("FINANCE").action("PAY").build();

        Role cfoRole = Role.builder()
                .code("CFO")
                .name("Chief Financial Officer")
                .permissions(new HashSet<>(java.util.Arrays.asList(perm1, perm2)))
                .build();

        User user = User.builder()
                .email("cfo@enterprise.com")
                .firstName("Sarah")
                .lastName("Connor")
                .roles(new HashSet<>(Collections.singletonList(cfoRole)))
                .isSuperAdmin(false)
                .build();

        CustomUserDetails userDetails = CustomUserDetails.build(user);

        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CFO")));
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("invoice:approve")));
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("invoice:pay")));
        assertFalse(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN")));
    }
}
`);

console.log("Enterprise Core Engines and Tests generated successfully.");
