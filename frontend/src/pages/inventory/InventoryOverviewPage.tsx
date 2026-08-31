import React from 'react';
import { Package, Warehouse, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const InventoryOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory & Warehouse Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time stock valuation, multi-warehouse bin tracking, and transfers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Stock Transfer</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Add Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total SKU Count" value="1,840" change="25 new" isPositive icon={Package} color="blue" />
        <StatCard title="Warehouses" value="6 Active" change="100% cap" isPositive icon={Warehouse} color="purple" />
        <StatCard title="Low Stock Alerts" value="8 SKUs" change="Needs action" isPositive={false} icon={AlertCircle} color="rose" />
        <StatCard title="Stock Turnover Ratio" value="6.8x" change="0.4x" isPositive icon={RefreshCw} color="emerald" />
      </div>

      <Card title="Product Inventory Ledger" subtitle="Stock on hand and reserved quantities across locations">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">On Hand</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">Unit Cost</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-slate-900">SKU-SRV-901</td>
                <td className="py-3 px-4 font-medium text-slate-900">Rack Server Node Gen 4</td>
                <td className="py-3 px-4">Hardware</td>
                <td className="py-3 px-4 font-bold text-slate-900">120</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">95</td>
                <td className="py-3 px-4">$1,850.00</td>
                <td className="py-3 px-4"><Badge variant="emerald">IN STOCK</Badge></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-slate-900">SKU-MEM-128</td>
                <td className="py-3 px-4 font-medium text-slate-900">128GB DDR5 ECC RAM</td>
                <td className="py-3 px-4">Components</td>
                <td className="py-3 px-4 font-bold text-rose-600">8</td>
                <td className="py-3 px-4 text-rose-600 font-semibold">2</td>
                <td className="py-3 px-4">$420.00</td>
                <td className="py-3 px-4"><Badge variant="rose">LOW STOCK</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
