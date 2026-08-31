import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { StatCard } from '../../../components/ui/StatCard';
import { Plus, Search, Filter, Download, RefreshCw, CheckCircle, AlertTriangle, Layers } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AssetModuleViewPart5: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const chartData = [
    { period: 'W1', value: 54500, benchmark: 48000 },
    { period: 'W2', value: 66200, benchmark: 56700 },
    { period: 'W3', value: 63300, benchmark: 59800 },
    { period: 'W4', value: 82100, benchmark: 66500 },
  ];

  const tableRows = Array.from({ length: 8 }).map((_, idx) => ({
    id: `ASS-${202600 + idx + i * 10}`,
    title: `Enterprise ASSET Process Node ${idx + 1} - Stream ${i}`,
    category: idx % 2 === 0 ? 'Primary Tier' : 'Secondary Tier',
    amount: `$${((idx + 1) * 1450 * i).toLocaleString()}.00`,
    status: idx % 3 === 0 ? 'COMPLETED' : idx % 3 === 1 ? 'PROCESSING' : 'PENDING_APPROVAL',
    lastUpdated: '2026-08-30T10:15:00Z',
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">ASSET — Enterprise Console (Part 5)</h2>
          <p className="text-xs text-slate-500 mt-0.5">High-volume transactional operations, real-time analytics, and audit tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>Export Dataset</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>New ASSET Record</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Operations" value="210" change="8.4%" isPositive icon={Layers} color="blue" />
        <StatCard title="Reconciled Volume" value="$9,25,000" change="12.1%" isPositive icon={CheckCircle} color="emerald" />
        <StatCard title="Pending Verifications" value="25" change="Within SLA" isPositive icon={RefreshCw} color="purple" />
        <StatCard title="Variance Index" value="0.05%" change="Optimal" isPositive icon={AlertTriangle} color="amber" />
      </div>

      {/* Chart Section */}
      <Card title="Transactional Trajectory & SLA Benchmarks" subtitle="Rolling 4-week performance curve">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#2563eb" fillOpacity={1} fill="url(#colorVal5)" strokeWidth={2} name="Actual ($)" />
              <Area type="monotone" dataKey="benchmark" stroke="#10b981" fillOpacity={0} strokeWidth={2} name="Benchmark ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Filter and Data Grid */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search asset records by ID, title or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'COMPLETED', 'PROCESSING', 'PENDING'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeFilter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Identifier</th>
                <th className="py-3 px-4">Process Name</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-right">Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tableRows.map((row) => (
                <tr key={row.id}>
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{row.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{row.title}</td>
                  <td className="py-3 px-4"><Badge variant="slate">{row.category}</Badge></td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right">{row.amount}</td>
                  <td className="py-3 px-4">
                    <Badge variant={row.status === 'COMPLETED' ? 'emerald' : row.status === 'PROCESSING' ? 'blue' : 'amber'}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">Details</Button>
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
