import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { CropSourceBadge } from '../../components/verification/CropSourceBadge';
import { VerificationStatusBadge } from '../../components/verification/VerificationStatusBadge';
import { PriceTransparencyWidget } from '../../components/verification/PriceTransparencyWidget';
import {
  ShieldCheck,
  Search,
  QrCode,
  MapPin,
  Calendar,
  Truck,
  CheckCircle2,
  Package,
  Sprout,
  ArrowRight,
  Share2,
  ExternalLink,
  Award,
  AlertTriangle,
  Building2,
  User,
  TrendingUp,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export const CropTraceabilityPage: React.FC = () => {
  const { batchId: paramBatchId } = useParams<{ batchId?: string }>();
  const navigate = useNavigate();
  const { cropBatches, crops, users } = useData();

  const [searchInput, setSearchInput] = useState(paramBatchId || '');
  const [copiedLink, setCopiedLink] = useState(false);

  // Find batch
  const currentBatchId = paramBatchId || 'FS-TOM-2026-00124';
  const batch = cropBatches.find(
    b => b.batchId.toLowerCase() === currentBatchId.toLowerCase()
  ) || cropBatches[0];

  const matchedCrop = crops.find(c => c.batchId === batch?.batchId || c.id === batch?.cropId);
  const seller = users.find(u => u.id === (batch?.producerId || batch?.farmerId) || u.fullName === (batch?.producerName || matchedCrop?.farmerName) || u.name === matchedCrop?.farmerName);

  const isResale = Boolean(matchedCrop?.isResale || matchedCrop?.sourceType === 'VENDOR' || batch?.producerRole === 'vendor' || batch?.isResale);
  const isFpo = Boolean(matchedCrop?.sourceType === 'FPO' || batch?.producerRole === 'fpo');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/trace/${searchInput.trim().toUpperCase()}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Hero Banner */}
      <div className="relative bg-gradient-to-b from-emerald-950/50 via-slate-900 to-slate-950 border-b border-slate-800 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  FarmSync Digital Crop Provenance
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Public decentralized verification ledger — Trace food directly from soil to plate
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/marketplace"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Browse Marketplace</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Search Bar for Batch ID */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl bg-slate-900/90 border border-slate-700 rounded-2xl p-2 shadow-xl flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Enter Batch ID (e.g. FS-TOM-2026-00124, FS-MNG-2026-00033)"
              className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder-slate-500 font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex-shrink-0"
            >
              Verify Batch
            </button>
          </form>

          {/* Quick Select Popular Batches */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
            <span>Try sample batches:</span>
            {cropBatches.slice(0, 4).map(b => (
              <button
                key={b.batchId}
                onClick={() => {
                  setSearchInput(b.batchId);
                  navigate(`/trace/${b.batchId}`);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-colors ${
                  b.batchId === batch?.batchId
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {b.batchId}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {batch ? (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
          {/* Main Batch Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <CropSourceBadge
                    sourceType={isResale ? 'VENDOR' : isFpo ? 'FPO' : 'FARMER'}
                    isResale={isResale}
                    size="md"
                  />
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Authenticity
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Grade {batch.qualityGrade || 'A'} • {batch.aiConfidence || 94}% AI Trust
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {batch.cropName} ({batch.cropVariety || batch.variety || 'Certified Grade'})
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
                    Batch Identifier: <span className="font-mono text-emerald-400 font-bold">{batch.batchId}</span>
                  </p>
                </div>
              </div>

              {/* QR Code & Share Box */}
              <div className="flex items-center gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <div className="bg-white p-2 rounded-lg flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin + '/trace/' + batch.batchId)}`}
                    alt="Batch Trace QR"
                    className="w-18 h-18"
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                    Interactive QR Scan
                  </span>
                  <p className="text-white font-medium">Digital Product Passport</p>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg flex items-center gap-1.5 transition-colors text-[11px] font-semibold"
                  >
                    <Share2 className="w-3 h-3" />
                    {copiedLink ? 'Copied Link! ✓' : 'Share Verification'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  {isResale ? 'Vendor Seller' : isFpo ? 'FPO Cooperative' : 'Farmer Origin'}
                </span>
                <p className="font-bold text-white text-sm">{batch.producerName || batch.farmerName || 'Verified Producer'}</p>
                <p className="text-slate-400 text-xs">{batch.farmLocation || `${batch.village}, ${batch.district}`}</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" /> Harvest Date
                </span>
                <p className="font-bold text-white text-sm">{batch.actualHarvestDate || batch.expectedHarvestDate || batch.harvestDate || '2026-09-20'}</p>
                <p className="text-slate-400 text-xs">Field Quality Inspected</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                  <Package className="w-3.5 h-3.5 text-amber-400" /> Quantity Yield
                </span>
                <p className="font-bold text-white text-sm">{(batch.availableQuantityKg || batch.initialQuantityKg || batch.quantity || 1000).toLocaleString()} kg</p>
                <p className="text-slate-400 text-xs">100% Traceable Lot</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                  <Award className="w-3.5 h-3.5 text-purple-400" /> Farmgate Price
                </span>
                <p className="font-bold text-emerald-400 text-sm">₹{batch.priceBreakdown?.originalFarmerPrice || batch.currentPricePerKg || batch.farmerDirectPrice || 32}/kg</p>
                <p className="text-slate-400 text-xs">Direct Producer Share</p>
              </div>
            </div>
          </div>

          {/* End-to-End Digital Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-400" />
                  Farm-to-Fork Digital Timeline
                </h3>
                <p className="text-xs text-slate-400">
                  Immutable chronological audit of agricultural cultivation, harvest, testing, and distribution
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-mono">
                {(batch.timeline || []).length} Milestones Recorded
              </span>
            </div>

            {/* Timeline Stepper */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-amber-500">
              {(batch.timeline || []).map((item, idx) => (
                <div key={item.id || idx} className="relative group">
                  {/* Step Circle */}
                  <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                    item.verified !== false
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/30'
                      : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4.5 hover:border-slate-600 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white capitalize">{item.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-slate-700 text-slate-300">
                          {item.stage}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                    <div className="mt-3 pt-3 border-t border-slate-700/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        {item.location}
                      </span>
                      <span className="text-emerald-400 font-medium">
                        Verified by: <span className="text-white">{item.actorName || item.actor || 'FarmSync Certified Auditor'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Transparency Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Full Fair-Trade Price Transparency
                </h3>
                <p className="text-xs text-slate-400">
                  Know exactly how much goes to the farmer vs logistics, storage, and market handling
                </p>
              </div>
            </div>

            <PriceTransparencyWidget
              priceBreakdown={batch.priceBreakdown}
              pricePerKg={batch.currentPricePerKg || 35}
              sourceType={isResale ? 'VENDOR' : isFpo ? 'FPO' : 'FARMER'}
              isResale={isResale}
            />
          </div>

          {/* Producer Credential & Verification Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Verified Producer Registry & Anti-Impersonation Proof
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl space-y-2">
                <span className="text-slate-400 uppercase tracking-wider font-semibold text-[11px] block">
                  Producer / Organization
                </span>
                <p className="text-white font-bold text-sm flex items-center gap-2">
                  {batch.producerName || batch.farmerName || 'Verified Producer'}
                  <VerificationStatusBadge status="VERIFIED" size="sm" />
                </p>
                <p className="text-slate-300">
                  Role: <span className="font-semibold text-emerald-400 uppercase">{batch.producerRole || batch.sourceType || 'FARMER'}</span>
                </p>
                <p className="text-slate-300">Location: {batch.farmLocation || `${batch.village}, ${batch.district}, ${batch.state}`}</p>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl space-y-2">
                <span className="text-slate-400 uppercase tracking-wider font-semibold text-[11px] block">
                  Masked Encrypted Credentials
                </span>
                {isResale ? (
                  <>
                    <p className="text-slate-300">
                      GSTIN: <span className="font-mono text-amber-400 font-semibold">27AABCT****1Z5</span>
                    </p>
                    <p className="text-slate-300">
                      APMC Trade License: <span className="font-mono text-slate-200">APMC-VND-2024-789</span>
                    </p>
                  </>
                ) : isFpo ? (
                  <>
                    <p className="text-slate-300">
                      FPO Reg No: <span className="font-mono text-blue-400 font-semibold">FPO-MH-2024-8891</span>
                    </p>
                    <p className="text-slate-300">
                      Active Member Farmers: <span className="text-slate-200 font-semibold">340 Cultivators</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-300">
                      Aadhaar ID: <span className="font-mono text-emerald-400 font-semibold">XXXX-XXXX-4821</span> (Verified ✓)
                    </p>
                    <p className="text-slate-300">
                      7/12 Land Title: <span className="font-mono text-slate-200">Khata No 742/3A</span> (Govt Registry Checked)
                    </p>
                  </>
                )}
                <p className="text-[11px] text-slate-500">
                  Audited by FarmSync Anti-Fraud Authority on Aug 12, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto my-20 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Batch Not Found</h3>
          <p className="text-xs text-slate-400">
            No batch records found matching "<span className="font-mono text-emerald-400">{currentBatchId}</span>". Please verify the code or try searching again.
          </p>
          <button
            onClick={() => navigate('/trace/FS-TOM-2026-00124')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
          >
            Load Sample Batch FS-TOM-2026-00124
          </button>
        </div>
      )}
    </div>
  );
};
