import React from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 450000, expenses: 320000 },
  { month: 'Feb', revenue: 520000, expenses: 340000 },
  { month: 'Mar', revenue: 610000, expenses: 390000 },
  { month: 'Apr', revenue: 590000, expenses: 370000 },
  { month: 'May', revenue: 680000, expenses: 410000 },
  { month: 'Jun', revenue: 750000, expenses: 430000 },
];

const salesByModule = [
  { name: 'Enterprise SaaS', sales: 380000 },
  { name: 'Hardware & Equip', sales: 220000 },
  { name: 'Consulting Services', sales: 150000 },
];

export const ExecutiveDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Executive Dashboard</h2>
        <p className="text-xs text-slate-500 mt-0.5">Real-time enterprise performance metrics and unified operations.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue (YTD)" value="$3,600,000" change="14.2%" isPositive icon={DollarSign} color="emerald" />
        <StatCard title="Net Operating Profit" value="$1,340,000" change="8.7%" isPositive icon={TrendingUp} color="blue" />
        <StatCard title="Active Employees" value="142" change="5 new" isPositive icon={Users} color="purple" />
        <StatCard title="Inventory Valuation" value="$845,200" change="2.1%" isPositive={false} icon={Package} color="amber" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Revenue vs Expenses Trend" subtitle="Monthly financial flow comparison" className="lg:col-span-2">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={0} strokeWidth={2} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue by Business Line" subtitle="Quarterly distribution">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByModule} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip />
                <Bar dataKey="sales" fill="#0284c7" radius={[0, 4, 4, 0]} name="Sales ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
