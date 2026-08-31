# CoreERP Enterprise REST API Specification (OpenAPI 3.0)

## Security & Headers
All requests after authentication must supply:
- \`Authorization: Bearer <access_token>\`
- \`X-Tenant-ID: <tenant_uuid>\`

---

## 1. Authentication & Security Endpoints
- **POST** \`/api/v1/auth/login\`: Authenticate credentials, returns JWT & Refresh token.
- **POST** \`/api/v1/auth/register\`: Register new enterprise tenant & admin user.
- **POST** \`/api/v1/auth/refresh\`: Rotate JWT token with valid refresh token.
- **POST** \`/api/v1/auth/logout\`: Invalidate session and revoke token.

---

## 2. Multi-Tenancy & User Management
- **GET** \`/api/v1/tenants/current\`: Fetch current tenant profile and subscription.
- **GET** \`/api/v1/users\`: List users for the active tenant (paginated).
- **POST** \`/api/v1/users\`: Provision new tenant user with granular roles.
- **GET** \`/api/v1/users/{id}\`: Fetch detailed user profile.
- **DELETE** \`/api/v1/users/{id}\`: Soft delete user.
- **GET** \`/api/v1/audit\`: Query tenant audit logs with entity and date filters.

---

## 3. Finance & General Ledger
- **GET** \`/api/v1/finance/accounts\`: Get hierarchical Chart of Accounts.
- **POST** \`/api/v1/finance/accounts\`: Create new GL account.
- **GET** \`/api/v1/finance/journal-entries\`: List journal vouchers (Draft/Posted/Reversed).
- **POST** \`/api/v1/finance/journal-entries\`: Create double-entry journal entry.
- **POST** \`/api/v1/finance/journal-entries/{id}/post\`: Validate debit/credit balance & post to GL.
- **GET** \`/api/v1/finance/reports/balance-sheet\`: Generate balance sheet report.
- **GET** \`/api/v1/finance/reports/income-statement\`: Generate profit & loss report.
- **GET** \`/api/v1/invoices\`: Query AR & AP Invoices.
- **POST** \`/api/v1/invoices\`: Create customer or supplier invoice.
- **POST** \`/api/v1/payments\`: Record payment transaction against invoice.

---

## 4. Sales & CRM
- **GET** \`/api/v1/customers\`: List customers with credit limits and balances.
- **POST** \`/api/v1/customers\`: Create customer record.
- **GET** \`/api/v1/leads\`: Query CRM leads pipeline.
- **POST** \`/api/v1/leads\`: Capture inbound lead.
- **POST** \`/api/v1/leads/{id}/convert\`: Convert lead to customer and opportunity.
- **GET** \`/api/v1/sales-orders\`: List sales orders.
- **POST** \`/api/v1/sales-orders\`: Create sales order with soft inventory reservation.

---

## 5. Procurement & Sourcing
- **GET** \`/api/v1/procurement/suppliers\`: List approved vendors.
- **POST** \`/api/v1/procurement/suppliers\`: Register new vendor.
- **GET** \`/api/v1/procurement/purchase-orders\`: Query purchase orders.
- **POST** \`/api/v1/procurement/purchase-orders\`: Issue purchase order to supplier.

---

## 6. Inventory & Warehouse Management
- **GET** \`/api/v1/inventory/products\`: Product catalog with SKUs and pricing.
- **POST** \`/api/v1/inventory/products\`: Create product SKU.
- **GET** \`/api/v1/inventory/warehouses\`: List physical warehouses.
- **GET** \`/api/v1/inventory/stock\`: Query real-time stock levels across bins.

---

## 7. Manufacturing & MRP
- **GET** \`/api/v1/manufacturing/bom\`: List bills of materials.
- **POST** \`/api/v1/manufacturing/bom\`: Define multi-level BOM.
- **GET** \`/api/v1/manufacturing/production-orders\`: List work orders.
- **POST** \`/api/v1/manufacturing/production-orders\`: Schedule manufacturing run.

---

## 8. HR & Payroll
- **GET** \`/api/v1/hr/employees\`: Employee directory.
- **POST** \`/api/v1/hr/employees\`: Onboard new employee.
- **GET** \`/api/v1/hr/payroll\`: Query monthly payroll batches.
- **POST** \`/api/v1/hr/payroll/calculate\`: Execute automated payroll calculation run.

---

## 9. Projects & Assets
- **GET** \`/api/v1/projects\`: List active projects and budget utilization.
- **POST** \`/api/v1/projects\`: Create project.
- **GET** \`/api/v1/assets\`: Fixed asset registry.
- **POST** \`/api/v1/assets/depreciate\`: Execute monthly depreciation batch.

---

## 10. Workflows & Support
- **GET** \`/api/v1/workflows/instances\`: Live approval queue.
- **POST** \`/api/v1/workflows/instances/{id}/approve\`: Approve workflow step.
- **POST** \`/api/v1/workflows/instances/{id}/reject\`: Reject workflow step.
- **GET** \`/api/v1/support/tickets\`: Helpdesk ticket queue.
- **POST** \`/api/v1/support/tickets\`: Create customer support ticket.
- **GET** \`/api/v1/documents\`: List document attachments.
