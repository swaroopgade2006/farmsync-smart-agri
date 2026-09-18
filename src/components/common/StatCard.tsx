import React from 'react';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'emerald' | 'blue' | 'amber' | 'purple' | 'rose';
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'emerald',
  trend,
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      ring: 'group-hover:ring-emerald-200',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-100',
      ring: 'group-hover:ring-blue-200',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      ring: 'group-hover:ring-amber-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-100',
      ring: 'group-hover:ring-purple-200',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-100',
      ring: 'group-hover:ring-rose-200',
    },
  };

  const scheme = colorMap[color];

  return (
    <Card hover className="p-5 relative group transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2 space-x-1 text-xs font-medium">
              <span className={trend.positive ? 'text-emerald-600' : 'text-rose-600'}>
                {trend.positive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-2xl ${scheme.bg} ${scheme.text} ${scheme.border} border shadow-sm transition-transform group-hover:scale-105`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};
