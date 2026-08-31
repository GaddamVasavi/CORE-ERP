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

console.log("Generating Phase 2 Frontend Codebase...");

// Finance Overview Page
writeFile('frontend/src/pages/finance/FinanceOverviewPage.tsx', `import React from 'react';
import { DollarSign, FileText, ArrowUpRight, ArrowDownRight, CreditCard, PieChart } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const FinanceOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Finance & Accounting</h2>
          <p className="text-xs text-slate-500 mt-0.5">General Ledger, Accounts Payable, Accounts Receivable, and Treasury.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Balance Sheet</Button>
          <Button size="sm">New Journal Entry</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Cash on Hand" value="$1,420,500" change="4.5%" isPositive icon={DollarSign} color="emerald" />
        <StatCard title="Accounts Receivable (AR)" value="$480,200" change="12.1%" isPositive={false} icon={ArrowUpRight} color="blue" />
        <StatCard title="Accounts Payable (AP)" value="$290,150" change="3.8%" isPositive icon={ArrowDownRight} color="amber" />
        <StatCard title="Net Monthly Margin" value="28.4%" change="1.2%" isPositive icon={PieChart} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Invoices" subtitle="Incoming and outgoing bills">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-blue-600">INV-2026-0089</td>
                  <td className="py-2.5 px-3">Acme Enterprise Corp</td>
                  <td className="py-2.5 px-3 font-medium">$45,000.00</td>
                  <td className="py-2.5 px-3"><Badge variant="emerald">PAID</Badge></td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-blue-600">INV-2026-0090</td>
                  <td className="py-2.5 px-3">Global Tech Systems</td>
                  <td className="py-2.5 px-3 font-medium">$12,850.00</td>
                  <td className="py-2.5 px-3"><Badge variant="amber">PENDING</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="General Ledger Status" subtitle="Chart of accounts balance summary">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-slate-900">1000 - Current Assets</p>
                <p className="text-[11px] text-slate-500">Operating Bank Accounts & Petty Cash</p>
              </div>
              <span className="text-sm font-bold text-slate-900">$1,420,500.00</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-slate-900">2000 - Current Liabilities</p>
                <p className="text-[11px] text-slate-500">Accounts Payable & Accrued Expenses</p>
              </div>
              <span className="text-sm font-bold text-slate-900">$290,150.00</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs font-semibold text-slate-900">4000 - Operating Revenue</p>
                <p className="text-[11px] text-slate-500">Product Sales & Enterprise Licensing</p>
              </div>
              <span className="text-sm font-bold text-emerald-600">$3,600,000.00</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
`);

// Sales & CRM Page
writeFile('frontend/src/pages/sales/SalesOverviewPage.tsx', `import React from 'react';
import { ShoppingCart, Users, Target, TrendingUp, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const SalesOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sales & CRM</h2>
          <p className="text-xs text-slate-500 mt-0.5">Leads, Opportunities Pipeline, Customer 360, and Sales Orders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">New Lead</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Create Sales Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pipeline Value" value="$2,450,000" change="18.5%" isPositive icon={Target} color="blue" />
        <StatCard title="Open Sales Orders" value="48" change="6 new" isPositive icon={ShoppingCart} color="emerald" />
        <StatCard title="Active Customers" value="312" change="14" isPositive icon={Users} color="purple" />
        <StatCard title="Win Rate" value="64.2%" change="3.1%" isPositive icon={TrendingUp} color="amber" />
      </div>

      <Card title="Active Sales Orders" subtitle="Recent customer purchase commitments">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-blue-600">SO-2026-0412</td>
                <td className="py-3 px-4 font-medium text-slate-900">Apex Industrial Solutions</td>
                <td className="py-3 px-4 text-slate-500">2026-08-28</td>
                <td className="py-3 px-4 font-bold text-slate-900">$84,000.00</td>
                <td className="py-3 px-4"><Badge variant="blue">PROCESSING</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">View</Button></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-blue-600">SO-2026-0413</td>
                <td className="py-3 px-4 font-medium text-slate-900">Nexus Robotics Inc</td>
                <td className="py-3 px-4 text-slate-500">2026-08-30</td>
                <td className="py-3 px-4 font-bold text-slate-900">$126,500.00</td>
                <td className="py-3 px-4"><Badge variant="emerald">CONFIRMED</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">View</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
`);

