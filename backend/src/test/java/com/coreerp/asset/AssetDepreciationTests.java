package com.coreerp.asset;

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
