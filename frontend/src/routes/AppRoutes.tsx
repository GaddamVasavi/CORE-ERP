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
