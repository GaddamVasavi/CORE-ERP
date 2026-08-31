package com.coreerp.sales;

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
