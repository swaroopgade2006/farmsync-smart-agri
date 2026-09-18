import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Crop, DarkStore } from '../../types';
import { 
  Zap, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  CheckCircle2, 
  Thermometer, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Sparkles, 
  Building2, 
  Bike,
  Plus,
  Minus
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface HomeQuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: Crop | null;
  darkStore: DarkStore;
  userAddress: string;
  onSuccessOrder: () => void;
  onOpenStoreSelector?: () => void;
}

export const HomeQuickOrderModal: React.FC<HomeQuickOrderModalProps> = ({
  isOpen,
  onClose,
  crop,
  darkStore,
  userAddress,
  onSuccessOrder,
  onOpenStoreSelector
}) => {
  const { currentUser, buyerProfile } = useAuth();
  const { createDarkStoreExpressOrder } = useData();

  const [selectedPackSizeKg, setSelectedPackSizeKg] = useState<number>(1);
  const [deliveryAddress, setDeliveryAddress] = useState(userAddress || buyerProfile?.deliveryAddress || 'Flat 402, Green Meadows, Benz Circle, Vijayawada');
  const [deliveryNotes, setDeliveryNotes] = useState('Please leave at doorstep if unavailable');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!crop) return null;

  // Find store item if available in inventory
  const inventoryItem = darkStore.inventory.find(i => i.cropId === crop.id);
  const packSizes = inventoryItem?.packSizesAvailableKg || [0.5, 1, 2, 5];
  const unitPrice = inventoryItem?.pricePerKg || crop.pricePerKg || 32;
  const itemTotal = Math.round(selectedPackSizeKg * unitPrice);
  const deliveryFee = itemTotal >= 99 ? 0 : 10; // Max ₹10 delivery charges, FREE on orders ₹99+
  const finalTotal = itemTotal + deliveryFee;

  const handlePlaceExpressOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createDarkStoreExpressOrder({
        buyerId: buyerProfile?.id || currentUser?.id || 'buyer_freshmart',
        buyerName: currentUser?.fullName || 'Home Consumer',
        buyerBusinessName: 'Home Delivery (Express)',
        buyerPhone: currentUser?.phone || '+91 99887 76655',
        darkStoreId: darkStore.id,
        cropId: crop.id,
        cropName: crop.cropName,
        cropVariety: crop.cropVariety,
        packSizeKg: selectedPackSizeKg,
        unitPrice,
        deliveryLocation: deliveryAddress,
        batchId: crop.batchId,
        farmerId: crop.farmerId,
        farmerName: crop.farmerName,
        farmerPhone: '+91 98480 12345'
      });

      setIsSubmitting(false);
      onClose();
      onSuccessOrder();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ 15-Minute Express Home Delivery"
      maxWidth="lg"
    >
      <form onSubmit={handlePlaceExpressOrder} className="space-y-5 text-slate-800">
        
        {/* Nearest Dark Store Bar */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-slate-900">{darkStore.name}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ⚡ {darkStore.estimatedDeliveryMinutes} Mins ETA
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  ⚡ Max ₹10 Delivery Fee (FREE on ₹99+)
                </span>
                <span className="text-[10px] text-cyan-800 font-semibold bg-cyan-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Thermometer className="w-2.5 h-2.5" /> {darkStore.temperatureCelsius}°C Cold Vault
                </span>
              </div>
              <p className="text-[11px] text-slate-600 truncate max-w-sm mt-0.5">
                {darkStore.locality}, {darkStore.city} • Stock: <strong>{inventoryItem ? `${inventoryItem.stockKg} kg ready` : 'Pre-stocked'}</strong>
              </p>
            </div>
          </div>

          {onOpenStoreSelector && (
            <button
              type="button"
              onClick={onOpenStoreSelector}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline shrink-0"
            >
              Change Store
            </button>
          )}
        </div>

        {/* Product Card & Pack Selector */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
          <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
            <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-900">{crop.cropName}</h3>
                <p className="text-xs text-slate-500">{crop.cropVariety} • Direct from {crop.farmerVillage}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-emerald-700">₹{unitPrice}/kg</span>
                <span className="text-[10px] text-slate-400 block">Retail Home Pack</span>
              </div>
            </div>

            {/* Pack Size Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                Select Home Pack Quantity:
              </label>
              <div className="flex flex-wrap gap-2">
                {packSizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedPackSizeKg(size)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                      selectedPackSizeKg === size
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                        : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {size} kg
                    <span className={`block text-[10px] font-normal ${selectedPackSizeKg === size ? 'text-emerald-100' : 'text-slate-500'}`}>
                      ₹{Math.round(size * unitPrice)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Traceability Guarantee Stamp */}
        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-700 text-[11px]">
              Grown by <strong>{crop.farmerName}</strong> • Batch: <span className="font-mono font-bold text-emerald-800">{crop.batchId || 'FS-TOM-2026-00124'}</span>
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
            ✓ 100% Traceable
          </span>
        </div>

        {/* Delivery Address & Notes */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Delivery Address (Home / Apartment)
            </label>
            <input
              type="text"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="House/Flat No, Building Name, Street..."
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Option
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['UPI', 'Card', 'COD'] as const).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-1.5 text-xs font-bold rounded-xl border text-center transition-all ${
                      paymentMethod === method
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {method === 'COD' ? 'Cash' : method}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rider Instruction (Optional)
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Gate code, landmark..."
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="p-3.5 bg-slate-100 rounded-2xl space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Item Total ({selectedPackSizeKg} kg @ ₹{unitPrice}/kg)</span>
            <span className="font-semibold text-slate-800">₹{itemTotal}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span className="flex items-center gap-1.5">
              <span>Express Dark Store Dispatch</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                Max ₹10 Capped
              </span>
            </span>
            {deliveryFee === 0 ? (
              <span className="text-emerald-700 font-bold">FREE (Orders ₹99+)</span>
            ) : (
              <span className="font-semibold text-slate-800">₹{deliveryFee} (Max ₹10)</span>
            )}
          </div>
          <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-sm text-slate-900">
            <span>Grand Total</span>
            <span className="text-emerald-700">₹{finalTotal}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="harvest"
            size="lg"
            disabled={isSubmitting}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
            leftIcon={<Zap className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : 'animate-bounce'}`} />}
          >
            {isSubmitting ? 'Dispatching Rider...' : `Pay ₹${finalTotal} & Deliver in ${darkStore.estimatedDeliveryMinutes} Mins`}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
