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

console.log("Generating Phase 1 Frontend Codebase...");

// CSS & Base Styles
writeFile('frontend/src/index.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 40% 98%;
    --foreground: 222.2 84% 4.9%;
  }

  body {
    @apply bg-slate-50 text-slate-900 min-h-screen font-sans;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
`);

// Types
writeFile('frontend/src/types/common.ts', `export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details: string;
    fieldErrors?: Record<string, string>;
  };
  timestamp: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
`);

writeFile('frontend/src/types/auth.ts', `export interface UserProfile {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  departmentId?: string;
  departmentName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'SUSPENDED';
  isSuperAdmin: boolean;
  isEmailVerified: boolean;
  roles: string[];
  permissions?: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  tenantId: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  requiresMfa: boolean;
}

export interface TenantInfo {
  id: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  subscriptionPlan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'UNLIMITED';
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'EXPIRED' | 'CANCELLED';
  currency: string;
  fiscalYearStartMonth: number;
  timeZone: string;
  taxIdentifier?: string;
  createdAt: string;
}
`);

writeFile('frontend/src/types/audit.ts', `export interface AuditLog {
  id: string;
  tenantId?: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entityName: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  oldState?: string;
  newState?: string;
  details?: string;
  status: string;
  createdAt: string;
}
`);

// API Client
writeFile('frontend/src/api/client.ts', `import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  const tenantId = useAuthStore.getState().tenantId;

  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const res = await axios.post('/api/v1/auth/refresh', { refreshToken });
          if (res.data.success) {
            useAuthStore.getState().setTokens(res.data.data.accessToken, res.data.data.refreshToken);
            originalRequest.headers.Authorization = \`Bearer \${res.data.data.accessToken}\`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          useAuthStore.getState().logout();
        }
      } else {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
`);

// Auth Store
writeFile('frontend/src/store/authStore.ts', `import { create } from 'zustand';
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
`);

// UI Components
writeFile('frontend/src/components/ui/Button.tsx', `import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm shadow-blue-500/20',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-400',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm shadow-rose-500/20',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm shadow-emerald-500/20',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!isLoading && icon}
      {children}
    </button>
  );
};
`);

writeFile('frontend/src/components/ui/Input.tsx', `import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={twMerge(
              clsx(
                'block w-full rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500',
                icon ? 'pl-10' : 'pl-3.5',
                'pr-3.5 py-2',
                error
                  ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20 bg-white',
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
`);

writeFile('frontend/src/components/ui/Card.tsx', `import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, action, children, className, ...props }) => {
  return (
    <div className={twMerge(clsx('bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden', className))} {...props}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
`);

writeFile('frontend/src/components/ui/Badge.tsx', `import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'slate' | 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'slate', size = 'sm', className, ...props }) => {
  const variantStyles = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-medium rounded-full border',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
`);

writeFile('frontend/src/components/ui/StatCard.tsx', `import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  color = 'blue',
  className,
}) => {
  const iconBgStyles = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className={twMerge(clsx('bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start justify-between', className))}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1.5">{value}</p>
        {change && (
          <div className="flex items-center gap-1 mt-2">
            <span className={clsx('text-xs font-semibold', isPositive ? 'text-emerald-600' : 'text-rose-600')}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        )}
      </div>
      <div className={clsx('p-3 rounded-lg', iconBgStyles[color])}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
`);

// Layout Navigation
writeFile('frontend/src/components/layout/Sidebar.tsx', `import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  ShoppingCart,
  Package,
  Factory,
  Users,
  Briefcase,
  Layers,
  HelpCircle,
  BarChart3,
  FileText,
  Workflow,
  ShieldAlert,
  Building2,
} from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navSections: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [
      { name: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Core Business',
    items: [
      { name: 'Finance & Accounting', path: '/finance', icon: DollarSign },
      { name: 'Sales & CRM', path: '/sales', icon: ShoppingCart },
      { name: 'Procurement', path: '/procurement', icon: Building2 },
      { name: 'Inventory & WMS', path: '/inventory', icon: Package },
      { name: 'Manufacturing', path: '/manufacturing', icon: Factory },
    ],
  },
  {
    section: 'People & Operations',
    items: [
      { name: 'HR & Payroll', path: '/hr', icon: Users },
      { name: 'Projects', path: '/projects', icon: Briefcase },
      { name: 'Asset Management', path: '/assets', icon: Layers },
      { name: 'Customer Support', path: '/support', icon: HelpCircle },
    ],
  },
  {
    section: 'Platform & Intelligence',
    items: [
      { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
      { name: 'Documents', path: '/documents', icon: FileText },
      { name: 'Workflows', path: '/workflows', icon: Workflow },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Audit Logs', path: '/admin/audit', icon: ShieldAlert },
    ],
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
          C
        </div>
        <div>
          <h1 className="font-bold text-white tracking-wide text-base leading-none">CoreERP</h1>
          <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase mt-0.5">Enterprise SaaS</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
              {section.section}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all',
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    )
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Tenant Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Tenant: </span>
          <span className="font-semibold text-slate-200 truncate">CoreERP HQ</span>
        </div>
      </div>
    </aside>
  );
};
`);

