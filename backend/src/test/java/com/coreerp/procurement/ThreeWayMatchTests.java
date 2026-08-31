package com.coreerp.procurement;

import com.coreerp.domain.finance.entity.Invoice;
import com.coreerp.domain.inventory.entity.Product;
import com.coreerp.domain.procurement.entity.PurchaseOrder;
import com.coreerp.domain.procurement.entity.PurchaseOrderItem;
import com.coreerp.domain.procurement.service.ThreeWayMatchEngine;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

public class ThreeWayMatchTests {

    private final ThreeWayMatchEngine matchEngine = new ThreeWayMatchEngine();

    @Test
    @DisplayName("Verify 3-way match passes when PO, Receipt, and Invoice quantities match perfectly")
    void testPerfectThreeWayMatch() {
        Product prod = Product.builder().sku("SKU-001").build();

        PurchaseOrderItem item = PurchaseOrderItem.builder()
                .product(prod)
                .quantity(new BigDecimal("100"))
                .quantityReceived(new BigDecimal("100"))
                .unitPrice(new BigDecimal("50.00"))
                .totalAmount(new BigDecimal("5000.00"))
                .build();

        PurchaseOrder po = PurchaseOrder.builder()
                .totalAmount(new BigDecimal("5000.00"))
                .items(Collections.singletonList(item))
                .build();

        Invoice invoice = Invoice.builder()
                .totalAmount(new BigDecimal("5000.00"))
                .build();

        ThreeWayMatchEngine.ThreeWayMatchReport report = matchEngine.verifyMatch(po, invoice);

        assertTrue(report.isPerfectMatch());
        assertEquals(0, report.getDiscrepancies().size());
        assertEquals(BigDecimal.ZERO, report.getVarianceAmount());
    }
}
