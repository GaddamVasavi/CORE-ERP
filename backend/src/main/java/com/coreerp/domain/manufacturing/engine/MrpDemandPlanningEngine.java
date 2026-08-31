package com.coreerp.domain.manufacturing.engine;

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
