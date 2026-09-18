import React from 'react';
import { Crop, CropBatch, UserProfile } from '../../types';
import { useData } from '../../context/DataContext';
import { VerificationStatusBadge } from './VerificationStatusBadge';
import { CropSourceBadge } from './CropSourceBadge';
import { ShieldCheck, MapPin, Award, Building2, User, Calendar, ExternalLink, X, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CropSourceDetailModalProps {
  crop: Crop;
  batch?: CropBatch;
  seller?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenTraceModal?: () => void;
}

export const CropSourceDetailModal: React.FC<CropSourceDetailModalProps> = ({
  crop,
  batch,
  seller,
  isOpen,
  onClose,
  onOpenTraceModal,
}) => {
  const { cropBatches } = useData();
  const currentBatch = batch || cropBatches.find(b => b.batchId === crop.batchId);

  if (!isOpen) return null;

  const isResale = Boolean(crop.sourceType === 'VENDOR' || crop.isResale);
  const isFpo = Boolean(crop.sourceType === 'FPO');
  const isFarmer = Boolean(crop.sourceType === 'FARMER' || (!crop.sourceType && !isResale));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100 my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Produce Provenance & Seller Source
              </h2>
              <p className="text-xs text-slate-400">
                Verified transparent ownership and identity profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Top Overview Banner */}
          <div className={`p-4 rounded-xl border ${
            isFarmer 
              ? 'bg-emerald-950/30 border-emerald-500/30' 
              : isFpo 
              ? 'bg-blue-950/30 border-blue-500/30' 
              : 'bg-amber-950/30 border-amber-500/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CropSourceBadge 
                    sourceType={crop.sourceType || 'FARMER'} 
                    isResale={crop.isResale} 
                    size="md" 
                  />
                  {seller && (
                    <VerificationStatusBadge status={seller.verificationStatus || 'VERIFIED'} size="sm" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  {crop.cropName || (crop as any).name} ({crop.cropVariety || (crop as any).variety || 'Standard'})
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Batch ID: <span className="font-mono text-emerald-400 font-semibold">{crop.batchId || 'N/A'}</span>
                </p>
              </div>

              {isResale && (
                <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Verified Vendor Resale Listing. Farm origin preserved.</span>
                </div>
              )}
            </div>
          </div>

          {/* Seller / Producer Details Card */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              {isFarmer ? 'Verified Farmer Identity' : isFpo ? 'Verified FPO Collective Profile' : 'Verified Vendor / Trader Profile'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Seller / Entity Name</span>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  {seller?.name || crop.farmerName || 'Registered Producer'}
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-normal">
                    {seller?.role ? seller.role.toUpperCase() : (crop.sourceType || 'farmer').toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400">Location / Farm Gate</span>
                <p className="font-medium text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  {crop.location || seller?.operatingLocation || 'Direct Farm Hub'}
                </p>
              </div>

              {/* Farmer Specific Credentials */}
              {isFarmer && (
                <>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Land Title / Patta Status</span>
                    <p className="font-mono text-xs text-emerald-300 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-700">
                      7/12 Land Record: 742/3A (Verified)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Govt ID Verification</span>
                    <p className="font-mono text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-700">
                      Aadhaar: {seller?.maskedAadhaar || 'XXXX-XXXX-4821'} (Verified ✓)
                    </p>
                  </div>
                </>
              )}

              {/* FPO Specific Credentials */}
              {isFpo && (
                <>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">FPO Reg No</span>
                    <p className="font-mono text-xs text-blue-300 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-700">
                      FPO-MH-2024-8891 (Active)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Participating Smallholder Farmers</span>
                    <p className="font-medium text-xs text-slate-200 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-700">
                      340 Verified Member Cultivators
                    </p>
                  </div>
                </>
              )}

              {/* Vendor Specific Credentials */}
              {isResale && (
                <>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">GSTIN / Tax ID</span>
                    <p className="font-mono text-xs text-amber-300 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-700">
                      {seller?.maskedGst || '37AABCA****1Z9'} (Verified)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400">Mandi Trade License</span>
                    <p className="font-mono text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded border border-slate-700">
                      {seller?.maskedTradeLicense || 'APMC-VND-2024-789'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* If Vendor Resale: Show Original Origin Chain */}
          {isResale && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-5 space-y-3">
              <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Original Farmgate Origin & Chain of Custody
              </h4>
              <p className="text-xs text-slate-300">
                To protect buyers and ensure anti-counterfeiting, our protocol traces this resale lot directly back to the original grower.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Original Farmer</span>
                  <span className="font-semibold text-white">Ramesh Patel</span>
                  <span className="text-slate-400 block text-[11px]">Nashik, Maharashtra</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Procurement Gate Price</span>
                  <span className="font-semibold text-emerald-400">₹{crop.originalFarmerPrice || (crop.pricePerKg * 0.78).toFixed(0)}/kg</span>
                  <span className="text-slate-400 block text-[11px]">Direct Farmgate settlement</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Vendor Value Add</span>
                  <span className="font-semibold text-amber-400">Cold Chain + Grade Sorting</span>
                  <span className="text-slate-400 block text-[11px]">Certified Fresh Logistics</span>
                </div>
              </div>
            </div>
          )}

          {/* Batch & Quality Metrics */}
          {currentBatch && (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quality Certification</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Grade {currentBatch.qualityGrade} • {currentBatch.aiConfidence || 94}% AI Trust Score
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="bg-slate-900/60 p-2 rounded">
                  <span className="text-slate-400 block text-[11px]">Harvest Date</span>
                  <span className="text-white font-medium">{currentBatch.harvestDate}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <span className="text-slate-400 block text-[11px]">Total Yield</span>
                  <span className="text-white font-medium">{currentBatch.quantity} {currentBatch.unit}</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <span className="text-slate-400 block text-[11px]">Pesticide Residue</span>
                  <span className="text-emerald-400 font-medium">Within Safe Limits</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <span className="text-slate-400 block text-[11px]">Moisture Index</span>
                  <span className="text-blue-400 font-medium">12.4% Optimal</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <Link
            to={`/trace/${crop.batchId || 'FS-TOM-2026-00124'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Open Public Trace URL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-3">
            {onOpenTraceModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTraceModal();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                View Full Traceability Timeline
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
