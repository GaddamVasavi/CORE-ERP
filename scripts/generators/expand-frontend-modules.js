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

console.log("Generating Comprehensive Frontend Modules...");

// Finance Sub-pages
writeFile('frontend/src/pages/finance/ChartOfAccountsPage.tsx', `import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Download } from 'lucide-react';

export const ChartOfAccountsPage: React.FC = () => {
  const accounts = [
    { code: '1010', name: 'Operating Bank Account (USD)', type: 'ASSET', balance: '$840,500.00', status: 'ACTIVE' },
    { code: '1020', name: 'Accounts Receivable (Trade Debtors)', type: 'ASSET', balance: '$480,200.00', status: 'ACTIVE' },
    { code: '1050', name: 'Finished Goods Inventory', type: 'ASSET', balance: '$520,000.00', status: 'ACTIVE' },
    { code: '2010', name: 'Accounts Payable (Trade Creditors)', type: 'LIABILITY', balance: '$290,150.00', status: 'ACTIVE' },
    { code: '2050', name: 'Accrued Payroll & Statutory Taxes', type: 'LIABILITY', balance: '$115,000.00', status: 'ACTIVE' },
    { code: '3010', name: 'Common Share Capital', type: 'EQUITY', balance: '$1,000,000.00', status: 'ACTIVE' },
    { code: '4010', name: 'Enterprise SaaS Subscription Revenue', type: 'REVENUE', balance: '$2,850,000.00', status: 'ACTIVE' },
    { code: '5010', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE', balance: '$750,000.00', status: 'ACTIVE' },
    { code: '6010', name: 'Salaries & Benefits Expense', type: 'EXPENSE', balance: '$845,000.00', status: 'ACTIVE' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Chart of Accounts</h2>
          <p className="text-xs text-slate-500 mt-0.5">Hierarchical general ledger account classification and real-time balances.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export CoA</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Add Account</Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Account Code</th>
                <th className="py-3 px-4">Account Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Current Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {accounts.map((acc) => (
                <tr key={acc.code}>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{acc.code}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{acc.name}</td>
                  <td className="py-3 px-4"><Badge variant="blue">{acc.type}</Badge></td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 text-right">{acc.balance}</td>
                  <td className="py-3 px-4"><Badge variant="emerald">{acc.status}</Badge></td>
                  <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Ledger</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
`);

writeFile('frontend/src/pages/finance/InvoicesPage.tsx', `import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Filter, Download } from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const [tab, setTab] = useState<'AR' | 'AP'>('AR');

  const invoices = [
    { number: 'INV-2026-0101', entity: 'Apex Industrial Solutions', date: '2026-08-20', due: '2026-09-19', total: '$84,000.00', paid: '$84,000.00', status: 'PAID' },
    { number: 'INV-2026-0102', entity: 'Nexus Robotics Inc', date: '2026-08-25', due: '2026-09-24', total: '$126,500.00', paid: '$0.00', status: 'ISSUED' },
    { number: 'INV-2026-0103', entity: 'Horizon Cloud Networks', date: '2026-08-28', due: '2026-09-27', total: '$45,200.00', paid: '$20,000.00', status: 'PARTIALLY_PAID' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Invoices & Billing</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer receivables (AR) and supplier payables (AP).</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export Aging</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Create Invoice</Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setTab('AR')}
          className={\`px-4 py-2 text-xs font-semibold border-b-2 transition-all \${tab === 'AR' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}\`}
        >
          Customer Invoices (Accounts Receivable)
        </button>
        <button
          onClick={() => setTab('AP')}
          className={\`px-4 py-2 text-xs font-semibold border-b-2 transition-all \${tab === 'AP' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}\`}
        >
          Supplier Invoices (Accounts Payable)
        </button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.number}>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{inv.number}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{inv.entity}</td>
                  <td className="py-3 px-4 text-slate-500">{inv.date}</td>
                  <td className="py-3 px-4 text-slate-500">{inv.due}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 text-right">{inv.total}</td>
                  <td className="py-3 px-4 font-mono text-emerald-600 text-right">{inv.paid}</td>
                  <td className="py-3 px-4">
                    <Badge variant={inv.status === 'PAID' ? 'emerald' : inv.status === 'ISSUED' ? 'blue' : 'amber'}>
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">Record Payment</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
`);

