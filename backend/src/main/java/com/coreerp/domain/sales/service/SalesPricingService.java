package com.coreerp.domain.sales.service;

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
