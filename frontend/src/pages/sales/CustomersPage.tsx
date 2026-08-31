import React from 'react';
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
