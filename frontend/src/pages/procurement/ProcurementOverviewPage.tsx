import React from 'react';
import { Building2, ShoppingBag, Truck, CheckCircle2, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProcurementOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Procurement & Sourcing</h2>
          <p className="text-xs text-slate-500 mt-0.5">Procure-to-Pay (P2P), Suppliers, Purchase Requisitions, and Goods Receipts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">New RFQ</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Create Purchase Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Suppliers" value="84" change="2 new" isPositive icon={Building2} color="blue" />
        <StatCard title="Pending PO Value" value="$640,000" change="8.4%" isPositive icon={ShoppingBag} color="amber" />
        <StatCard title="Pending Receipts (GRN)" value="12" change="3 today" isPositive icon={Truck} color="purple" />
        <StatCard title="On-Time Delivery Rate" value="96.5%" change="1.4%" isPositive icon={CheckCircle2} color="emerald" />
      </div>

      <Card title="Purchase Orders" subtitle="Approved and in-transit procurement orders">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PO #</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-blue-600">PO-2026-0810</td>
                <td className="py-3 px-4 font-medium text-slate-900">Titan Microelectronics</td>
                <td className="py-3 px-4 text-slate-500">2026-08-25</td>
                <td className="py-3 px-4 font-bold text-slate-900">$52,400.00</td>
                <td className="py-3 px-4"><Badge variant="blue">APPROVED</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Receive</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
