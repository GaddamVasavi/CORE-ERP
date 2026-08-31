package com.coreerp.domain.manufacturing.service;

import com.coreerp.domain.inventory.entity.Product;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class BomExplosionService {

    @Data
    @Builder
    public static class ExplodedComponent {
        private String componentId;
        private String sku;
        private String name;
        private int level;
        private BigDecimal unitQuantity;
        private BigDecimal totalRequiredQuantity;
        private BigDecimal scrapRatePercent;
        private BigDecimal scrapQuantity;
        private BigDecimal unitCost;
        private BigDecimal totalCost;
    }

    @Data
    @Builder
    public static class BomExplosionResult {
        private String finishedProductId;
        private String finishedProductSku;
        private BigDecimal productionBatchSize;
        private List<ExplodedComponent> components;
        private BigDecimal totalMaterialCost;
        private BigDecimal unitMaterialCost;
    }

    public BomExplosionResult explodeBom(
            Product finishedProduct,
            BigDecimal orderQuantity,
            List<ExplodedComponent> bomStructure) {

        List<ExplodedComponent> resultList = new ArrayList<>();
        BigDecimal totalMaterialCost = BigDecimal.ZERO;

        for (ExplodedComponent comp : bomStructure) {
            BigDecimal rawRequired = comp.getUnitQuantity().multiply(orderQuantity);
            BigDecimal scrapMultiplier = comp.getScrapRatePercent().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
            BigDecimal scrapQty = rawRequired.multiply(scrapMultiplier).setScale(4, RoundingMode.HALF_UP);
            BigDecimal totalReq = rawRequired.add(scrapQty);

            BigDecimal lineCost = totalReq.multiply(comp.getUnitCost()).setScale(4, RoundingMode.HALF_UP);
            totalMaterialCost = totalMaterialCost.add(lineCost);

            resultList.add(ExplodedComponent.builder()
                    .componentId(comp.getComponentId())
                    .sku(comp.getSku())
                    .name(comp.getName())
                    .level(comp.getLevel())
                    .unitQuantity(comp.getUnitQuantity())
                    .totalRequiredQuantity(totalReq)
                    .scrapRatePercent(comp.getScrapRatePercent())
                    .scrapQuantity(scrapQty)
                    .unitCost(comp.getUnitCost())
                    .totalCost(lineCost)
                    .build());
        }

        BigDecimal unitCost = BigDecimal.ZERO;
        if (orderQuantity.compareTo(BigDecimal.ZERO) > 0) {
            unitCost = totalMaterialCost.divide(orderQuantity, 4, RoundingMode.HALF_UP);
        }

        return BomExplosionResult.builder()
                .finishedProductId(finishedProduct.getId())
                .finishedProductSku(finishedProduct.getSku())
                .productionBatchSize(orderQuantity)
                .components(resultList)
                .totalMaterialCost(totalMaterialCost)
                .unitMaterialCost(unitCost)
                .build();
    }
}
