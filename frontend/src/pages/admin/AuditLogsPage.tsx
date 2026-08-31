import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const AuditLogsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Enterprise Audit Logs</h2>
        <p className="text-xs text-slate-500 mt-0.5">Immutable audit trail of authentication and business operations.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 text-slate-500">Just now</td>
                <td className="py-3 px-4 font-medium">admin@coreerp.com</td>
                <td className="py-3 px-4"><Badge variant="blue">USER_LOGIN</Badge></td>
                <td className="py-3 px-4">Security Session</td>
                <td className="py-3 px-4"><Badge variant="emerald">SUCCESS</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
