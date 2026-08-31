import React from 'react';
import { HelpCircle, Clock, CheckCircle2, MessageSquare, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const SupportOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Support & Helpdesk</h2>
          <p className="text-xs text-slate-500 mt-0.5">Customer SLA tracking, omnichannel ticket routing, and resolution metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">SLA Policies</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>New Ticket</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Tickets" value="19" change="4 unassigned" isPositive={false} icon={HelpCircle} color="amber" />
        <StatCard title="Avg First Response" value="14 mins" change="Goal < 30m" isPositive icon={Clock} color="emerald" />
        <StatCard title="Resolved (This Week)" value="64" change="98.4% SLA" isPositive icon={CheckCircle2} color="blue" />
        <StatCard title="CSAT Score" value="4.9 / 5.0" change="Based on 52 reviews" isPositive icon={MessageSquare} color="purple" />
      </div>

      <Card title="Active Support Queue" subtitle="Real-time ticket lifecycle management">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-blue-600">TCK-2026-0391</td>
                <td className="py-3 px-4 font-medium text-slate-900">Acme Enterprise Corp</td>
                <td className="py-3 px-4 font-semibold text-slate-900">EDI Gateway Order Sync Timeout</td>
                <td className="py-3 px-4"><Badge variant="rose">URGENT</Badge></td>
                <td className="py-3 px-4"><Badge variant="blue">IN_PROGRESS</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Respond</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
