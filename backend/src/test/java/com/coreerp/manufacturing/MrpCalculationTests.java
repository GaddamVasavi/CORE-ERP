package com.coreerp.manufacturing;

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
