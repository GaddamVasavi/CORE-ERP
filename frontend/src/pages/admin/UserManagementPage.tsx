import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, UserPlus } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage enterprise tenant users, roles, and granular authorization.</p>
        </div>
        <Button icon={<UserPlus className="w-4 h-4" />}>Add User</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">
                  Enterprise Administrator
                  <div className="text-[11px] text-slate-400 font-normal">admin@coreerp.com</div>
                </td>
                <td className="py-3 px-4"><Badge variant="purple">SUPER_ADMIN</Badge></td>
                <td className="py-3 px-4">Executive Office</td>
                <td className="py-3 px-4"><Badge variant="emerald">ACTIVE</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
