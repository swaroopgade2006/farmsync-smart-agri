import React from 'react';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { cartItems, setIsCartOpen, itemCount, totalWeightKg, grandTotal, isFreeDelivery } = useCart();
  const { darkStores, getNearestDarkStore } = useData();
  const { buyerProfile, currentUser } = useAuth();

  if (cartItems.length === 0) return null;

  const userCity = buyerProfile?.operatingCity || currentUser?.operatingLocation || 'Vijayawada';
  const nearestStore = getNearestDarkStore(userCity) || darkStores[0];

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl animate-slide-up">
      <div 
        onClick={() => setIsCartOpen(true)}
        className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-emerald-400/40 backdrop-blur-md flex items-center justify-between gap-3 cursor-pointer hover:scale-[1.02] transition-all group"
      >
        {/* Left Info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white">
                {itemCount} {itemCount === 1 ? 'Item' : 'Items'} ({totalWeightKg} kg)
              </span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-200/80 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>{nearestStore.locality} Hub</span>
              <span>•</span>
              <span className="text-white font-semibold">15m Delivery</span>
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md group-hover:pr-3 transition-all"
          >
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
