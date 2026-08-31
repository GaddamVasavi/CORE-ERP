import React from 'react';
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
