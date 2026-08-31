import React from 'react';
import { BarChart3, Download, Filter, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

const financialPerformance = [
  { quarter: 'Q1 2025', revenue: 1200000, margin: 340000 },
  { quarter: 'Q2 2025', revenue: 1450000, margin: 410000 },
  { quarter: 'Q3 2025', revenue: 1600000, margin: 480000 },
  { quarter: 'Q4 2025', revenue: 1850000, margin: 590000 },
  { quarter: 'Q1 2026', revenue: 2100000, margin: 680000 },
  { quarter: 'Q2 2026', revenue: 2450000, margin: 820000 },
];

export const AnalyticsReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics & Enterprise Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">Cross-functional business intelligence, operational metrics, and export engines.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>Filter Period</Button>
          <Button size="sm" icon={<Download className="w-4 h-4" />}>Export PDF / Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quarterly Financial Trajectory" subtitle="Revenue growth vs Gross profit margin">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="quarter" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                <Bar dataKey="margin" fill="#10b981" radius={[4, 4, 0, 0]} name="Margin ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Enterprise Reports Repository" subtitle="Download instant parameterized audits">
          <div className="space-y-3">
            {[
              { title: 'General Ledger Trial Balance', format: 'PDF & XLSX', date: 'Real-time' },
              { title: 'Procure-to-Pay (P2P) 3-Way Match Audit', format: 'CSV & XLSX', date: 'Monthly' },
              { title: 'Inventory Valuation & Aging Report', format: 'XLSX', date: 'Weekly' },
              { title: 'Payroll Tax Summary & Payslip Archive', format: 'PDF', date: 'Monthly' },
            ].map((rep, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <p className="text-xs font-semibold text-slate-900">{rep.title}</p>
                  <p className="text-[11px] text-slate-400">{rep.format} • Updated: {rep.date}</p>
                </div>
                <Button variant="ghost" size="sm">Generate</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
