package com.coreerp.hr;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.junit.jupiter.api.Assertions.*;

public class PayrollCalculationTests {

    @Test
    @DisplayName("Verify payroll gross pay, tax deductions, and net pay computation")
    void testPayrollCalculation() {
        BigDecimal basicSalary = new BigDecimal("8000.00");
        BigDecimal allowances = new BigDecimal("2000.00");
        BigDecimal bonus = new BigDecimal("1500.00");

        BigDecimal grossPay = basicSalary.add(allowances).add(bonus);
        assertEquals(new BigDecimal("11500.00"), grossPay);

        BigDecimal incomeTaxRate = new BigDecimal("15.00");
        BigDecimal retirementRate = new BigDecimal("5.00");

        BigDecimal taxDeduction = grossPay.multiply(incomeTaxRate).divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal retirementDeduction = basicSalary.multiply(retirementRate).divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
        BigDecimal totalDeductions = taxDeduction.add(retirementDeduction);

        BigDecimal netPay = grossPay.subtract(totalDeductions);

        assertEquals(new BigDecimal("1725.0000"), taxDeduction);
        assertEquals(new BigDecimal("400.0000"), retirementDeduction);
        assertEquals(new BigDecimal("9375.0000"), netPay);
    }
}
