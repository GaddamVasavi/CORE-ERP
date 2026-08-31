# CoreERP End-to-End Enterprise Process Workflows

## 1. Multi-Tenant Onboarding & Security Boundary
When a new enterprise customer signs up:
1. \`POST /api/v1/auth/register\` creates an isolated \`Tenant\` entity.
2. Tenant-scoped roles (\`TENANT_ADMIN\`, \`CFO\`, \`ACCOUNTANT\`, \`SALES_MANAGER\`, etc.) are cloned and mapped with domain permissions.
3. The initial Chart of Accounts is initialized from the global standard template.
4. Default warehouse (\`MAIN-WH-01\`), operating currency (e.g. \`USD\`), and standard fiscal calendar (Jan–Dec) are established.
5. All subsequent database operations enforce \`WHERE tenant_id = :currentTenantId\` via Hibernate discriminator filters and Spring Security Context.

---

## 2. Procure-to-Pay (P2P) Complete Lifecycle
The Procure-to-Pay workflow governs corporate purchasing:
1. **Purchase Requisition (PR)**: Department employee creates PR for goods or assets.
2. **Approval Hierarchy**: Requisitions > $10,000 route automatically to the Department Head; requisitions > $50,000 require CFO authorization.
3. **RFQ & Sourcing**: Procurement team issues Requests for Quotation (RFQ) to multiple qualified suppliers.
4. **Quotation Comparison**: Suppliers submit quotes, compared side-by-side in the RFQ Matrix.
5. **Purchase Order (PO)**: Sourcing team converts approved quotation to a legal Purchase Order.
6. **Goods Receipt (GRN)**: Receiving dock verifies physical shipment against PO lines; inventory on-hand balances are incremented in the specified warehouse bin.
7. **3-Way Match & Invoice**: Supplier invoice is matched against PO quantities/prices and GRN actuals.
8. **Payment & GL Posting**: Treasury disburses payment via bank transfer; automated double-entry journal is posted:
   - Debit: Accounts Payable (2010)
   - Credit: Operating Bank Account (1010)

---

## 3. Order-to-Cash (O2C) Complete Lifecycle
The Order-to-Cash process powers revenue generation:
1. **Lead Generation & Scoring**: CRM captures inbound leads, scored based on company size, budget, and timeline.
2. **Opportunity Progression**: Qualified leads convert to opportunities across pipeline stages.
3. **Sales Quotation**: Sales representative configures price lists, tier discounts, and tax rates.
4. **Sales Order (SO)**: Customer accepts quote -> SO created -> System checks warehouse stock and places soft reservations on inventory.
5. **Order Fulfillment & Dispatch**: Warehouse staff picks, packs, and dispatches goods; inventory on-hand is reduced.
6. **Customer Invoicing**: Accounts Receivable issues invoice -> Ledger entries posted:
   - Debit: Accounts Receivable (1020)
   - Credit: Sales Revenue (4010)
7. **Payment Receipt & Allocation**: Customer pays via wire/card; payment is matched against invoice -> Invoice marked \`PAID\`.

---

## 4. Plan-to-Produce (Manufacturing & MRP)
The manufacturing cycle coordinates bills of materials, work centers, and shop floor operations:
1. **Demand Forecasting & MRP**: System evaluates open sales orders vs available inventory -> calculates net component requirements.
2. **Production Order Release**: Work order scheduled on designated Work Centers taking into account daily machine capacity and labor rates.
3. **Material Issuance**: Raw materials and subassemblies issued from warehouse to WIP (Work in Progress).
4. **Production Execution**: Routing steps completed, scrap rate logged.
5. **Quality Control Inspection**: QA inspector conducts sampling test against quality criteria checklist.
6. **Finished Goods Put-Away**: Passed goods transferred to finished goods warehouse bin -> WIP cleared to Inventory asset account.

---

## 5. Hire-to-Retire (HR & Automated Payroll)
The employee lifecycle and compensation workflow:
1. **Employee Onboarding**: Personal profile, department, manager, salary structure, and emergency contacts registered.
2. **Attendance & Time Tracking**: Daily clock-in/out records, shift compliance, and overtime hours calculated.
3. **Leave Management**: Employee submits leave requests; system validates balance against accrual policy -> routes to manager for approval.
4. **Monthly Payroll Run**: Payroll engine processes salary batches:
   - Gross Pay = Basic Salary + Allowances + Overtime Pay + Bonuses
   - Deductions = Progressive Income Tax + Retirement Pension (5%) + Health Insurance
   - Net Pay = Gross Pay - Total Deductions
5. **Payslip Delivery & GL Posting**: Encrypted digital payslips generated -> Payroll journal posted to General Ledger:
   - Debit: Salaries & Wages Expense (6010)
   - Credit: Accrued Payroll & Tax Payable (2050)
