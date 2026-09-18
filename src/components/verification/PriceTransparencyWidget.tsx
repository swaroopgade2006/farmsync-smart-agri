import React from 'react';
import { PriceBreakdown } from '../../types';
import { 
  DollarSign, 
  ArrowDown, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  Store, 
  Truck, 
  Layers, 
  Sprout, 
  TrendingUp 
} from 'lucide-react';

interface PriceTransparencyWidgetProps {
  priceBreakdown?: PriceBreakdown;
  breakdown?: PriceBreakdown; // Alias
  pricePerKg?: number;
  sourceType?: 'FARMER' | 'FPO' | 'VENDOR' | string;
  isResale?: boolean;
  vendorName?: string;
  farmerName?: string;
  variant?: 'compact' | 'expanded' | 'chain';
  className?: string;
}

export const PriceTransparencyWidget: React.FC<PriceTransparencyWidgetProps> = ({
  priceBreakdown,
  breakdown,
  pricePerKg = 28,
  sourceType = 'FARMER',
  isResale = false,
  vendorName,
  farmerName,
  variant = 'expanded',
  className = ''
}) => {
  const effectiveBreakdown = priceBreakdown || breakdown;
  const isVendor = isResale || String(sourceType).toUpperCase() === 'VENDOR';
  
  // Default values if breakdown not fully populated
  const originalFarmerPrice = effectiveBreakdown?.originalFarmerPrice ?? effectiveBreakdown?.farmerPrice ?? (isVendor ? Math.round(pricePerKg * 0.78) : pricePerKg);
  const handlingFee = effectiveBreakdown?.handlingFee ?? effectiveBreakdown?.handlingCost ?? (isVendor ? 3.0 : 0);
  const logisticsFee = effectiveBreakdown?.logisticsFee ?? effectiveBreakdown?.logisticsCost ?? (isVendor ? 2.0 : 0);
  const vendorMarkup = effectiveBreakdown?.vendorMarkup ?? effectiveBreakdown?.vendorMargin ?? (isVendor ? Math.max(0, pricePerKg - (originalFarmerPrice + handlingFee + logisticsFee)) : 0);
  const platformFee = effectiveBreakdown?.platformFee ?? effectiveBreakdown?.taxAndCess ?? 0;
  const finalBuyerPrice = effectiveBreakdown?.finalBuyerPrice || pricePerKg;

  if (variant === 'compact') {
    return (
      <div className={`p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between font-bold text-slate-700">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Price Transparency</span>
          </span>
          <span className="text-emerald-700 font-extrabold">₹{finalBuyerPrice}/kg</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{isVendor ? 'Farmer Origin Price' : 'Farm Gate Revenue'}: ₹{originalFarmerPrice}/kg</span>
          {isVendor && <span>Vendor Margin: ₹{vendorMarkup > 0 ? vendorMarkup : 1}/kg</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 tracking-tight">
              Transparent Cost & Margin Breakdown
            </h4>
            <p className="text-[10px] text-slate-500">
              {isVendor 
                ? 'Recorded Intermediary Supply Chain Ledger' 
                : '100% Direct Farmgate Price Protection'}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
          isVendor 
            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
        }`}>
          {isVendor ? 'Resale Supply' : 'Farmer Direct'}
        </span>
      </div>

      {/* Step by Step Breakdown Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
        
        {/* Step 1: Original Farmer Price */}
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-emerald-800 flex items-center justify-center gap-1">
            <Sprout className="w-3 h-3 text-emerald-600" />
            {isVendor ? 'Origin Farmer' : 'Farmgate Base'}
          </span>
          <span className="text-base font-black text-emerald-950 my-1">
            ₹{originalFarmerPrice}/kg
          </span>
          <span className="text-[9px] text-emerald-700 leading-tight">
            {farmerName ? `Paid to ${farmerName}` : 'Producer Revenue'}
          </span>
        </div>

        {/* Step 2: Handling / Platform Cost */}
        <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-blue-800 flex items-center justify-center gap-1">
            <Layers className="w-3 h-3 text-blue-600" />
            Handling / Mandi
          </span>
          <span className="text-base font-black text-blue-950 my-1">
            ₹{handlingFee > 0 ? handlingFee : 0}/kg
          </span>
          <span className="text-[9px] text-blue-700 leading-tight">
            Terminal / Sorting fee
          </span>
        </div>

        {/* Step 3: Logistics / Transit */}
        <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-indigo-800 flex items-center justify-center gap-1">
            <Truck className="w-3 h-3 text-indigo-600" />
            Logistics Transit
          </span>
          <span className="text-base font-black text-indigo-950 my-1">
            ₹{logisticsFee > 0 ? logisticsFee : 0}/kg
          </span>
          <span className="text-[9px] text-indigo-700 leading-tight">
            Cold chain freight
          </span>
        </div>

        {/* Step 4: Final Buyer Price */}
        <div className="p-2.5 rounded-xl bg-slate-900 text-white flex flex-col justify-between shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Final Buyer Price
          </span>
          <span className="text-base font-black text-white my-1">
            ₹{finalBuyerPrice}/kg
          </span>
          <span className="text-[9px] text-slate-300 leading-tight">
            {isVendor ? `Includes ₹${vendorMarkup > 0 ? vendorMarkup : 1}/kg trader margin` : 'No hidden fees'}
          </span>
        </div>

      </div>

      {/* Vendor Resale Chain Notice */}
      {isVendor && (
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Transparent Resale Traceability Disclosure:</p>
            <p className="text-amber-800 text-[10px] mt-0.5">
              This lot was acquired by <strong>{vendorName || 'Verified Vendor'}</strong> from the registered farmer at ₹{originalFarmerPrice}/kg. 
              The ₹{finalBuyerPrice}/kg price includes documented handling (₹{handlingFee}/kg), cold logistics (₹{logisticsFee}/kg), and vendor trading margin.
            </p>
          </div>
        </div>
      )}

      {priceBreakdown?.notes && (
        <p className="text-[10px] text-slate-500 italic border-t border-slate-100 pt-2">
          * Recorded Transaction Note: {priceBreakdown.notes}
        </p>
      )}

    </div>
  );
};
