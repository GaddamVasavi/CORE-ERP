import { create } from 'zustand';
import { UserProfile, LoginResponse, TenantInfo } from '../types/auth';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  tenant: TenantInfo | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
  setLoginData: (data: LoginResponse) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserProfile) => void;
  setTenant: (tenant: TenantInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token'),
  tenantId: localStorage.getItem('tenant_id'),
  tenant: null,
  roles: JSON.parse(localStorage.getItem('user_roles') || '[]'),
  permissions: JSON.parse(localStorage.getItem('user_permissions') || '[]'),
  isAuthenticated: !!localStorage.getItem('access_token'),

  setLoginData: (data) => {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    localStorage.setItem('tenant_id', data.tenantId);
    localStorage.setItem('user_roles', JSON.stringify(data.roles));
    localStorage.setItem('user_permissions', JSON.stringify(data.permissions));

    set({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      tenantId: data.tenantId,
      roles: data.roles,
      permissions: data.permissions,
      isAuthenticated: true,
    });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    set({ accessToken, refreshToken });
  },

  setUser: (user) => set({ user }),
  setTenant: (tenant) => set({ tenant }),

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('tenant_id');
    localStorage.removeItem('user_roles');
    localStorage.removeItem('user_permissions');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      tenantId: null,
      tenant: null,
      roles: [],
      permissions: [],
      isAuthenticated: false,
    });
  },
}));
