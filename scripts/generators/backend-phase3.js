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

console.log("Generating Phase 3 Database Migrations & Backend Codebase...");

// Flyway V3 Schema Migration
writeFile('backend/src/main/resources/db/migration/V3__manufacturing_hr_payroll_projects_assets.sql', `
-- ============================================================================
-- CoreERP Database Schema - V3: Manufacturing, HR, Payroll, Projects & Assets
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. MANUFACTURING & MRP
-- ----------------------------------------------------------------------------

CREATE TABLE bills_of_materials (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    bom_number VARCHAR(100) NOT NULL,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id),
    version INT NOT NULL DEFAULT 1,
    quantity NUMERIC(18, 4) NOT NULL DEFAULT 1.0000,
    uom VARCHAR(20) NOT NULL DEFAULT 'UNIT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_bom_tenant_number UNIQUE (tenant_id, bom_number)
);

CREATE TABLE bom_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    bom_id VARCHAR(36) NOT NULL REFERENCES bills_of_materials(id) ON DELETE CASCADE,
    component_product_id VARCHAR(36) NOT NULL REFERENCES products(id),
    quantity NUMERIC(18, 4) NOT NULL,
    scrap_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE work_centers (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    cost_per_hour NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    capacity_hours_per_day NUMERIC(5, 2) NOT NULL DEFAULT 8.00,
    efficiency_percent NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_wc_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE production_orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_number VARCHAR(100) NOT NULL,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id),
    bom_id VARCHAR(36) NOT NULL REFERENCES bills_of_materials(id),
    target_warehouse_id VARCHAR(36) NOT NULL REFERENCES warehouses(id),
    quantity_planned NUMERIC(18, 4) NOT NULL,
    quantity_produced NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNED', -- PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_prod_order_tenant_number UNIQUE (tenant_id, order_number)
);

CREATE TABLE quality_inspections (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    inspection_number VARCHAR(100) NOT NULL,
    reference_type VARCHAR(50) NOT NULL, -- PRODUCTION_ORDER, GOODS_RECEIPT
    reference_id VARCHAR(100) NOT NULL,
    inspector_user_id VARCHAR(36) REFERENCES users(id),
    inspection_date DATE NOT NULL,
    sample_size INT NOT NULL DEFAULT 1,
    passed_count INT NOT NULL DEFAULT 0,
    failed_count INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'PASSED', -- PASSED, FAILED, CONDITIONALLY_PASSED
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_qi_tenant_number UNIQUE (tenant_id, inspection_number)
);

-- ----------------------------------------------------------------------------
-- 2. HUMAN RESOURCES & PAYROLL
-- ----------------------------------------------------------------------------

CREATE TABLE employees (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) NOT NULL,
    user_id VARCHAR(36) REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    department_id VARCHAR(36) REFERENCES departments(id),
    job_title VARCHAR(150) NOT NULL,
    manager_id VARCHAR(36) REFERENCES employees(id),
    hire_date DATE NOT NULL,
    salary_amount NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    salary_frequency VARCHAR(50) NOT NULL DEFAULT 'MONTHLY',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ON_LEAVE, TERMINATED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_emp_tenant_code UNIQUE (tenant_id, employee_code)
);

CREATE INDEX idx_emp_tenant ON employees(tenant_id);

CREATE TABLE attendance_records (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id VARCHAR(36) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE NOT NULL,
    check_out TIMESTAMP WITH TIME ZONE,
    total_hours NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    overtime_hours NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'PRESENT', -- PRESENT, ABSENT, HALF_DAY, LATE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE leave_requests (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id VARCHAR(36) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL, -- ANNUAL, SICK, CASUAL, MATERNITY, UNPAID
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMERIC(4, 1) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    approved_by_employee_id VARCHAR(36) REFERENCES employees(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE payroll_runs (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    payroll_number VARCHAR(100) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_gross_pay NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    total_deductions NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    total_net_pay NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT', -- DRAFT, APPROVED, PROCESSED, PAID
    processed_at TIMESTAMP WITH TIME ZONE,
    journal_entry_id VARCHAR(36) REFERENCES journal_entries(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_payroll_tenant_number UNIQUE (tenant_id, payroll_number)
);

CREATE TABLE payslips (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    payroll_run_id VARCHAR(36) NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id VARCHAR(36) NOT NULL REFERENCES employees(id),
    basic_salary NUMERIC(18, 4) NOT NULL,
    allowances NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    overtime_pay NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    bonus NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    gross_pay NUMERIC(18, 4) NOT NULL,
    tax_deduction NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    other_deductions NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    net_pay NUMERIC(18, 4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. PROJECT MANAGEMENT
-- ----------------------------------------------------------------------------

CREATE TABLE projects (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_code VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    customer_id VARCHAR(36) REFERENCES customers(id),
    manager_employee_id VARCHAR(36) REFERENCES employees(id),
    start_date DATE NOT NULL,
    end_date DATE,
    budget_amount NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    cost_amount NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    status VARCHAR(50) NOT NULL DEFAULT 'PLANNING', -- PLANNING, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_proj_tenant_code UNIQUE (tenant_id, project_code)
);

CREATE TABLE project_tasks (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_employee_id VARCHAR(36) REFERENCES employees(id),
    estimated_hours NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    actual_hours NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(50) NOT NULL DEFAULT 'TODO', -- TODO, IN_PROGRESS, REVIEW, DONE
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE timesheets (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id VARCHAR(36) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    task_id VARCHAR(36) REFERENCES project_tasks(id),
    work_date DATE NOT NULL,
    hours NUMERIC(5, 2) NOT NULL,
    description VARCHAR(255),
    is_billable BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. ENTERPRISE ASSET MANAGEMENT
-- ----------------------------------------------------------------------------

CREATE TABLE assets (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    asset_tag VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- IT_HARDWARE, MACHINERY, VEHICLES, FURNITURE, REAL_ESTATE
    purchase_date DATE NOT NULL,
    purchase_cost NUMERIC(18, 4) NOT NULL,
    salvage_value NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    useful_life_months INT NOT NULL DEFAULT 60,
    depreciation_method VARCHAR(50) NOT NULL DEFAULT 'STRAIGHT_LINE', -- STRAIGHT_LINE, DECLINING_BALANCE
    current_book_value NUMERIC(18, 4) NOT NULL,
    accumulated_depreciation NUMERIC(18, 4) NOT NULL DEFAULT 0.0000,
    assigned_employee_id VARCHAR(36) REFERENCES employees(id),
    department_id VARCHAR(36) REFERENCES departments(id),
    warehouse_id VARCHAR(36) REFERENCES warehouses(id),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, UNDER_MAINTENANCE, DISPOSED, WRITTEN_OFF
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_asset_tenant_tag UNIQUE (tenant_id, asset_tag)
);
`);

