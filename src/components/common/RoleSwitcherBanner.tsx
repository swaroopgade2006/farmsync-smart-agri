import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { UserCheck, Shield, ShoppingCart, TrendingUp, Truck, Sparkles } from 'lucide-react';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentUser, switchRole } = useAuth();

  const personas: { role: UserRole; name: string; icon: any; color: string; label: string }[] = [
    { role: 'farmer', name: 'Ravi Kumar', icon: UserCheck, color: 'bg-emerald-600', label: 'Farmer' },
    { role: 'buyer', name: 'FreshMart', icon: ShoppingCart, color: 'bg-blue-600', label: 'Buyer' },
    { role: 'investor', name: 'AgriFund', icon: TrendingUp, color: 'bg-amber-600', label: 'Sponsor/Investor' },
    { role: 'logistics', name: 'SwiftAgri', icon: Truck, color: 'bg-indigo-600', label: 'Logistics' },
    { role: 'admin', name: 'Admin', icon: Shield, color: 'bg-rose-600', label: 'Admin' },
  ];

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 shadow-md sticky top-0 z-50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex items-center text-amber-400 font-semibold uppercase tracking-wider text-[10px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
            <Sparkles className="w-3 h-3 mr-1" /> SIH 2026 Interactive Demo
          </span>
          <span className="text-slate-400 hidden sm:inline">Active Persona:</span>
          <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {currentUser?.fullName} ({currentUser?.role?.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center space-x-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Quick Role Switch:</span>
          {personas.map((p) => {
            const isActive = currentUser?.role === p.role;
            const Icon = p.icon;
            return (
              <button
                key={p.role}
                onClick={() => switchRole(p.role)}
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  isActive
                    ? `${p.color} text-white ring-2 ring-white/30 shadow-sm font-semibold`
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
                title={`Switch to ${p.name} (${p.label})`}
              >
                <Icon className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">{p.name}</span>
                <span className="sm:hidden">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
