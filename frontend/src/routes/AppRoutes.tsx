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

export const AppRoutes: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" replace />} />

      {/* Protected ERP Shell */}
      <Route element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<ExecutiveDashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/audit" element={<AuditLogsPage />} />
        <Route path="/admin/settings" element={<TenantSettingsPage />} />
        
        {/* Module Placeholders mapped in later phases */}
        <Route path="/finance/*" element={<ExecutiveDashboardPage />} />
        <Route path="/sales/*" element={<ExecutiveDashboardPage />} />
        <Route path="/procurement/*" element={<ExecutiveDashboardPage />} />
        <Route path="/inventory/*" element={<ExecutiveDashboardPage />} />
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
