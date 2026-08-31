# CoreERP Comprehensive Relational Data Model

## Master Tables Directory
1. **tenants**: Multi-tenant workspace accounts, subscriptions, currencies, and status.
2. **tenant_settings**: Dynamic key-value configuration overrides per tenant.
3. **users**: Enterprise identities, password hashes, 2FA secrets, lockout states.
4. **roles**: Granular enterprise roles (SUPER_ADMIN, CFO, ACCOUNTANT, etc.).
5. **permissions**: String-based action authorities (e.g. invoice:approve, payroll:calculate).
6. **role_permissions**: Many-to-many junction between roles and permissions.
7. **user_roles**: Many-to-many junction between users and roles.
8. **departments**: Hierarchical organizational units and cost centers.
9. **refresh_tokens**: High-entropy JWT refresh tokens with revocation flags.
10. **audit_logs**: Immutable audit logs of all business and security transactions.
11. **chart_of_accounts**: Double-entry general ledger tree with real-time balances.
12. **fiscal_years**: Accounting fiscal years and closure statuses.
13. **accounting_periods**: Monthly / quarterly fiscal periods.
14. **journal_entries**: Double-entry journal vouchers (Draft, Posted, Reversed).
15. **journal_entry_lines**: Debit/credit lines attached to chart of accounts.
16. **bank_accounts**: Enterprise bank and treasury accounts.
17. **bank_transactions**: Reconciled and pending bank statements.
18. **leads**: CRM sales prospects with lead scoring and qualification stages.
19. **opportunities**: Sales pipeline with stage probabilities and estimated revenues.
20. **customers**: Customer 360 directory, credit limits, billing/shipping addresses.
21. **sales_quotations**: Customer price quotations with line item discounts.
22. **sales_orders**: Confirmed customer orders with inventory reservation hooks.
23. **sales_order_items**: Order line items, tax percentages, and totals.
24. **suppliers**: Vendor directory, ratings, payment terms, and categories.
25. **purchase_requests**: Internal purchase requisitions with approval chains.
26. **purchase_orders**: Supplier POs with 3-way match references.
27. **purchase_order_items**: PO lines and quantity received counters.
28. **goods_receipts**: Dock receiving reports (GRN) with warehouse destination.
29. **product_categories**: Nested taxonomy for catalog items.
30. **products**: SKUs, UOMs, sales/purchase prices, reorder levels, safety stock.
31. **warehouses**: Physical fulfillment centers and storage facilities.
32. **warehouse_locations**: Zones, aisles, racks, and bins.
33. **inventory_items**: Stock on hand, reserved quantities, batches, and serials.
34. **inventory_movements**: Immutable inventory transaction ledger.
35. **bills_of_materials**: Multi-level manufacturing recipe structures.
36. **bom_items**: Subassembly components with scrap rate allowances.
37. **work_centers**: Shop floor machines, capacity hours, and hourly labor costs.
38. **production_orders**: Work orders for finished goods manufacturing.
39. **quality_inspections**: Sampling tests, defect records, and CAPA logs.
40. **employees**: HR records, job titles, hire dates, compensation details.
41. **attendance_records**: Clock-in/out timestamps and overtime calculations.
42. **leave_requests**: Paid/sick leave requests with manager approval chains.
43. **payroll_runs**: Monthly payroll calculation batches.
44. **payslips**: Individual employee salary breakdowns, taxes, and net pay.
45. **projects**: Client and internal projects with budgets and cost tracking.
46. **project_tasks**: WBS tasks with Kanban statuses and assignees.
47. **timesheets**: Billable hour entries linked to project tasks.
48. **assets**: Fixed asset register with purchase cost and salvage values.
49. **support_tickets**: Omnichannel helpdesk tickets with SLA countdowns.
50. **ticket_comments**: Customer and internal agent message threads.
51. **workflow_definitions**: Multi-step business approval blueprints.
52. **workflow_instances**: Live approval instances with state machines.
53. **approval_requests**: Individual step approver queues.
54. **documents**: Encrypted versioned file attachments.
55. **notifications**: In-app and multi-channel user alerts.
