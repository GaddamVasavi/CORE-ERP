package com.coreerp.domain.hr.service;

import com.coreerp.domain.hr.entity.Employee;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class PayrollCalculationEngine {

    @Data
    @Builder
    public static class PayslipCalculationResult {
        private String employeeId;
        private String employeeCode;
        private String employeeName;
        private BigDecimal basicSalary;
        private BigDecimal allowances;
        private BigDecimal overtimePay;
        private BigDecimal bonus;
        private BigDecimal grossPay;
        private BigDecimal incomeTax;
        private BigDecimal retirementPension;
        private BigDecimal healthInsurance;
        private BigDecimal totalDeductions;
        private BigDecimal netPay;
    }

    public PayslipCalculationResult computeEmployeePayroll(
            Employee employee,
            BigDecimal overtimeHours,
            BigDecimal hourlyOvertimeRate,
            BigDecimal bonus) {

        BigDecimal basicSalary = employee.getSalaryAmount();
        BigDecimal allowances = basicSalary.multiply(new BigDecimal("0.25")).setScale(4, RoundingMode.HALF_UP); // 25% allowance
        BigDecimal overtimePay = overtimeHours.multiply(hourlyOvertimeRate).setScale(4, RoundingMode.HALF_UP);
        BigDecimal grossPay = basicSalary.add(allowances).add(overtimePay).add(bonus);

        // Progressive Tax Model:
        // <= $3000: 5%
        // $3001 - $7000: 10%
        // > $7000: 15%
        BigDecimal incomeTax = BigDecimal.ZERO;
        if (grossPay.compareTo(new BigDecimal("3000.00")) <= 0) {
            incomeTax = grossPay.multiply(new BigDecimal("0.05"));
        } else if (grossPay.compareTo(new BigDecimal("7000.00")) <= 0) {
            incomeTax = new BigDecimal("150.00").add(
                    grossPay.subtract(new BigDecimal("3000.00")).multiply(new BigDecimal("0.10")));
        } else {
            incomeTax = new BigDecimal("550.00").add(
                    grossPay.subtract(new BigDecimal("7000.00")).multiply(new BigDecimal("0.15")));
        }
        incomeTax = incomeTax.setScale(4, RoundingMode.HALF_UP);

        BigDecimal retirementPension = basicSalary.multiply(new BigDecimal("0.05")).setScale(4, RoundingMode.HALF_UP); // 5% pension
        BigDecimal healthInsurance = new BigDecimal("150.0000"); // Flat benefit

        BigDecimal totalDeductions = incomeTax.add(retirementPension).add(healthInsurance);
        BigDecimal netPay = grossPay.subtract(totalDeductions);

        return PayslipCalculationResult.builder()
                .employeeId(employee.getId())
                .employeeCode(employee.getEmployeeCode())
                .employeeName(employee.getFullName())
                .basicSalary(basicSalary)
                .allowances(allowances)
                .overtimePay(overtimePay)
                .bonus(bonus)
                .grossPay(grossPay)
                .incomeTax(incomeTax)
                .retirementPension(retirementPension)
                .healthInsurance(healthInsurance)
                .totalDeductions(totalDeductions)
                .netPay(netPay)
                .build();
    }
}
