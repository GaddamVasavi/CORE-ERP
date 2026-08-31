import React from 'react';
import { FileText, Folder, UploadCloud, Lock, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const DocumentsOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Document Management System (DMS)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Secure enterprise repository, contracts, attachments, versions, and audit trails.</p>
        </div>
        <Button size="sm" icon={<UploadCloud className="w-4 h-4" />}>Upload Document</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Stored Documents" value="1,248" change="34 this week" isPositive icon={FileText} color="blue" />
        <StatCard title="Categories" value="18 Active" change="Fully indexed" isPositive icon={Folder} color="purple" />
        <StatCard title="Storage Used" value="48.2 GB" change="Encrypted at rest" isPositive icon={Lock} color="emerald" />
        <StatCard title="Expiring Soon" value="4 Contracts" change="Action required" isPositive={false} icon={FileText} color="amber" />
      </div>

      <Card title="Enterprise File Directory" subtitle="Versioned document attachments across ERP modules">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Associated Entity</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Uploaded</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Master_Services_Agreement_AcmeCorp_2026.pdf</td>
                <td className="py-3 px-4 text-blue-600 font-medium">Customer: Acme Corp</td>
                <td className="py-3 px-4 text-slate-500">2.4 MB</td>
                <td className="py-3 px-4"><Badge variant="slate">v2.0</Badge></td>
                <td className="py-3 px-4 text-slate-500">2026-08-15</td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Download</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
