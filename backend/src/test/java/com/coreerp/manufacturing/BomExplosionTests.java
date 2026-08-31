package com.coreerp.manufacturing;

import com.coreerp.domain.inventory.entity.Product;
import com.coreerp.domain.manufacturing.service.BomExplosionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class BomExplosionTests {

    private final BomExplosionService bomExplosionService = new BomExplosionService();

    @Test
    @DisplayName("Verify multi-level BOM explosion and scrap rate accumulation")
    void testBomExplosionCalculation() {
        Product finishedGood = Product.builder()
                .sku("FG-SRV-01")
                .name("High Performance Node")
                .build();

        BomExplosionService.ExplodedComponent comp1 = BomExplosionService.ExplodedComponent.builder()
                .componentId("c1")
                .sku("RAM-64GB")
                .name("64GB DDR5 RAM")
                .level(1)
                .unitQuantity(new BigDecimal("4")) // 4 units per server
                .scrapRatePercent(new BigDecimal("2.00")) // 2% scrap
                .unitCost(new BigDecimal("200.00"))
                .build();

        BomExplosionService.ExplodedComponent comp2 = BomExplosionService.ExplodedComponent.builder()
                .componentId("c2")
                .sku("CPU-E28")
                .name("28-Core Processor")
                .level(1)
                .unitQuantity(new BigDecimal("2")) // 2 units per server
                .scrapRatePercent(BigDecimal.ZERO)
                .unitCost(new BigDecimal("900.00"))
                .build();

        BigDecimal batchSize = new BigDecimal("10"); // 10 servers

        BomExplosionService.BomExplosionResult result =
                bomExplosionService.explodeBom(finishedGood, batchSize, Arrays.asList(comp1, comp2));

        assertEquals(new BigDecimal("10"), result.getProductionBatchSize());
        assertEquals(2, result.getComponents().size());

        // Comp 1: 4 * 10 = 40 raw + 2% scrap (0.8) = 40.8 units @ $200 = $8,160.00
        assertEquals(new BigDecimal("40.8000"), result.getComponents().get(0).getTotalRequiredQuantity());
        assertEquals(new BigDecimal("8160.0000"), result.getComponents().get(0).getTotalCost());

        // Comp 2: 2 * 10 = 20 units @ $900 = $18,000.00
        assertEquals(new BigDecimal("20.0000"), result.getComponents().get(1).getTotalRequiredQuantity());
        assertEquals(new BigDecimal("18000.0000"), result.getComponents().get(1).getTotalCost());

        // Total: 8,160 + 18,000 = $26,160.00
        assertEquals(new BigDecimal("26160.0000"), result.getTotalMaterialCost());
        assertEquals(new BigDecimal("2616.0000"), result.getUnitMaterialCost());
    }
}
