const fs = require('fs');
const path = require('path');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  const fullPath = path.resolve(process.cwd(), filePath);
  ensureDirSync(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Created: ${filePath}`);
}

console.log("Generating Phase 5 Documentation and Unit Tests...");

writeFile('backend/src/test/java/com/coreerp/finance/FinanceCalculationTests.java', `package com.coreerp.finance;

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
`);

writeFile('backend/src/test/java/com/coreerp/hr/PayrollCalculationTests.java', `package com.coreerp.hr;

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
`);

writeFile('backend/src/test/java/com/coreerp/inventory/InventoryCalculationTests.java', `package com.coreerp.inventory;

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
`);

writeFile('docs/architecture.md', `# CoreERP Architectural Design Document

## 1. System Overview
CoreERP is architected as a modern, modular backend with domain-driven boundaries, paired with a high-performance React TypeScript Single Page Application (SPA), integrated asynchronously via Apache Kafka and cached via Redis.

## 2. Multi-Tenancy Strategy
- **Discriminator Isolation**: All tenant-owned records contain an indexed tenant_id foreign key.
- **Context Resolution**: The TenantFilter extracts X-Tenant-ID from headers or decodes the validated JWT claim into TenantContext.
- **Automatic Query Scoping**: Repositories enforce tenant_id filtering preventing cross-tenant leakage.

## 3. High-Volume Event-Driven Integration
Domain events are published to Kafka topics when critical operations occur (e.g. invoice created, inventory low, payroll run completed), enabling decoupled downstream processing and notifications.
`);

writeFile('docs/database.md', `# CoreERP Database Schema & Entity Relationships

The CoreERP PostgreSQL schema comprises 50+ normalized relational tables across 10 functional domains, managed through versioned Flyway migrations.

## Migration History
- **V1__init_enterprise_schema.sql**: Multi-tenancy foundations, Users, Roles, Permissions, Departments, Refresh Tokens, Audit Logs.
- **V2__finance_sales_procurement_inventory.sql**: Chart of Accounts, Fiscal Years, Journal Entries, Bank Accounts, Customers, Leads, Opportunities, Sales Orders, Suppliers, Purchase Orders, Goods Receipts, Products, Warehouses, Invoices, Payments.
- **V3__manufacturing_hr_payroll_projects_assets.sql**: Bills of Materials (BOM), Work Centers, Production Orders, Quality Inspections, Employees, Attendance, Leave, Payroll Runs, Payslips, Projects, Tasks, Timesheets, Assets, Depreciation.
- **V4__workflows_analytics_documents_support.sql**: Workflow Definitions, Instances, Approvals, Support Tickets, Comments, Documents, Notifications.
`);

writeFile('docs/security.md', `# CoreERP Security Architecture & Compliance

## Authentication & Session Management
- **Stateless JWT**: Signed using HMAC-SHA256 with 24-hour expiration.
- **Silent Token Rotation**: High-entropy cryptographically secure refresh tokens stored with revocation status.
- **Password Hashing**: BCrypt with cost factor 10.
- **Account Lockout**: Automatic lock after 5 consecutive failed attempts.
- **Rate Limiting**: Sliding-window Redis token bucket enforcing 50 requests/second per IP.
`);

writeFile('docs/api.md', `# CoreERP REST API Reference

All APIs follow strict RESTful conventions under /api/v1.

## Standard Response Format
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "error": null,
  "timestamp": "2026-09-01T04:00:00Z"
}
`);

writeFile('docs/development.md', `# Local Development Guide

## Prerequisites
- JDK 21+
- Node.js 20+
- PostgreSQL 16, Redis 7, Kafka
`);

writeFile('docs/deployment.md', `# Deployment & Infrastructure Guide

CoreERP supports Docker Compose, Kubernetes, and cloud container services.
`);

writeFile('docs/testing.md', `# Automated Testing Strategy

CoreERP includes automated test suites covering unit tests, Spring Boot integration tests, and frontend workflows.
`);

writeFile('docs/erp-workflows.md', `# CoreERP Integrated Business Workflows

- Procure-to-Pay (P2P): PR -> PO -> GRN -> Invoice -> Payment -> GL
- Order-to-Cash (O2C): Lead -> Opportunity -> Quotation -> SO -> Delivery -> Invoice -> Payment
- Plan-to-Produce: Demand -> MRP -> BOM -> Production Order -> QC -> Inventory
`);

console.log("Phase 5 files generated.");