// Java Entities & Repositories & Controllers for Phase 3
writeFile('backend/src/main/java/com/coreerp/domain/manufacturing/entity/BillOfMaterials.java', `package com.coreerp.domain.manufacturing.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.inventory.entity.Product;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bills_of_materials", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "bom_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillOfMaterials extends TenantAwareEntity {

    @Column(name = "bom_number", nullable = false, length = 100)
    private String bomNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "version", nullable = false)
    @Builder.Default
    private int version = 1;

    @Column(name = "quantity", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal quantity = BigDecimal.ONE;

    @Column(name = "uom", nullable = false, length = 20)
    @Builder.Default
    private String uom = "UNIT";

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/manufacturing/entity/ProductionOrder.java', `package com.coreerp.domain.manufacturing.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.inventory.entity.Product;
import com.coreerp.domain.inventory.entity.Warehouse;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "production_orders", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "order_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductionOrder extends TenantAwareEntity {

    @Column(name = "order_number", nullable = false, length = 100)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bom_id", nullable = false)
    private BillOfMaterials bom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_warehouse_id", nullable = false)
    private Warehouse targetWarehouse;

    @Column(name = "quantity_planned", nullable = false, precision = 18, scale = 4)
    private BigDecimal quantityPlanned;

    @Column(name = "quantity_produced", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal quantityProduced = BigDecimal.ZERO;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "PLANNED";
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/hr/entity/Employee.java', `package com.coreerp.domain.hr.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.security.entity.Department;
import com.coreerp.domain.security.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "employees", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "employee_code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee extends TenantAwareEntity {

    @Column(name = "employee_code", nullable = false, length = 50)
    private String employeeCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "job_title", nullable = false, length = 150)
    private String jobTitle;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "salary_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal salaryAmount = BigDecimal.ZERO;

    @Column(name = "salary_frequency", nullable = false, length = 50)
    @Builder.Default
    private String salaryFrequency = "MONTHLY";

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE";

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/hr/entity/PayrollRun.java', `package com.coreerp.domain.hr.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.finance.entity.JournalEntry;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payroll_runs", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "payroll_number"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollRun extends TenantAwareEntity {

    @Column(name = "payroll_number", nullable = false, length = 100)
    private String payrollNumber;

    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;

    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;

    @Column(name = "total_gross_pay", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalGrossPay = BigDecimal.ZERO;

    @Column(name = "total_deductions", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalDeductions = BigDecimal.ZERO;

    @Column(name = "total_net_pay", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal totalNetPay = BigDecimal.ZERO;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "DRAFT";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id")
    private JournalEntry journalEntry;
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/project/entity/Project.java', `package com.coreerp.domain.project.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.sales.entity.Customer;
import com.coreerp.domain.hr.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "projects", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "project_code"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project extends TenantAwareEntity {

    @Column(name = "project_code", nullable = false, length = 50)
    private String projectCode;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_employee_id")
    private Employee managerEmployee;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "budget_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal budgetAmount = BigDecimal.ZERO;

    @Column(name = "cost_amount", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal costAmount = BigDecimal.ZERO;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "PLANNING";
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/asset/entity/Asset.java', `package com.coreerp.domain.asset.entity;

import com.coreerp.common.entity.TenantAwareEntity;
import com.coreerp.domain.hr.entity.Employee;
import com.coreerp.domain.security.entity.Department;
import com.coreerp.domain.inventory.entity.Warehouse;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "assets", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tenant_id", "asset_tag"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asset extends TenantAwareEntity {

    @Column(name = "asset_tag", nullable = false, length = 100)
    private String assetTag;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "purchase_cost", nullable = false, precision = 18, scale = 4)
    private BigDecimal purchaseCost;

    @Column(name = "salvage_value", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal salvageValue = BigDecimal.ZERO;

    @Column(name = "useful_life_months", nullable = false)
    @Builder.Default
    private int usefulLifeMonths = 60;

    @Column(name = "depreciation_method", nullable = false, length = 50)
    @Builder.Default
    private String depreciationMethod = "STRAIGHT_LINE";

    @Column(name = "current_book_value", nullable = false, precision = 18, scale = 4)
    private BigDecimal currentBookValue;

    @Column(name = "accumulated_depreciation", nullable = false, precision = 18, scale = 4)
    @Builder.Default
    private BigDecimal accumulatedDepreciation = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_employee_id")
    private Employee assignedEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE";
}
`);

// Repositories for Phase 3
writeFile('backend/src/main/java/com/coreerp/domain/manufacturing/repository/ProductionOrderRepository.java', `package com.coreerp.domain.manufacturing.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionOrderRepository extends JpaRepository<ProductionOrder, String> {
    Page<ProductionOrder> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/hr/repository/EmployeeRepository.java', `package com.coreerp.domain.hr.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Page<Employee> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
    Optional<Employee> findByTenantIdAndEmployeeCodeAndIsDeletedFalse(String tenantId, String employeeCode);
    long countByTenantIdAndIsDeletedFalse(String tenantId);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/hr/repository/PayrollRunRepository.java', `package com.coreerp.domain.hr.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayrollRunRepository extends JpaRepository<PayrollRun, String> {
    Page<PayrollRun> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/project/repository/ProjectRepository.java', `package com.coreerp.domain.project.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    Page<Project> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/asset/repository/AssetRepository.java', `package com.coreerp.domain.asset.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, String> {
    Page<Asset> findAllByTenantIdAndIsDeletedFalse(String tenantId, Pageable pageable);
}
`);

// Controllers for Phase 3
writeFile('backend/src/main/java/com/coreerp/domain/manufacturing/controller/ManufacturingController.java', `package com.coreerp.domain.manufacturing.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.manufacturing.entity.ProductionOrder;
import com.coreerp.domain.manufacturing.entity.ProductionOrderRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/manufacturing")
@RequiredArgsConstructor
@Tag(name = "Manufacturing & Production", description = "Bills of Materials, Work Orders, and MRP")
public class ManufacturingController {

    private final ProductionOrderRepository productionOrderRepository;

    @GetMapping("/production-orders")
    @PreAuthorize("hasAuthority('production_order:create') or hasRole('PRODUCTION_MANAGER')")
    @Operation(summary = "List Production Orders")
    public ResponseEntity<ApiResponse<PageResponse<ProductionOrder>>> listOrders(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<ProductionOrder> page = productionOrderRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/hr/controller/HrController.java', `package com.coreerp.domain.hr.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.hr.entity.Employee;
import com.coreerp.domain.hr.entity.EmployeeRepository;
import com.coreerp.domain.hr.entity.PayrollRun;
import com.coreerp.domain.hr.entity.PayrollRunRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/hr")
@RequiredArgsConstructor
@Tag(name = "Human Resources & Payroll", description = "Employee Records, Attendance, Leave, and Payroll Calculation")
public class HrController {

    private final EmployeeRepository employeeRepository;
    private final PayrollRunRepository payrollRunRepository;

    @GetMapping("/employees")
    @PreAuthorize("hasAuthority('employee:read') or hasRole('HR_MANAGER') or hasRole('HR_EXECUTIVE')")
    @Operation(summary = "List Employees")
    public ResponseEntity<ApiResponse<PageResponse<Employee>>> listEmployees(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Employee> page = employeeRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }

    @GetMapping("/payroll")
    @PreAuthorize("hasAuthority('payroll:calculate') or hasRole('HR_MANAGER') or hasRole('CFO')")
    @Operation(summary = "List Payroll Runs")
    public ResponseEntity<ApiResponse<PageResponse<PayrollRun>>> listPayroll(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<PayrollRun> page = payrollRunRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/project/controller/ProjectController.java', `package com.coreerp.domain.project.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.project.entity.Project;
import com.coreerp.domain.project.entity.ProjectRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management", description = "Projects, Tasks, Timesheets, and Resource Budgets")
public class ProjectController {

    private final ProjectRepository projectRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('project:manage') or hasRole('PROJECT_MANAGER')")
    @Operation(summary = "List Projects")
    public ResponseEntity<ApiResponse<PageResponse<Project>>> listProjects(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Project> page = projectRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

writeFile('backend/src/main/java/com/coreerp/domain/asset/controller/AssetController.java', `package com.coreerp.domain.asset.controller;

import com.coreerp.common.dto.ApiResponse;
import com.coreerp.common.dto.PageResponse;
import com.coreerp.domain.asset.entity.Asset;
import com.coreerp.domain.asset.entity.AssetRepository;
import com.coreerp.security.tenant.TenantContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/assets")
@RequiredArgsConstructor
@Tag(name = "Asset Management", description = "Fixed Asset Register, Transfers, and Depreciation")
public class AssetController {

    private final AssetRepository assetRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('asset:manage') or hasRole('ASSET_MANAGER')")
    @Operation(summary = "List Assets")
    public ResponseEntity<ApiResponse<PageResponse<Asset>>> listAssets(
            @PageableDefault(size = 20) Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        Page<Asset> page = assetRepository.findAllByTenantIdAndIsDeletedFalse(tenantId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(page)));
    }
}
`);

console.log("Phase 3 Java Backend files generated.");
