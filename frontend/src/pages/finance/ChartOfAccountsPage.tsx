import React from 'react';
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
