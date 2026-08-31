import React from 'react';
import { Workflow, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const WorkflowsOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Workflows & Approvals Engine</h2>
          <p className="text-xs text-slate-500 mt-0.5">Enterprise approval hierarchies, delegations, multi-stage rules, and audit history.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Workflow Definitions</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>New Approval Request</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Workflows" value="34" change="6 pending you" isPositive={false} icon={Workflow} color="blue" />
        <StatCard title="Approved Today" value="18" change="2.4h avg SLA" isPositive icon={CheckCircle} color="emerald" />
        <StatCard title="Pending Approvals" value="12" change="Within SLA" isPositive icon={Clock} color="amber" />
        <StatCard title="Rejected / Escalated" value="2" change="1 escalated" isPositive={false} icon={XCircle} color="rose" />
      </div>

      <Card title="Approval Requests In-Flight" subtitle="Pending multi-level authorization queues">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Workflow</th>
                <th className="py-3 px-4">Entity Reference</th>
                <th className="py-3 px-4">Initiator</th>
                <th className="py-3 px-4">Current Step</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">PO Approval ($50k+)</td>
                <td className="py-3 px-4 font-mono text-blue-600">PO-2026-0810 ($52,400)</td>
                <td className="py-3 px-4">Procurement Mgr</td>
                <td className="py-3 px-4 font-medium">Step 2: CFO Review</td>
                <td className="py-3 px-4"><Badge variant="amber">PENDING</Badge></td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button variant="success" size="sm">Approve</Button>
                    <Button variant="danger" size="sm">Reject</Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
