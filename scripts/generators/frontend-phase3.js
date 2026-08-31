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

console.log("Generating Phase 3 Frontend Codebase...");

// Manufacturing Overview Page
writeFile('frontend/src/pages/manufacturing/ManufacturingOverviewPage.tsx', `import React from 'react';
import { Factory, Cog, CheckSquare, Layers, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ManufacturingOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manufacturing & MRP</h2>
          <p className="text-xs text-slate-500 mt-0.5">Bills of Materials, Work Centers, Production Orders, and Quality Inspections.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Run MRP Engine</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>New Production Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Work Orders" value="28" change="4 in queue" isPositive icon={Factory} color="blue" />
        <StatCard title="Active BOMs" value="64" change="v2.1 live" isPositive icon={Layers} color="purple" />
        <StatCard title="Work Center OEE" value="88.4%" change="2.1%" isPositive icon={Cog} color="emerald" />
        <StatCard title="QA First-Pass Yield" value="99.2%" change="0.3%" isPositive icon={CheckSquare} color="amber" />
      </div>

      <Card title="Live Production Orders" subtitle="Shop floor execution and material issuance">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Finished Product</th>
                <th className="py-3 px-4">Planned Qty</th>
                <th className="py-3 px-4">Produced Qty</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-blue-600">PO-MFG-2026-0045</td>
                <td className="py-3 px-4 font-medium text-slate-900">High-Density Compute Blade X9</td>
                <td className="py-3 px-4 font-bold">250</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">180</td>
                <td className="py-3 px-4 text-slate-500">2026-09-15</td>
                <td className="py-3 px-4"><Badge variant="blue">IN_PROGRESS</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Inspect</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
`);

// HR & Payroll Overview Page
writeFile('frontend/src/pages/hr/HrOverviewPage.tsx', `import React from 'react';
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
`);

// Project Management Overview Page
writeFile('frontend/src/pages/projects/ProjectsOverviewPage.tsx', `import React from 'react';
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
`);

// Asset Management Overview Page
writeFile('frontend/src/pages/assets/AssetsOverviewPage.tsx', `import React from 'react';
import { Layers, ShieldCheck, Wrench, RefreshCw, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const AssetsOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enterprise Asset Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Fixed Asset Register, Transfers, Automated Depreciation, and Preventive Maintenance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Run Depreciation</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Register Asset</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Book Value" value="$4,820,000" change="Audited" isPositive icon={Layers} color="blue" />
        <StatCard title="Total Fixed Assets" value="538 Units" change="18 new" isPositive icon={ShieldCheck} color="emerald" />
        <StatCard title="Active Maintenance" value="6 Assets" change="Preventive" isPositive={false} icon={Wrench} color="amber" />
        <StatCard title="Accumulated Depr." value="$1,240,000" change="On schedule" isPositive icon={RefreshCw} color="purple" />
      </div>

      <Card title="Asset Register" subtitle="Enterprise equipment, IT infrastructure, and facilities">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Tag</th>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Purchase Cost</th>
                <th className="py-3 px-4">Current Book Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-blue-600">AST-SRV-001</td>
                <td className="py-3 px-4 font-semibold text-slate-900">Primary Enterprise SAN Storage Cluster</td>
                <td className="py-3 px-4">IT_HARDWARE</td>
                <td className="py-3 px-4 font-bold text-slate-900">$185,000.00</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">$148,000.00</td>
                <td className="py-3 px-4"><Badge variant="emerald">ACTIVE</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
`);

// Update AppRoutes.tsx
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
        
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/audit" element={<AuditLogsPage />} />
        <Route path="/admin/settings" element={<TenantSettingsPage />} />

        {/* Mapped in Phase 4 */}
        <Route path="/support/*" element={<ExecutiveDashboardPage />} />
        <Route path="/analytics/*" element={<ExecutiveDashboardPage />} />
        <Route path="/documents/*" element={<ExecutiveDashboardPage />} />
        <Route path="/workflows/*" element={<ExecutiveDashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
`);

console.log("Phase 3 Frontend scaffolding completed.");
