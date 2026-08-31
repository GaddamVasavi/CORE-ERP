import React from 'react';
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
