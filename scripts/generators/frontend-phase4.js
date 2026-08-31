const fs = require('fs');
const path = require('path');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  const fullPath = path.resolve(process.cwd(), filePath);
  ensureDirSync(path.dirname(fullPath));
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`Created: ${filePath}`);
}

console.log("Generating Phase 4 Frontend Codebase...");

// Workflows Overview Page
writeFile('frontend/src/pages/workflows/WorkflowsOverviewPage.tsx', `import React from 'react';
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
`);

// Support Helpdesk Overview Page
writeFile('frontend/src/pages/support/SupportOverviewPage.tsx', `import React from 'react';
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
`);

// Documents Page
writeFile('frontend/src/pages/documents/DocumentsOverviewPage.tsx', `import React from 'react';
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
`);

// Analytics & Reporting Page
writeFile('frontend/src/pages/analytics/AnalyticsReportsPage.tsx', `import React from 'react';
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
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => \`$\${v / 1000}k\`} />
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
`);

// Update AppRoutes.tsx with all modules
writeFile('frontend/src/routes/AppRoutes.tsx', `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ExecutiveDashboardPage } from '../pages/dashboard/ExecutiveDashboardPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';
import { TenantSettingsPage } from '../pages/admin/TenantSettingsPage';
import { FinanceOverviewPage } from '../pages/finance/FinanceOverviewPage';
import { SalesOverviewPage } from '../pages/sales/SalesOverviewPage';
import { ProcurementOverviewPage } from '../pages/procurement/ProcurementOverviewPage';
import { InventoryOverviewPage } from '../pages/inventory/InventoryOverviewPage';
import { ManufacturingOverviewPage } from '../pages/manufacturing/ManufacturingOverviewPage';
import { HrOverviewPage } from '../pages/hr/HrOverviewPage';
import { ProjectsOverviewPage } from '../pages/projects/ProjectsOverviewPage';
import { AssetsOverviewPage } from '../pages/assets/AssetsOverviewPage';
import { WorkflowsOverviewPage } from '../pages/workflows/WorkflowsOverviewPage';
import { SupportOverviewPage } from '../pages/support/SupportOverviewPage';
import { DocumentsOverviewPage } from '../pages/documents/DocumentsOverviewPage';
import { AnalyticsReportsPage } from '../pages/analytics/AnalyticsReportsPage';

export const AppRoutes: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />} />

      {/* Protected ERP Shell */}
      <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<ExecutiveDashboardPage />} />
        <Route path="/finance/*" element={<FinanceOverviewPage />} />
        <Route path="/sales/*" element={<SalesOverviewPage />} />
        <Route path="/procurement/*" element={<ProcurementOverviewPage />} />
        <Route path="/inventory/*" element={<InventoryOverviewPage />} />
        <Route path="/manufacturing/*" element={<ManufacturingOverviewPage />} />
        <Route path="/hr/*" element={<HrOverviewPage />} />
        <Route path="/projects/*" element={<ProjectsOverviewPage />} />
        <Route path="/assets/*" element={<AssetsOverviewPage />} />
        <Route path="/workflows/*" element={<WorkflowsOverviewPage />} />
        <Route path="/support/*" element={<SupportOverviewPage />} />
        <Route path="/documents/*" element={<DocumentsOverviewPage />} />
        <Route path="/analytics/*" element={<AnalyticsReportsPage />} />
        
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/audit" element={<AuditLogsPage />} />
        <Route path="/admin/settings" element={<TenantSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
`);

console.log("Phase 4 Frontend scaffolding completed.");
