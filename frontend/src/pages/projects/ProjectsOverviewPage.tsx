import React from 'react';
import { Briefcase, CheckCircle2, Clock, DollarSign, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProjectsOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Project Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Project Portfolios, Milestones, Timesheets, Kanban Tasks, and Profitability.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Timesheet Entry</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>New Project</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Projects" value="16" change="3 delivering" isPositive icon={Briefcase} color="blue" />
        <StatCard title="Billable Utilization" value="86.2%" change="4.1%" isPositive icon={Clock} color="emerald" />
        <StatCard title="Project Budget Track" value="$1.8M" change="Under budget" isPositive icon={DollarSign} color="purple" />
        <StatCard title="Milestones Completed" value="42 / 48" change="87.5%" isPositive icon={CheckCircle2} color="amber" />
      </div>

      <Card title="Project Portfolio" subtitle="Client delivery tracking and budget utilization">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Cost to Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-slate-900">PRJ-2026-088</td>
                <td className="py-3 px-4 font-semibold text-slate-900">NextGen Telecom Cloud Migration</td>
                <td className="py-3 px-4 text-slate-600">Horizon Telco</td>
                <td className="py-3 px-4 font-bold text-slate-900">$450,000.00</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">$280,000.00</td>
                <td className="py-3 px-4"><Badge variant="blue">ACTIVE</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
