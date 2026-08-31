import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Bell, Check, Trash2 } from 'lucide-react';

export const NotificationsCenterPage: React.FC = () => {
  const notifications = [
    { id: '1', title: 'Purchase Order Approval Required', message: 'PO-2026-0810 for $52,400 requires CFO approval.', type: 'APPROVAL', time: '10 mins ago', read: false },
    { id: '2', title: 'Low Inventory Alert', message: 'SKU-MEM-128 (128GB DDR5 ECC RAM) has reached safety threshold.', type: 'ALERT', time: '1 hour ago', read: false },
    { id: '3', title: 'Payroll Run Finalized', message: 'August 2026 payroll batch has been processed and journal posted.', type: 'SUCCESS', time: '4 hours ago', read: true },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications & Alerts Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time system events, approval requests, and critical operational alerts.</p>
        </div>
        <Button variant="outline" size="sm" icon={<Check className="w-4 h-4" />}>Mark All as Read</Button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border flex items-start justify-between ${n.read ? 'bg-white border-slate-200' : 'bg-blue-50/50 border-blue-200'}`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={n.type === 'APPROVAL' ? 'amber' : n.type === 'ALERT' ? 'rose' : 'emerald'}>
                  {n.type}
                </Badge>
                <h3 className="text-sm font-semibold text-slate-900">{n.title}</h3>
                <span className="text-[11px] text-slate-400">• {n.time}</span>
              </div>
              <p className="text-xs text-slate-600">{n.message}</p>
            </div>
            <Button variant="ghost" size="sm">Action</Button>
          </div>
        ))}
      </div>
    </div>
  );
};
