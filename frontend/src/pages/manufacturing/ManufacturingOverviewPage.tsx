import React from 'react';
import { Factory, Cog, CheckSquare, Layers, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ManufacturingOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manufacturing & MRP</h2>
          <p className="text-xs text-slate-500 mt-0.5">Bills of Materials, Work Centers, Production Orders, and Quality Inspections.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Run MRP Engine</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>New Production Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Work Orders" value="28" change="4 in queue" isPositive icon={Factory} color="blue" />
        <StatCard title="Active BOMs" value="64" change="v2.1 live" isPositive icon={Layers} color="purple" />
        <StatCard title="Work Center OEE" value="88.4%" change="2.1%" isPositive icon={Cog} color="emerald" />
        <StatCard title="QA First-Pass Yield" value="99.2%" change="0.3%" isPositive icon={CheckSquare} color="amber" />
      </div>

      <Card title="Live Production Orders" subtitle="Shop floor execution and material issuance">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Finished Product</th>
                <th className="py-3 px-4">Planned Qty</th>
                <th className="py-3 px-4">Produced Qty</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-blue-600">PO-MFG-2026-0045</td>
                <td className="py-3 px-4 font-medium text-slate-900">High-Density Compute Blade X9</td>
                <td className="py-3 px-4 font-bold">250</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">180</td>
                <td className="py-3 px-4 text-slate-500">2026-09-15</td>
                <td className="py-3 px-4"><Badge variant="blue">IN_PROGRESS</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Inspect</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
