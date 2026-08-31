import React from 'react';
import { Layers, ShieldCheck, Wrench, RefreshCw, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AssetsOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enterprise Asset Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Fixed Asset Register, Transfers, Automated Depreciation, and Preventive Maintenance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Run Depreciation</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Register Asset</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Book Value" value="$4,820,000" change="Audited" isPositive icon={Layers} color="blue" />
        <StatCard title="Total Fixed Assets" value="538 Units" change="18 new" isPositive icon={ShieldCheck} color="emerald" />
        <StatCard title="Active Maintenance" value="6 Assets" change="Preventive" isPositive={false} icon={Wrench} color="amber" />
        <StatCard title="Accumulated Depr." value="$1,240,000" change="On schedule" isPositive icon={RefreshCw} color="purple" />
      </div>

      <Card title="Asset Register" subtitle="Enterprise equipment, IT infrastructure, and facilities">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tag</th>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Purchase Cost</th>
                <th className="py-3 px-4">Current Book Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-blue-600">AST-SRV-001</td>
                <td className="py-3 px-4 font-semibold text-slate-900">Primary Enterprise SAN Storage Cluster</td>
                <td className="py-3 px-4">IT_HARDWARE</td>
                <td className="py-3 px-4 font-bold text-slate-900">$185,000.00</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">$148,000.00</td>
                <td className="py-3 px-4"><Badge variant="emerald">ACTIVE</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