writeFile('frontend/src/components/layout/Navbar.tsx', `import React from 'react';
import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search ERP modules, records, invoices..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-semibold text-sm flex items-center justify-center">
            {user?.firstName?.[0] || 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900">{user?.fullName || 'Enterprise Admin'}</p>
            <p className="text-[11px] text-slate-500">{user?.email || 'admin@coreerp.com'}</p>
          </div>
          <button
            onClick={() => logout()}
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
`);

writeFile('frontend/src/components/layout/AppLayout.tsx', `import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
`);

// Auth & Dashboard Pages
writeFile('frontend/src/pages/auth/LoginPage.tsx', `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setLoginData = useAuthStore((state) => state.setLoginData);
  const [email, setEmail] = useState('admin@coreerp.com');
  const [password, setPassword] = useState('Admin@CoreERP2026!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.success) {
        setLoginData(response.data.data);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 mx-auto flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/30 mb-3">
            C
          </div>
          <h2 className="text-2xl font-bold text-slate-900">CoreERP Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">One Platform. Every Business Process. One Source of Truth.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />
          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Sign In to Enterprise Workspace
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Need a new workspace?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register Tenant
          </Link>
        </div>
      </div>
    </div>
  );
};
`);

writeFile('frontend/src/pages/auth/RegisterPage.tsx', `import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiClient } from '../../api/client';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    subdomain: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/auth/register', formData);
      if (res.data.success) {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Create Tenant Workspace</h2>
          <p className="text-xs text-slate-500 mt-1">Deploy your isolated multi-tenant ERP environment</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
            <Input
              label="Subdomain (.coreerp.com)"
              value={formData.subdomain}
              onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>
          <Input
            label="Work Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-full mt-3" isLoading={isLoading}>
            Create Enterprise Tenant
          </Button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
`);

writeFile('frontend/src/pages/dashboard/ExecutiveDashboardPage.tsx', `import React from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 450000, expenses: 320000 },
  { month: 'Feb', revenue: 520000, expenses: 340000 },
  { month: 'Mar', revenue: 610000, expenses: 390000 },
  { month: 'Apr', revenue: 590000, expenses: 370000 },
  { month: 'May', revenue: 680000, expenses: 410000 },
  { month: 'Jun', revenue: 750000, expenses: 430000 },
];

const salesByModule = [
  { name: 'Enterprise SaaS', sales: 380000 },
  { name: 'Hardware & Equip', sales: 220000 },
  { name: 'Consulting Services', sales: 150000 },
];

export const ExecutiveDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Executive Dashboard</h2>
        <p className="text-xs text-slate-500 mt-0.5">Real-time enterprise performance metrics and unified operations.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue (YTD)" value="$3,600,000" change="14.2%" isPositive icon={DollarSign} color="emerald" />
        <StatCard title="Net Operating Profit" value="$1,340,000" change="8.7%" isPositive icon={TrendingUp} color="blue" />
        <StatCard title="Active Employees" value="142" change="5 new" isPositive icon={Users} color="purple" />
        <StatCard title="Inventory Valuation" value="$845,200" change="2.1%" isPositive={false} icon={Package} color="amber" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Revenue vs Expenses Trend" subtitle="Monthly financial flow comparison" className="lg:col-span-2">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => \`$\${v / 1000}k\`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={0} strokeWidth={2} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue by Business Line" subtitle="Quarterly distribution">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByModule} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => \`$\${v / 1000}k\`} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                <Tooltip />
                <Bar dataKey="sales" fill="#0284c7" radius={[0, 4, 4, 0]} name="Sales ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
`);

writeFile('frontend/src/pages/admin/UserManagementPage.tsx', `import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, UserPlus } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage enterprise tenant users, roles, and granular authorization.</p>
        </div>
        <Button icon={<UserPlus className="w-4 h-4" />}>Add User</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">
                  Enterprise Administrator
                  <div className="text-[11px] text-slate-400 font-normal">admin@coreerp.com</div>
                </td>
                <td className="py-3 px-4"><Badge variant="purple">SUPER_ADMIN</Badge></td>
                <td className="py-3 px-4">Executive Office</td>
                <td className="py-3 px-4"><Badge variant="emerald">ACTIVE</Badge></td>
                <td className="py-3 px-4 text-right"><Button variant="ghost" size="sm">Edit</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
`);

writeFile('frontend/src/pages/admin/AuditLogsPage.tsx', `import React from 'react';
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
`);

writeFile('frontend/src/pages/admin/TenantSettingsPage.tsx', `import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const TenantSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Tenant Configuration</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage fiscal calendar, base currency, and company profile.</p>
      </div>

      <Card title="General Organization Profile">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tenant Name" defaultValue="CoreERP Global HQ" />
            <Input label="Subdomain" defaultValue="hq.coreerp.com" disabled />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Base Currency" defaultValue="USD" />
            <Input label="Fiscal Year Start Month" defaultValue="January (1)" />
          </div>
          <Button type="button">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
};
`);

// App Router & Entry
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
`);

writeFile('frontend/src/App.tsx', `import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
`);

writeFile('frontend/src/main.tsx', `import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

console.log("Phase 1 Frontend scaffolding completed.");
