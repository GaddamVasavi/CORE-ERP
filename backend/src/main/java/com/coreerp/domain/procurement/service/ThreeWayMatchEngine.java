package com.coreerp.domain.procurement.service;

import com.coreerp.domain.finance.entity.Invoice;
import com.coreerp.domain.procurement.entity.PurchaseOrder;
import com.coreerp.domain.procurement.entity.PurchaseOrderItem;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ThreeWayMatchEngine {

    @Data
    @Builder
    public static class LineItemMatchDiscrepancy {
        private String productId;
        private String sku;
        private BigDecimal poQuantity;
        private BigDecimal receivedQuantity;
        private BigDecimal invoicedQuantity;
        private BigDecimal poUnitPrice;
        private BigDecimal invoiceUnitPrice;
        private boolean hasQuantityVariance;
        private boolean hasPriceVariance;
    }

    @Data
    @Builder
    public static class ThreeWayMatchReport {
        private String purchaseOrderId;
        private String invoiceId;
        private boolean isPerfectMatch;
        private BigDecimal totalPoAmount;
        private BigDecimal totalInvoicedAmount;
        private BigDecimal varianceAmount;
        private List<LineItemMatchDiscrepancy> discrepancies;
    }

    public ThreeWayMatchReport verifyMatch(PurchaseOrder po, Invoice invoice) {
        List<LineItemMatchDiscrepancy> discrepancies = new ArrayList<>();
        BigDecimal totalPo = po.getTotalAmount();
        BigDecimal totalInv = invoice.getTotalAmount();
        BigDecimal variance = totalInv.subtract(totalPo);

        for (PurchaseOrderItem item : po.getItems()) {
            boolean qtyMismatch = item.getQuantityReceived().compareTo(item.getQuantity()) < 0;
            boolean priceMismatch = false;

            if (qtyMismatch || priceMismatch) {
                discrepancies.add(LineItemMatchDiscrepancy.builder()
                        .productId(item.getProduct().getId())
                        .sku(item.getProduct().getSku())
                        .poQuantity(item.getQuantity())
                        .receivedQuantity(item.getQuantityReceived())
                        .invoicedQuantity(item.getQuantity())
                        .poUnitPrice(item.getUnitPrice())
                        .invoiceUnitPrice(item.getUnitPrice())
                        .hasQuantityVariance(qtyMismatch)
                        .hasPriceVariance(priceMismatch)
                        .build());
            }
        }

        boolean perfectMatch = discrepancies.isEmpty() && variance.compareTo(BigDecimal.ZERO) == 0;

        return ThreeWayMatchReport.builder()
                .purchaseOrderId(po.getId())
                .invoiceId(invoice.getId())
                .isPerfectMatch(perfectMatch)
                .totalPoAmount(totalPo)
                .totalInvoicedAmount(totalInv)
                .varianceAmount(variance)
                .discrepancies(discrepancies)
                .build();
    }
}
