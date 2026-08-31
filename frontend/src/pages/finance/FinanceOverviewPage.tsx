import React from 'react';
import { DollarSign, FileText, ArrowUpRight, ArrowDownRight, CreditCard, PieChart } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const FinanceOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Finance & Accounting</h2>
          <p className="text-xs text-slate-500 mt-0.5">General Ledger, Accounts Payable, Accounts Receivable, and Treasury.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Balance Sheet</Button>
          <Button size="sm">New Journal Entry</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cash on Hand" value="$1,420,500" change="4.5%" isPositive icon={DollarSign} color="emerald" />
        <StatCard title="Accounts Receivable (AR)" value="$480,200" change="12.1%" isPositive={false} icon={ArrowUpRight} color="blue" />
        <StatCard title="Accounts Payable (AP)" value="$290,150" change="3.8%" isPositive icon={ArrowDownRight} color="amber" />
        <StatCard title="Net Monthly Margin" value="28.4%" change="1.2%" isPositive icon={PieChart} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Invoices" subtitle="Incoming and outgoing bills">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-blue-600">INV-2026-0089</td>
                  <td className="py-2.5 px-3">Acme Enterprise Corp</td>
                  <td className="py-2.5 px-3 font-medium">$45,000.00</td>
                  <td className="py-2.5 px-3"><Badge variant="emerald">PAID</Badge></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-blue-600">INV-2026-0090</td>
                  <td className="py-2.5 px-3">Global Tech Systems</td>
                  <td className="py-2.5 px-3 font-medium">$12,850.00</td>
                  <td className="py-2.5 px-3"><Badge variant="amber">PENDING</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="General Ledger Status" subtitle="Chart of accounts balance summary">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-slate-900">1000 - Current Assets</p>
                <p className="text-[11px] text-slate-500">Operating Bank Accounts & Petty Cash</p>
              </div>
              <span className="text-sm font-bold text-slate-900">$1,420,500.00</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-slate-900">2000 - Current Liabilities</p>
                <p className="text-[11px] text-slate-500">Accounts Payable & Accrued Expenses</p>
              </div>
              <span className="text-sm font-bold text-slate-900">$290,150.00</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-slate-900">4000 - Operating Revenue</p>
                <p className="text-[11px] text-slate-500">Product Sales & Enterprise Licensing</p>
              </div>
              <span className="text-sm font-bold text-emerald-600">$3,600,000.00</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
