import React from 'react';
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
