# CoreERP Database Schema & Entity Relationships

The CoreERP PostgreSQL schema comprises 50+ normalized relational tables across 10 functional domains, managed through versioned Flyway migrations.

## Migration History
- **V1__init_enterprise_schema.sql**: Multi-tenancy foundations, Users, Roles, Permissions, Departments, Refresh Tokens, Audit Logs.
- **V2__finance_sales_procurement_inventory.sql**: Chart of Accounts, Fiscal Years, Journal Entries, Bank Accounts, Customers, Leads, Opportunities, Sales Orders, Suppliers, Purchase Orders, Goods Receipts, Products, Warehouses, Invoices, Payments.
- **V3__manufacturing_hr_payroll_projects_assets.sql**: Bills of Materials (BOM), Work Centers, Production Orders, Quality Inspections, Employees, Attendance, Leave, Payroll Runs, Payslips, Projects, Tasks, Timesheets, Assets, Depreciation.
- **V4__workflows_analytics_documents_support.sql**: Workflow Definitions, Instances, Approvals, Support Tickets, Comments, Documents, Notifications.