// Sales Sub-pages
writeFile('frontend/src/pages/sales/CustomersPage.tsx', `import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Mail, Phone } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const customers = [
    { code: 'CUST-001', name: 'Apex Industrial Solutions', email: 'billing@apexind.com', phone: '+1 555-0192', creditLimit: '$250,000.00', terms: 'Net 30' },
    { code: 'CUST-002', name: 'Nexus Robotics Inc', email: 'finance@nexusrobotics.io', phone: '+1 555-0843', creditLimit: '$500,000.00', terms: 'Net 30' },
    { code: 'CUST-003', name: 'Horizon Cloud Networks', email: 'ap@horizoncloud.com', phone: '+1 555-0371', creditLimit: '$150,000.00', terms: 'Net 15' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer 360 Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Unified customer profiles, credit controls, orders, invoices, and support history.</p>
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4" />}>Add Customer</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Credit Limit</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {customers.map((c) => (
                <tr key={c.code}>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{c.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3 px-4 text-slate-500">
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {c.email}</div>
                    <div className="flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-slate-400" /> {c.phone}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 text-right">{c.creditLimit}</td>
                  <td className="py-3 px-4"><Badge variant="slate">{c.terms}</Badge></td>
                  <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Customer 360</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
`);

// Project Kanban View
writeFile('frontend/src/pages/projects/ProjectKanbanPage.tsx', `import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus } from 'lucide-react';

export const ProjectKanbanPage: React.FC = () => {
  const columns = [
    { title: 'To Do', tasks: [{ id: 'TSK-101', title: 'Architect Kafka partition schema', assignee: 'Alex M.', priority: 'HIGH' }] },
    { title: 'In Progress', tasks: [{ id: 'TSK-102', title: 'Implement Redis sliding window rate limiter', assignee: 'Elena R.', priority: 'URGENT' }] },
    { title: 'Review', tasks: [{ id: 'TSK-103', title: 'Review Flyway V3 migration scripts', assignee: 'David K.', priority: 'MEDIUM' }] },
    { title: 'Done', tasks: [{ id: 'TSK-104', title: 'Design double-entry GL ledger engine', assignee: 'Sarah C.', priority: 'HIGH' }] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Project Tasks — Kanban Board</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sprint backlog and workflow execution.</p>
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4" />}>New Task</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col, idx) => (
          <div key={idx} className="bg-slate-100 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">{col.title}</h3>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">{col.tasks.length}</span>
            </div>
            <div className="space-y-2">
              {col.tasks.map((task) => (
                <div key={task.id} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold text-blue-600">{task.id}</span>
                    <Badge variant={task.priority === 'URGENT' ? 'rose' : 'blue'}>{task.priority}</Badge>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{task.title}</p>
                  <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100">
                    Assignee: {task.assignee}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
`);

// Notifications Center Page
writeFile('frontend/src/pages/notifications/NotificationsCenterPage.tsx', `import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Bell, Check, Trash2 } from 'lucide-react';

export const NotificationsCenterPage: React.FC = () => {
  const notifications = [
    { id: '1', title: 'Purchase Order Approval Required', message: 'PO-2026-0810 for $52,400 requires CFO approval.', type: 'APPROVAL', time: '10 mins ago', read: false },
    { id: '2', title: 'Low Inventory Alert', message: 'SKU-MEM-128 (128GB DDR5 ECC RAM) has reached safety threshold.', type: 'ALERT', time: '1 hour ago', read: false },
    { id: '3', title: 'Payroll Run Finalized', message: 'August 2026 payroll batch has been processed and journal posted.', type: 'SUCCESS', time: '4 hours ago', read: true },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications & Alerts Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time system events, approval requests, and critical operational alerts.</p>
        </div>
        <Button variant="outline" size="sm" icon={<Check className="w-4 h-4" />}>Mark All as Read</Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={\`p-4 rounded-xl border flex items-start justify-between \${n.read ? 'bg-white border-slate-200' : 'bg-blue-50/50 border-blue-200'}\`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={n.type === 'APPROVAL' ? 'amber' : n.type === 'ALERT' ? 'rose' : 'emerald'}>
                  {n.type}
                </Badge>
                <h3 className="text-sm font-semibold text-slate-900">{n.title}</h3>
                <span className="text-[11px] text-slate-400">• {n.time}</span>
              </div>
              <p className="text-xs text-slate-600">{n.message}</p>
            </div>
            <Button variant="ghost" size="sm">Action</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
`);

console.log("Sub-pages generated.");