// Procurement Page
writeFile('frontend/src/pages/procurement/ProcurementOverviewPage.tsx', `import React from 'react';
import { Building2, ShoppingBag, Truck, CheckCircle2, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProcurementOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Procurement & Sourcing</h2>
          <p className="text-xs text-slate-500 mt-0.5">Procure-to-Pay (P2P), Suppliers, Purchase Requisitions, and Goods Receipts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">New RFQ</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Create Purchase Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Suppliers" value="84" change="2 new" isPositive icon={Building2} color="blue" />
        <StatCard title="Pending PO Value" value="$640,000" change="8.4%" isPositive icon={ShoppingBag} color="amber" />
        <StatCard title="Pending Receipts (GRN)" value="12" change="3 today" isPositive icon={Truck} color="purple" />
        <StatCard title="On-Time Delivery Rate" value="96.5%" change="1.4%" isPositive icon={CheckCircle2} color="emerald" />
      </div>

      <Card title="Purchase Orders" subtitle="Approved and in-transit procurement orders">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PO #</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-blue-600">PO-2026-0810</td>
                <td className="py-3 px-4 font-medium text-slate-900">Titan Microelectronics</td>
                <td className="py-3 px-4 text-slate-500">2026-08-25</td>
                <td className="py-3 px-4 font-bold text-slate-900">$52,400.00</td>
                <td className="py-3 px-4"><Badge variant="blue">APPROVED</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Receive</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
`);

// Inventory Page
writeFile('frontend/src/pages/inventory/InventoryOverviewPage.tsx', `import React from 'react';
import { Package, Warehouse, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const InventoryOverviewPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory & Warehouse Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time stock valuation, multi-warehouse bin tracking, and transfers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Stock Transfer</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Add Product</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total SKU Count" value="1,840" change="25 new" isPositive icon={Package} color="blue" />
        <StatCard title="Warehouses" value="6 Active" change="100% cap" isPositive icon={Warehouse} color="purple" />
        <StatCard title="Low Stock Alerts" value="8 SKUs" change="Needs action" isPositive={false} icon={AlertCircle} color="rose" />
        <StatCard title="Stock Turnover Ratio" value="6.8x" change="0.4x" isPositive icon={RefreshCw} color="emerald" />
      </div>

      <Card title="Product Inventory Ledger" subtitle="Stock on hand and reserved quantities across locations">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">On Hand</th>
                <th className="py-3 px-4">Available</th>
                <th className="py-3 px-4">Unit Cost</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-slate-900">SKU-SRV-901</td>
                <td className="py-3 px-4 font-medium text-slate-900">Rack Server Node Gen 4</td>
                <td className="py-3 px-4">Hardware</td>
                <td className="py-3 px-4 font-bold text-slate-900">120</td>
                <td className="py-3 px-4 text-emerald-600 font-semibold">95</td>
                <td className="py-3 px-4">$1,850.00</td>
                <td className="py-3 px-4"><Badge variant="emerald">IN STOCK</Badge></td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-semibold text-slate-900">SKU-MEM-128</td>
                <td className="py-3 px-4 font-medium text-slate-900">128GB DDR5 ECC RAM</td>
                <td className="py-3 px-4">Components</td>
                <td className="py-3 px-4 font-bold text-rose-600">8</td>
                <td className="py-3 px-4 text-rose-600 font-semibold">2</td>
                <td className="py-3 px-4">$420.00</td>
                <td className="py-3 px-4"><Badge variant="rose">LOW STOCK</Badge></td>
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
        
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/audit" element={<AuditLogsPage />} />
        <Route path="/admin/settings" element={<TenantSettingsPage />} />

        {/* Mapped in Phase 3 & 4 */}
        <Route path="/manufacturing/*" element={<ExecutiveDashboardPage />} />
        <Route path="/hr/*" element={<ExecutiveDashboardPage />} />
        <Route path="/projects/*" element={<ExecutiveDashboardPage />} />
        <Route path="/assets/*" element={<ExecutiveDashboardPage />} />
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

console.log("Phase 2 Frontend scaffolding completed.");
