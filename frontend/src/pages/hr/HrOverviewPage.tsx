import React from 'react';
import { Users, Calendar, DollarSign, Award, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const HrOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Human Resources & Payroll</h2>
          <p className="text-xs text-slate-500 mt-0.5">Employee Directory, Attendance, Leave Management, and Automated Payroll.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Leave Calendar</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Run Monthly Payroll</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Headcount" value="142" change="5 hires" isPositive icon={Users} color="blue" />
        <StatCard title="Monthly Payroll Cost" value="$845,000" change="On budget" isPositive icon={DollarSign} color="emerald" />
        <StatCard title="Today Attendance" value="97.8%" change="3 on leave" isPositive icon={Calendar} color="purple" />
        <StatCard title="Pending Approvals" value="4" change="Leave & Claims" isPositive={false} icon={Award} color="amber" />
      </div>

      <Card title="Employee Directory" subtitle="Active staff members across departments">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Job Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-slate-900">EMP-001</td>
                <td className="py-3 px-4 font-semibold text-slate-900">
                  Alex Morgan
                  <div className="text-[11px] text-slate-400 font-normal">alex.morgan@coreerp.com</div>
                </td>
                <td className="py-3 px-4">Engineering</td>
                <td className="py-3 px-4 font-medium">Principal Cloud Architect</td>
                <td className="py-3 px-4"><Badge variant="emerald">ACTIVE</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Profile</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
