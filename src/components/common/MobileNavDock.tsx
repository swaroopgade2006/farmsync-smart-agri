import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  LayoutDashboard, 
  Sprout, 
  Sparkles, 
  ShoppingBag, 
  Package, 
  Truck, 
  TrendingUp, 
  ShieldCheck, 
  User,
  HeartHandshake
} from 'lucide-react';

export const MobileNavDock: React.FC = () => {
  const { currentUser, currentRole } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (!currentUser) return null;

  const getDockItems = () => {
    switch (currentRole) {
      case 'farmer':
        return [
          { name: t('dock.dashboard', 'Dashboard'), path: '/farmer', icon: LayoutDashboard },
          { name: t('dock.myCrops', 'My Crops'), path: '/farmer/crops', icon: Sprout },
          { name: t('dock.aiMatches', 'AI Matches'), path: '/farmer/matches', icon: Sparkles },
          { name: t('dock.orders', 'Orders'), path: '/farmer/orders', icon: Package },
          { name: t('dock.support', 'Support'), path: '/farmer/support', icon: HeartHandshake },
        ];
      case 'buyer':
        return [
          { name: t('dock.market', 'Market'), path: '/buyer/marketplace', icon: ShoppingBag },
          { name: t('dock.aiMatches', 'Matches'), path: '/buyer/ai-recommendations', icon: Sparkles },
          { name: t('dock.orders', 'Orders'), path: '/buyer/orders', icon: Package },
          { name: t('dock.analytics', 'Analytics'), path: '/buyer/demand-analytics', icon: TrendingUp },
          { name: t('dock.profile', 'Profile'), path: '/buyer/profile', icon: User },
        ];
      case 'investor':
        return [
          { name: t('dock.dashboard', 'Dashboard'), path: '/sponsor', icon: LayoutDashboard },
          { name: t('dock.myCrops', 'Projects'), path: '/sponsor/projects', icon: Sprout },
          { name: t('dock.analytics', 'Agreements'), path: '/sponsor/agreements', icon: TrendingUp },
          { name: t('dock.support', 'Grants'), path: '/sponsor/support-records', icon: HeartHandshake },
        ];
      case 'logistics':
        return [
          { name: t('dock.dashboard', 'Dashboard'), path: '/logistics', icon: LayoutDashboard },
          { name: t('dock.deliveries', 'Deliveries'), path: '/logistics/deliveries', icon: Truck },
          { name: t('dock.radar', 'Live Tracking'), path: '/logistics/tracking', icon: Package },
          { name: t('dock.profile', 'Profile'), path: '/logistics/profile', icon: User },
        ];
      case 'admin':
        return [
          { name: t('dock.dashboard', 'Overview'), path: '/admin', icon: LayoutDashboard },
          { name: t('dock.profile', 'Verifications'), path: '/admin/verifications', icon: ShieldCheck },
          { name: t('dock.myCrops', 'Crops'), path: '/admin/crops', icon: Sprout },
          { name: t('dock.orders', 'Orders'), path: '/admin/orders', icon: Package },
          { name: t('dock.analytics', 'Analytics'), path: '/admin/analytics', icon: TrendingUp },
        ];
      default:
        return [];
    }
  };

  const items = getDockItems();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
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
                  isActive ? 'bg-emerald-100/80 text-emerald-700' : 'bg-transparent'
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
