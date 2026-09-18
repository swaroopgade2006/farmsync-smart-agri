import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Zap, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Thermometer, 
  Bike, 
  QrCode,
  AlertCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const CartDrawer: React.FC = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    deliveryFee, 
    grandTotal, 
    itemCount, 
    totalWeightKg, 
    isFreeDelivery,
    freeDeliveryThreshold,
    amountUntilFreeDelivery,
    checkoutCart
  } = useCart();
  
  const { buyerProfile, currentUser } = useAuth();
  const { darkStores, getNearestDarkStore } = useData();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(
    buyerProfile?.deliveryAddress || 'Flat 402, Green Meadows, Benz Circle, Vijayawada'
  );
  const [customerPhone, setCustomerPhone] = useState(
    currentUser?.phone || '+91 98480 88221'
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const userCity = buyerProfile?.operatingCity || currentUser?.operatingLocation || 'Vijayawada';
  const nearestStore = getNearestDarkStore(userCity) || darkStores[0];

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!deliveryAddress.trim()) {
      setOrderError('Please provide a delivery doorstep address.');
      return;
    }

    try {
      setIsCheckingOut(true);
      setOrderError(null);
      await checkoutCart({
        deliveryLocation: deliveryAddress,
        buyerPhone: customerPhone
      });
      setIsCheckingOut(false);
      navigate('/buyer/orders');
    } catch (err: any) {
      setIsCheckingOut(false);
      setOrderError(err?.message || 'Failed to place express order. Please try again.');
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-slide-in-right">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    QuickMart Express Cart
                    <span className="text-[10px] font-black bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                      {itemCount} {itemCount === 1 ? 'Pack' : 'Packs'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-200/80">
                    Total Cargo: <strong className="text-white">{totalWeightKg} kg</strong> Fresh Produce
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                title="Close Cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dark Store Hub Route Pill */}
            {nearestStore && (
              <div className="mt-3 p-2 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5 truncate">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate text-slate-200">
                    Dispatched from: <strong className="text-white">{nearestStore.name}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-black bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded-md shrink-0">
                  ⚡ ~{nearestStore.estimatedDeliveryMinutes || 15}m ETA
                </span>
              </div>
            )}
          </div>

          {/* Free Delivery Threshold Bar */}
          <div className="p-3 bg-emerald-50/80 border-b border-emerald-100 text-xs">
            {isFreeDelivery ? (
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>🎉 You unlocked <strong>FREE 15-Minute Delivery</strong>! (Saved ₹10)</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-700 text-[11px]">
                  <span>Add <strong className="text-emerald-700">₹{amountUntilFreeDelivery}</strong> more for FREE Delivery!</span>
                  <span className="text-slate-400 font-mono">₹{subtotal}/₹{freeDeliveryThreshold}</span>
                </div>
                <div className="w-full bg-emerald-200/60 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-slate-700">Your basket is currently empty.</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Add fresh farm tomatoes, potatoes, onions, or greens for instant 15-minute delivery!
                </p>
                <Button
                  variant="harvest"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                  className="font-bold text-slate-900 mt-2"
                >
                  Browse Fresh Produce
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 group">
                  
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center space-x-3 min-w-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.cropName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold shrink-0 text-xs">
                        🌱
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {item.cropName}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.packSizeKg} kg Pack • ₹{item.pricePerKg}/kg
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                          {item.batchId}
                        </span>
                        <span className="text-[9px] text-slate-400 truncate">
                          • {item.farmerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper & Price */}
                  <div className="flex flex-col items-end space-y-1.5 shrink-0">
                    <span className="text-xs font-black text-slate-900">
                      ₹{item.itemTotal.toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-2xs transition-colors"
                        title="Reduce quantity"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3 h-3 text-rose-500" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </button>

                      <span className="w-6 text-center text-xs font-black text-slate-900">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-2xs transition-colors"
                        title="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              
              {/* Delivery Address Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  Delivery Destination
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter house/flat number, street, area..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
              </div>

              {/* Bill Details */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Produce Subtotal ({itemCount} packs)</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Bike className="w-3 h-3 text-emerald-600" />
                    Express 15m Delivery
                  </span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-700">
                      <span className="line-through text-slate-400 mr-1">₹10</span> FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-900">₹10</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Insulated Cold-Pack Bag</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-base text-emerald-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {orderError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{orderError}</span>
                </div>
              )}

              {/* Place Order CTA */}
              <Button
                type="button"
                variant="harvest"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-between"
              >
                <div className="text-left">
                  <span className="text-[10px] text-emerald-100 font-bold uppercase block leading-none">
                    ⚡ 15-Minute Home Delivery
                  </span>
                  <span className="text-sm font-black text-white">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-black">
                  <span>{isCheckingOut ? 'Dispatching...' : 'Place Multi-Item Order'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>

              <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Freshness Guaranteed • Direct from Verified Local Farms
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
