package com.coreerp.finance;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.junit.jupiter.api.Assertions.*;

public class FinanceCalculationTests {

    @Test
    @DisplayName("Verify Double-Entry Journal debit and credit balance equality")
    void testJournalDebitCreditBalance() {
        BigDecimal debit1 = new BigDecimal("1500.50");
        BigDecimal debit2 = new BigDecimal("499.50");
        BigDecimal totalDebit = debit1.add(debit2);

        BigDecimal credit1 = new BigDecimal("2000.00");
        BigDecimal totalCredit = credit1;

        assertEquals(0, totalDebit.compareTo(totalCredit), "Total debits must strictly equal total credits");
    }

    @Test
    @DisplayName("Verify invoice tax and discount calculations")
    void testInvoiceCalculation() {
        BigDecimal subtotal = new BigDecimal("10000.00");
        BigDecimal discountPercent = new BigDecimal("5.00");
        BigDecimal taxPercent = new BigDecimal("10.00");

        BigDecimal discountAmount = subtotal.multiply(discountPercent).divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal discountedSubtotal = subtotal.subtract(discountAmount);
        BigDecimal taxAmount = discountedSubtotal.multiply(taxPercent).divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal totalAmount = discountedSubtotal.add(taxAmount);

        assertEquals(new BigDecimal("500.0000"), discountAmount);
        assertEquals(new BigDecimal("950.0000"), taxAmount);
        assertEquals(new BigDecimal("10450.0000"), totalAmount);
    }

    @Test
    @DisplayName("Verify straight-line asset depreciation formula")
    void testStraightLineDepreciation() {
        BigDecimal purchaseCost = new BigDecimal("60000.00");
        BigDecimal salvageValue = new BigDecimal("6000.00");
        int usefulLifeMonths = 60;

        BigDecimal depreciableCost = purchaseCost.subtract(salvageValue);
        BigDecimal monthlyDepreciation = depreciableCost.divide(new BigDecimal(usefulLifeMonths), 4, RoundingMode.HALF_UP);

        assertEquals(new BigDecimal("900.0000"), monthlyDepreciation);
    }
}
