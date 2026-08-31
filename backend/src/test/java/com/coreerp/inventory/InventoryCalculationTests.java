package com.coreerp.inventory;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class InventoryCalculationTests {

    @Test
    @DisplayName("Verify inventory available quantity = on hand - reserved")
    void testInventoryAvailability() {
        BigDecimal onHand = new BigDecimal("500.00");
        BigDecimal reserved = new BigDecimal("120.00");

        BigDecimal available = onHand.subtract(reserved);

        assertEquals(new BigDecimal("380.00"), available);
        assertTrue(available.compareTo(BigDecimal.ZERO) >= 0, "Available stock cannot be negative");
    }

    @Test
    @DisplayName("Verify reorder trigger threshold calculation")
    void testReorderLevelTrigger() {
        BigDecimal currentStock = new BigDecimal("45.00");
        BigDecimal minReorderLevel = new BigDecimal("50.00");

        boolean needsReorder = currentStock.compareTo(minReorderLevel) <= 0;
        assertTrue(needsReorder, "Reorder should trigger when current stock is at or below min level");
    }
}
