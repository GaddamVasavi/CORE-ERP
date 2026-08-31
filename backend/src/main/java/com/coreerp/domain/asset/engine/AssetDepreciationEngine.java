package com.coreerp.domain.asset.engine;

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
