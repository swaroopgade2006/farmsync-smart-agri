import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Zap, 
  Sparkles, 
  Package, 
  User,
  ShoppingCart
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const BuyerMobileDock: React.FC = () => {
  const location = useLocation();
  const { setIsCartOpen, itemCount } = useCart();

  const dockItems = [
    { name: 'Market', path: '/buyer/marketplace', icon: ShoppingBag },
    { name: '15m Stores', path: '/buyer/dark-stores', icon: Zap },
    { name: 'Orders', path: '/buyer/orders', icon: Package },
    { name: 'Profile', path: '/buyer/profile', icon: User },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-2 shadow-[0_-4px_20px_rgba(59,130,246,0.08)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link
          to="/buyer/marketplace"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            location.pathname === '/buyer/marketplace'
              ? 'text-blue-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            location.pathname === '/buyer/marketplace' ? 'bg-blue-100 text-blue-800' : 'bg-transparent'
          }`}>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Market</span>
        </Link>

        <Link
          to="/buyer/dark-stores"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            location.pathname === '/buyer/dark-stores'
              ? 'text-emerald-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            location.pathname === '/buyer/dark-stores' ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'
          }`}>
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">15m Hubs</span>
        </Link>

        {/* Center Cart Trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all text-emerald-700 hover:text-emerald-900 font-bold relative"
        >
          <div className="p-1.5 rounded-xl bg-emerald-500 text-slate-950 shadow-md relative">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-black text-emerald-800">Cart</span>
        </button>

        <Link
          to="/buyer/orders"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            location.pathname === '/buyer/orders'
              ? 'text-blue-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            location.pathname === '/buyer/orders' ? 'bg-blue-100 text-blue-800' : 'bg-transparent'
          }`}>
            <Package className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Orders</span>
        </Link>

        <Link
          to="/buyer/profile"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            location.pathname === '/buyer/profile'
              ? 'text-blue-700 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-colors ${
            location.pathname === '/buyer/profile' ? 'bg-blue-100 text-blue-800' : 'bg-transparent'
          }`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
        </Link>
      </div>
    </div>
  );
};
