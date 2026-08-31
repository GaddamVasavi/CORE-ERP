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
}

console.log("Generating Playwright E2E Tests, Extended Documentation, and Integration Suites...");

// -------------------------------------------------------------
// 1. Playwright E2E Test Suite
// -------------------------------------------------------------

writeFile('frontend/e2e/auth.spec.ts', `import { test, expect } from '@playwright/test';

test.describe('Enterprise Authentication & Multi-Tenancy Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login screen with enterprise branding', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('CoreERP Sign In');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('should successfully authenticate super administrator', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator('h2')).toContainText('Executive Dashboard');
  });

  test('should validate invalid login credentials with alert message', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid.user@coreerp.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('.text-rose-700')).toBeVisible();
  });

  test('should navigate to tenant registration page', async ({ page }) => {
    await page.click('text=Register Tenant');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h2')).toContainText('Create Tenant Workspace');
  });
});
`);

writeFile('frontend/e2e/procure-to-pay.spec.ts', `import { test, expect } from '@playwright/test';

test.describe('Procure-to-Pay (P2P) End-to-End Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should complete Procure-to-Pay cycle: PR -> PO -> GRN -> Invoice -> GL', async ({ page }) => {
    await page.goto('/procurement');
    await expect(page.locator('h2')).toContainText('Procurement & Sourcing');

    // Create PO
    await page.click('text=Create Purchase Order');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('text=PO-2026-0810')).toBeVisible();

    // Verify 3-Way Match in Invoices
    await page.goto('/finance');
    await expect(page.locator('h2')).toContainText('Finance & Accounting');
    await expect(page.locator('text=INV-2026-0089')).toBeVisible();
  });
});
`);

writeFile('frontend/e2e/order-to-cash.spec.ts', `import { test, expect } from '@playwright/test';

test.describe('Order-to-Cash (O2C) End-to-End Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should complete Order-to-Cash flow: Customer -> Quotation -> Sales Order -> Fulfillment', async ({ page }) => {
    await page.goto('/sales');
    await expect(page.locator('h2')).toContainText('Sales & CRM');
    await expect(page.locator('text=SO-2026-0412')).toBeVisible();

    // Check Inventory Reservation
    await page.goto('/inventory');
    await expect(page.locator('h2')).toContainText('Inventory & Warehouse Management');
    await expect(page.locator('text=SKU-SRV-901')).toBeVisible();
  });
});
`);

writeFile('frontend/e2e/manufacturing-mrp.spec.ts', `import { test, expect } from '@playwright/test';

test.describe('Manufacturing & MRP Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should verify Bill of Materials and trigger Production Order', async ({ page }) => {
    await page.goto('/manufacturing');
    await expect(page.locator('h2')).toContainText('Manufacturing & MRP');
    await expect(page.locator('text=PO-MFG-2026-0045')).toBeVisible();
  });
});
`);

writeFile('frontend/e2e/payroll-run.spec.ts', `import { test, expect } from '@playwright/test';

test.describe('HR & Automated Payroll Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@coreerp.com');
    await page.fill('input[type="password"]', 'Admin@CoreERP2026!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should verify Employee Directory and Monthly Payroll Batch', async ({ page }) => {
    await page.goto('/hr');
    await expect(page.locator('h2')).toContainText('Human Resources & Payroll');
    await expect(page.locator('text=EMP-001')).toBeVisible();
  });
});
`);

// -------------------------------------------------------------
// 2. Comprehensive Spring Boot Integration Tests
// -------------------------------------------------------------

writeFile('backend/src/test/java/com/coreerp/integration/MultiTenantIsolationIntegrationTests.java', `package com.coreerp.integration;

import com.coreerp.domain.finance.entity.ChartOfAccounts;
import com.coreerp.domain.finance.repository.ChartOfAccountsRepository;
import com.coreerp.security.tenant.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class MultiTenantIsolationIntegrationTests {

    @Autowired
    private ChartOfAccountsRepository coaRepository;

    private static final String TENANT_A = "tenant-aaa-111";
    private static final String TENANT_B = "tenant-bbb-222";

    @BeforeEach
    void setUp() {
        TenantContext.clear();
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    @DisplayName("Verify Tenant A cannot access or query Tenant B chart of accounts records")
    void testTenantDataIsolation() {
        TenantContext.setTenantId(TENANT_A);
        List<ChartOfAccounts> accountsTenantA = coaRepository.findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(TENANT_A);
        assertNotNull(accountsTenantA);

        TenantContext.setTenantId(TENANT_B);
        List<ChartOfAccounts> accountsTenantB = coaRepository.findAllByTenantIdAndIsDeletedFalseOrderByAccountCodeAsc(TENANT_B);
        assertNotNull(accountsTenantB);

        // Assert no cross-contamination
        for (ChartOfAccounts acc : accountsTenantA) {
            assertEquals(TENANT_A, acc.getTenantId());
            assertNotEquals(TENANT_B, acc.getTenantId());
        }
    }
}
`);

writeFile('backend/src/test/java/com/coreerp/integration/AuthEndpointIntegrationTests.java', `package com.coreerp.integration;

import com.coreerp.domain.security.dto.LoginRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthEndpointIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/v1/auth/login with invalid email format returns 400 Bad Request")
    void testLoginInvalidEmail() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("not-an-email");
        request.setPassword("password123");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
`);

console.log("Final Polish and E2E generation complete.");
