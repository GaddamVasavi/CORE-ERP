import React from 'react';
import { ShoppingCart, Users, Target, TrendingUp, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const SalesOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales & CRM</h2>
          <p className="text-xs text-slate-500 mt-0.5">Leads, Opportunities Pipeline, Customer 360, and Sales Orders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">New Lead</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Create Sales Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pipeline Value" value="$2,450,000" change="18.5%" isPositive icon={Target} color="blue" />
        <StatCard title="Open Sales Orders" value="48" change="6 new" isPositive icon={ShoppingCart} color="emerald" />
        <StatCard title="Active Customers" value="312" change="14" isPositive icon={Users} color="purple" />
        <StatCard title="Win Rate" value="64.2%" change="3.1%" isPositive icon={TrendingUp} color="amber" />
      </div>

      <Card title="Active Sales Orders" subtitle="Recent customer purchase commitments">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-blue-600">SO-2026-0412</td>
                <td className="py-3 px-4 font-medium text-slate-900">Apex Industrial Solutions</td>
                <td className="py-3 px-4 text-slate-500">2026-08-28</td>
                <td className="py-3 px-4 font-bold text-slate-900">$84,000.00</td>
                <td className="py-3 px-4"><Badge variant="blue">PROCESSING</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">View</Button></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-blue-600">SO-2026-0413</td>
                <td className="py-3 px-4 font-medium text-slate-900">Nexus Robotics Inc</td>
                <td className="py-3 px-4 text-slate-500">2026-08-30</td>
                <td className="py-3 px-4 font-bold text-slate-900">$126,500.00</td>
                <td className="py-3 px-4"><Badge variant="emerald">CONFIRMED</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">View</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
