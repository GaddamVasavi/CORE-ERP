import React, { useState } from 'react';
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
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${tab === 'AR' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Customer Invoices (Accounts Receivable)
        </button>
        <button
          onClick={() => setTab('AP')}
          className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${tab === 'AP' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
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
