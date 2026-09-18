import React from 'react';
import { VerificationStatus } from '../../types';
import { CheckCircle2, Clock, AlertCircle, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface VerificationStatusBadgeProps {
  status?: VerificationStatus | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({
  status = 'NOT_VERIFIED',
  size = 'sm',
  showLabel = true,
  className = ''
}) => {
  const normalizedStatus = (status || 'NOT_VERIFIED').toUpperCase();

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs font-bold gap-1.5',
    lg: 'px-4 py-2 text-sm font-black gap-2'
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  switch (normalizedStatus) {
    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-full shadow-xs ${sizeClasses[size]} ${className}`}
        >
          <CheckCircle2 className={`${iconSizes[size]} text-emerald-600 flex-shrink-0`} />
          {showLabel && <span>🟢 VERIFIED</span>}
        </span>
      );

    case 'PENDING':
    case 'VERIFICATION PENDING':
      return (
        <span
          className={`inline-flex items-center font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded-full shadow-xs ${sizeClasses[size]} ${className}`}
        >
          <Clock className={`${iconSizes[size]} text-amber-600 flex-shrink-0 animate-pulse`} />
          {showLabel && <span>🟡 PENDING REVIEW</span>}
        </span>
      );

    case 'UNDER_REVIEW':
    case 'UNDER REVIEW':
      return (
        <span
          className={`inline-flex items-center font-bold text-blue-800 bg-blue-50 border border-blue-300 rounded-full shadow-xs ${sizeClasses[size]} ${className}`}
        >
          <Clock className={`${iconSizes[size]} text-blue-600 flex-shrink-0`} />
          {showLabel && <span>🔵 UNDER REVIEW</span>}
        </span>
      );

    case 'REJECTED':
    case 'VERIFICATION REJECTED':
      return (
        <span
          className={`inline-flex items-center font-bold text-rose-800 bg-rose-50 border border-rose-300 rounded-full shadow-xs ${sizeClasses[size]} ${className}`}
        >
          <XCircle className={`${iconSizes[size]} text-rose-600 flex-shrink-0`} />
          {showLabel && <span>🔴 VERIFICATION REJECTED</span>}
        </span>
      );

    case 'REVIEW_REQUIRED':
    case 'REVIEW REQUIRED':
      return (
        <span
          className={`inline-flex items-center font-bold text-indigo-900 bg-indigo-50 border border-indigo-300 rounded-full shadow-xs ${sizeClasses[size]} ${className}`}
        >
          <AlertTriangle className={`${iconSizes[size]} text-indigo-600 flex-shrink-0`} />
          {showLabel && <span>🔵 REVIEW REQUIRED</span>}
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center font-bold text-slate-600 bg-slate-100 border border-slate-300 rounded-full shadow-xs ${sizeClasses[size]} ${className}`}
        >
          <AlertCircle className={`${iconSizes[size]} text-slate-400 flex-shrink-0`} />
          {showLabel && <span>⚪ NOT VERIFIED</span>}
        </span>
      );
  }
};
