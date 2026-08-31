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
