import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sprout, 
  ShoppingBag, 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Layers
} from 'lucide-react';
import { Badge } from './Badge';

interface AppSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSwitcherModal: React.FC<AppSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, switchRole } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLaunchApp = (role: 'farmer' | 'buyer' | 'investor' | 'logistics' | 'admin', targetPath: string) => {
    switchRole(role);
    navigate(targetPath);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
            <Layers className="w-3.5 h-3.5" />
            Dual-App Multi-Portal Switcher
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Choose Your Application
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Select between the dedicated Farmer App, Buyer & QuickMart App, or specialized institutional portals.
          </p>
        </div>

        {/* The 2 Primary Distinct Apps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          
          {/* 1. Farmer App Card */}
          <div 
            onClick={() => handleLaunchApp('farmer', '/farmer')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group relative ${
              currentRole === 'farmer' 
                ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20' 
                : 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30'
            }`}
          >
            {currentRole === 'farmer' && (
              <div className="absolute top-3 right-3">
                <Badge variant="emerald" size="sm">Active App</Badge>
              </div>
            )}
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 mb-3 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  🌾 KisanSetu App
                </h3>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Farmer Suite
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Dedicated for farmers & cultivators. Crop health doctor, soil NPK dosage, agro-weather, crop listings, and fair-trade bank payouts.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Demo: Ravi Kumar
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Buyer App Card */}
          <div 
            onClick={() => handleLaunchApp('buyer', '/buyer/marketplace')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group relative ${
              currentRole === 'buyer' 
                ? 'border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-500/20' 
                : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50/30'
            }`}
          >
            {currentRole === 'buyer' && (
              <div className="absolute top-3 right-3">
                <Badge variant="blue" size="sm">Active App</Badge>
              </div>
            )}
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 mb-3 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                  🛒 FarmSync Market
                </h3>
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> 15m QuickMart
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Dedicated for home consumers & wholesale buyers. 15-min Hyperlocal Dark Stores, mandi wholesale lots, digital traceability, and escrow checkout.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-blue-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Demo: FreshMart Supermarkets
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Secondary Specialized Portals */}
        <div className="border-t border-slate-100 pt-4">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Institutional Ecosystem Portals:
          </span>
          <div className="grid grid-cols-3 gap-2">
            
            <button
              onClick={() => handleLaunchApp('investor', '/sponsor/projects')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-amber-600 text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Sponsor / CSR</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Grants & Funding</span>
            </button>

            <button
              onClick={() => handleLaunchApp('logistics', '/logistics/deliveries')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-indigo-600 text-xs font-bold">
                <Truck className="w-3.5 h-3.5" />
                <span>Logistics</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Cold Chain & Radar</span>
            </button>

            <button
              onClick={() => handleLaunchApp('admin', '/admin')}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 text-purple-600 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Hub</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Verification & APMC</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
