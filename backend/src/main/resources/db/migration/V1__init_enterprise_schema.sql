-- ============================================================================
-- CoreERP Database Schema - V1: Foundation, Multi-Tenancy, Security & Admin
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants Table
CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) NOT NULL UNIQUE,
    custom_domain VARCHAR(255) UNIQUE,
    subscription_plan VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    fiscal_year_start_month INT NOT NULL DEFAULT 1,
    time_zone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    tax_identifier VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX idx_tenants_status ON tenants(status);

-- Tenant Settings (Key-Value configuration)
CREATE TABLE tenant_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'GENERAL',
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_tenant_setting_key UNIQUE (tenant_id, setting_key)
);

CREATE INDEX idx_tenant_settings_tenant_id ON tenant_settings(tenant_id);

-- Permissions Table
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_permissions_module ON permissions(module);

-- Roles Table
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_role_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX idx_roles_tenant ON roles(tenant_id);

-- Role Permissions Junction
CREATE TABLE role_permissions (
    role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(36) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Departments Table
CREATE TABLE departments (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    parent_department_id VARCHAR(36) REFERENCES departments(id),
    manager_id VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_dept_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX idx_departments_tenant ON departments(tenant_id);

-- Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(50),
    avatar_url VARCHAR(500),
    department_id VARCHAR(36) REFERENCES departments(id),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    is_super_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    failed_login_attempts INT NOT NULL DEFAULT 0,
    lockout_until TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- User Roles Junction
CREATE TABLE user_roles (
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(36) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Refresh Tokens Table
CREATE TABLE refresh_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    tenant_id VARCHAR(36) REFERENCES tenants(id) ON DELETE SET NULL,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    ip_address VARCHAR(100),
    user_agent VARCHAR(500),
    old_state JSONB,
    new_state JSONB,
    details TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_name, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Seed System Default Permissions
INSERT INTO permissions (name, module, action, description) VALUES
-- Multi-Tenancy & Admin
('tenant:read', 'TENANT', 'READ', 'View tenant configurations'),
('tenant:update', 'TENANT', 'UPDATE', 'Update tenant configurations'),
('tenant:manage', 'TENANT', 'MANAGE', 'Full tenant management'),
('user:create', 'USER', 'CREATE', 'Create tenant users'),
('user:read', 'USER', 'READ', 'View tenant users'),
('user:update', 'USER', 'UPDATE', 'Update tenant users'),
('user:delete', 'USER', 'DELETE', 'Delete tenant users'),
('role:manage', 'ROLE', 'MANAGE', 'Create and modify roles and permissions'),
('audit:read', 'AUDIT', 'READ', 'View enterprise audit logs'),

-- Finance & Accounting
('gl:read', 'FINANCE', 'READ', 'View General Ledger and Journal Entries'),
('gl:create', 'FINANCE', 'CREATE', 'Create Journal Entries'),
('gl:post', 'FINANCE', 'POST', 'Post Journal Entries'),
('gl:reverse', 'FINANCE', 'REVERSE', 'Reverse Journal Entries'),
('invoice:create', 'FINANCE', 'CREATE', 'Create Invoices'),
('invoice:read', 'FINANCE', 'READ', 'Read Invoices'),
('invoice:update', 'FINANCE', 'UPDATE', 'Update Invoices'),
('invoice:delete', 'FINANCE', 'DELETE', 'Delete Invoices'),
('invoice:approve', 'FINANCE', 'APPROVE', 'Approve Invoices'),
('invoice:pay', 'FINANCE', 'PAY', 'Pay Invoices'),
('banking:manage', 'FINANCE', 'MANAGE', 'Manage Bank Accounts and Reconciliation'),
('finance_report:read', 'FINANCE', 'READ', 'Access financial statements and reports'),

-- Sales & CRM
('lead:read', 'CRM', 'READ', 'View leads'),
('lead:create', 'CRM', 'CREATE', 'Create leads'),
('lead:convert', 'CRM', 'CONVERT', 'Convert leads to customers and opportunities'),
('opportunity:manage', 'CRM', 'MANAGE', 'Manage sales opportunities'),
('customer:read', 'SALES', 'READ', 'View customer details'),
('customer:manage', 'SALES', 'MANAGE', 'Manage customers'),
('quotation:create', 'SALES', 'CREATE', 'Create sales quotes'),
('sales_order:create', 'SALES', 'CREATE', 'Create sales orders'),
('sales_order:approve', 'SALES', 'APPROVE', 'Approve sales orders'),

-- Procurement
('supplier:manage', 'PROCUREMENT', 'MANAGE', 'Manage suppliers'),
('purchase_request:create', 'PROCUREMENT', 'CREATE', 'Create purchase requisitions'),
('purchase_request:approve', 'PROCUREMENT', 'APPROVE', 'Approve purchase requisitions'),
('purchase_order:create', 'PROCUREMENT', 'CREATE', 'Create purchase orders'),
('purchase_order:approve', 'PROCUREMENT', 'APPROVE', 'Approve purchase orders'),
('goods_receipt:create', 'PROCUREMENT', 'CREATE', 'Receive goods from purchase orders'),

-- Inventory & WMS
('inventory:read', 'INVENTORY', 'READ', 'View inventory and stock levels'),
('inventory:adjust', 'INVENTORY', 'ADJUST', 'Perform stock adjustments'),
('inventory:transfer', 'INVENTORY', 'TRANSFER', 'Transfer inventory between warehouses'),
('warehouse:manage', 'INVENTORY', 'MANAGE', 'Manage warehouse locations and bins'),

-- Manufacturing
('bom:manage', 'MANUFACTURING', 'MANAGE', 'Manage Bills of Materials'),
('production_order:create', 'MANUFACTURING', 'CREATE', 'Create production orders'),
('production_order:execute', 'MANUFACTURING', 'EXECUTE', 'Issue materials and complete production'),
('quality:inspect', 'MANUFACTURING', 'INSPECT', 'Perform quality inspections'),

-- HR & Payroll
('employee:read', 'HR', 'READ', 'View employee profiles'),
('employee:manage', 'HR', 'MANAGE', 'Create and update employee profiles'),
('attendance:record', 'HR', 'RECORD', 'Clock in and out and manage attendance'),
('leave:request', 'HR', 'REQUEST', 'Submit leave requests'),
('leave:approve', 'HR', 'APPROVE', 'Approve employee leave'),
('payroll:calculate', 'PAYROLL', 'CALCULATE', 'Calculate payroll runs'),
('payroll:approve', 'PAYROLL', 'APPROVE', 'Approve and finalize payroll'),

-- Projects & Assets
('project:manage', 'PROJECT', 'MANAGE', 'Manage projects, tasks and budgets'),
('timesheet:log', 'PROJECT', 'LOG', 'Log project timesheets and expenses'),
('asset:manage', 'ASSET', 'MANAGE', 'Manage fixed assets, transfers and maintenance'),
('asset:depreciate', 'ASSET', 'DEPRECIATE', 'Run asset depreciation schedules'),

-- Support & Workflows
('support:manage', 'SUPPORT', 'MANAGE', 'Handle customer support tickets and SLA'),
('workflow:manage', 'WORKFLOW', 'MANAGE', 'Configure workflows and approval matrices'),
('document:manage', 'DOCUMENT', 'MANAGE', 'Upload, version, and manage enterprise documents'),
('analytics:view', 'ANALYTICS', 'VIEW', 'View enterprise analytical dashboards');

-- Seed System Default Super Admin Tenant & User
INSERT INTO tenants (id, name, subdomain, subscription_plan, status, currency, time_zone)
VALUES ('00000000-0000-0000-0000-000000000001', 'CoreERP Global HQ', 'hq', 'ENTERPRISE', 'ACTIVE', 'USD', 'UTC');

-- Seed Global Roles
INSERT INTO roles (id, tenant_id, name, code, description, is_system_role) VALUES
('r0000000-0000-0000-0000-000000000001', NULL, 'Super Administrator', 'SUPER_ADMIN', 'Global System Administrator', TRUE),
('r0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Tenant Administrator', 'TENANT_ADMIN', 'Full tenant management authority', TRUE),
('r0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Chief Executive Officer', 'CEO', 'Executive dashboard and approval authority', TRUE),
('r0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Chief Financial Officer', 'CFO', 'Full financial and treasury authority', TRUE),
('r0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Finance Manager', 'FINANCE_MANAGER', 'Finance and accounting management', TRUE),
('r0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Accountant', 'ACCOUNTANT', 'General ledger and invoice processing', TRUE),
('r0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'HR Manager', 'HR_MANAGER', 'HR and payroll management', TRUE),
('r0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'HR Executive', 'HR_EXECUTIVE', 'Employee and recruitment operations', TRUE),
('r0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'Sales Manager', 'SALES_MANAGER', 'Sales and CRM management', TRUE),
('r0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Sales Executive', 'SALES_EXECUTIVE', 'Customer relations and sales orders', TRUE),
('r0000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Procurement Manager', 'PROCUREMENT_MANAGER', 'Purchasing and vendor management', TRUE),
('r0000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Purchase Executive', 'PURCHASE_EXECUTIVE', 'Purchase order execution', TRUE),
('r0000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'Warehouse Manager', 'WAREHOUSE_MANAGER', 'Warehouse operations and fulfillment', TRUE),
('r0000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', 'Inventory Manager', 'INVENTORY_MANAGER', 'Stock and material controls', TRUE),
('r0000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000001', 'Production Manager', 'PRODUCTION_MANAGER', 'Manufacturing and MRP operations', TRUE),
('r0000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000001', 'Quality Manager', 'QUALITY_MANAGER', 'Quality control and inspections', TRUE),
('r0000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000001', 'Project Manager', 'PROJECT_MANAGER', 'Project planning and resource allocation', TRUE),
('r0000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000001', 'Asset Manager', 'ASSET_MANAGER', 'Fixed assets and maintenance', TRUE),
('r0000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000001', 'Support Agent', 'SUPPORT_AGENT', 'Customer support and ticket resolution', TRUE),
('r0000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', 'Employee', 'EMPLOYEE', 'Standard self-service employee portal', TRUE),
('r0000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', 'Auditor', 'AUDITOR', 'Read-only compliance and auditing access', TRUE);

-- Map all permissions to SUPER_ADMIN & TENANT_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000001', id FROM permissions;

INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000002', id FROM permissions;

-- Seed Default Super Admin User (password: Admin@CoreERP2026!)
-- BCrypt: $2a$10$vI8aWBnW3fID.ZQ4/zo1G.qvhR1gq7fK7/J1/4rK2J9zJ0uE1qIwe
INSERT INTO users (
    id, tenant_id, email, password_hash, first_name, last_name,
    is_super_admin, is_email_verified, status
) VALUES (
    'u0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin@coreerp.com',
    '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.qvhR1gq7fK7/J1/4rK2J9zJ0uE1qIwe',
    'Enterprise',
    'Administrator',
    TRUE,
    TRUE,
    'ACTIVE'
);

INSERT INTO user_roles (user_id, role_id) VALUES
('u0000000-0000-0000-0000-000000000001', 'r0000000-0000-0000-0000-000000000001'),
('u0000000-0000-0000-0000-000000000001', 'r0000000-0000-0000-0000-000000000002');
