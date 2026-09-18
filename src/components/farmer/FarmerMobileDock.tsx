import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sprout, 
  Stethoscope, 
  Package, 
  Activity,
  HeartHandshake
} from 'lucide-react';

export const FarmerMobileDock: React.FC = () => {
  const location = useLocation();

  const dockItems = [
    { name: 'Dashboard', path: '/farmer', icon: LayoutDashboard },
    { name: 'My Crops', path: '/farmer/crops', icon: Sprout },
    { name: 'Doctor AI', path: '/farmer/doctor', icon: Stethoscope },
    { name: 'Orders', path: '/farmer/orders', icon: Package },
    { name: 'Soil NPK', path: '/farmer/soil-health', icon: Activity },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-100 py-2 px-2 shadow-[0_-4px_20px_rgba(16,185,129,0.08)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {dockItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
