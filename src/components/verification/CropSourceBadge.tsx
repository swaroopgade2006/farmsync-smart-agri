import React from 'react';
import { SourceType, UserRole } from '../../types';
import { CheckCircle2, Sprout, Building2, Store, ShieldCheck } from 'lucide-react';

interface CropSourceBadgeProps {
  sourceType?: SourceType | UserRole | string;
  isFarmerDirect?: boolean;
  isResale?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showDirectTag?: boolean;
  className?: string;
}

export const CropSourceBadge: React.FC<CropSourceBadgeProps> = ({
  sourceType = 'FARMER',
  isFarmerDirect = true,
  isResale = false,
  size = 'sm',
  showDirectTag = false,
  className = ''
}) => {
  const normType = isResale ? 'VENDOR' : String(sourceType).toUpperCase();

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-xs font-bold',
    lg: 'px-3.5 py-1.5 text-sm font-black'
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4 h-4'
  };

  if (normType === 'FPO') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className={`inline-flex items-center gap-1 font-bold text-teal-800 bg-teal-50 border border-teal-300 rounded-lg shadow-xs ${sizeClasses[size]}`}>
          <Building2 className={`${iconSizes[size]} text-teal-600 flex-shrink-0`} />
          <span>✓ VERIFIED FPO</span>
        </span>
        {showDirectTag && (
          <span className="text-[10px] font-black uppercase tracking-wider bg-teal-600 text-white px-2 py-0.5 rounded-md">
            Collective Direct
          </span>
        )}
      </div>
    );
  }

  if (normType === 'VENDOR' || normType === 'TRADER') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className={`inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-lg shadow-xs ${sizeClasses[size]}`}>
          <Store className={`${iconSizes[size]} text-amber-600 flex-shrink-0`} />
          <span>✓ VERIFIED VENDOR</span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-md shadow-xs">
          Resale Listing
        </span>
      </div>
    );
  }

  // Default is Farmer
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg shadow-xs ${sizeClasses[size]}`}>
        <CheckCircle2 className={`${iconSizes[size]} text-emerald-600 flex-shrink-0`} />
        <span>✓ VERIFIED FARMER</span>
      </span>
      {isFarmerDirect && showDirectTag && (
        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
          <Sprout className="w-2.5 h-2.5" /> Farmer Direct
        </span>
      )}
    </div>
  );
};
