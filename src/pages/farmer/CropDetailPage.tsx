import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateAIHarvestEstimate } from '../../services/aiEngine';
import { 
  Sprout, 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Droplets, 
  Activity, 
  CheckCircle2, 
  UploadCloud, 
  ShoppingCart, 
  Eye, 
  ShieldCheck, 
  TrendingUp,
  AlertTriangle,
  Clock,
  Trash2
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { AddCropUpdateModal } from './AddCropUpdateModal';
import { CropSourceBadge } from '../../components/verification/CropSourceBadge';
import { CropTraceabilityModal } from '../../components/verification/CropTraceabilityModal';
import { PriceTransparencyWidget } from '../../components/verification/PriceTransparencyWidget';
import { VerificationStatusBadge } from '../../components/verification/VerificationStatusBadge';
import { QrCode, Share2, ExternalLink } from 'lucide-react';

export const CropDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { crops, cropUpdates, getMatchesForCrop, updateCrop, deleteCrop, cropBatches } = useData();
  const { t, tCrop, tStage, tMethod, tFarmerType } = useLanguage();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const [copiedBatch, setCopiedBatch] = useState(false);

  const crop = crops.find(c => c.id === id) || crops[0];
  const updates = cropUpdates.filter(u => u.cropId === crop?.id);
  const aiEstimate = crop ? calculateAIHarvestEstimate(crop, updates) : null;
  const buyerMatches = crop ? getMatchesForCrop(crop.id) : [];
  const batch = cropBatches.find(b => b.batchId === crop?.batchId || b.cropId === crop?.id);

  if (!crop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">{t('myCrops.noCrops', 'Crop not found')}</h2>
        <Link to="/farmer/crops" className="text-emerald-600 underline text-sm mt-2 block">{t('nav.myCrops', 'Back to My Crops')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header / Nav */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/farmer/crops"
            className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {tCrop(crop.cropName)}
              </h1>
              <CropSourceBadge
                sourceType={crop.sourceType || 'FARMER'}
                isResale={Boolean(crop.isResale || crop.sourceType === 'VENDOR')}
                size="md"
              />
              <Badge variant="emerald" size="md">
                {tStage(crop.growthStage)}
              </Badge>
              {crop.status === 'SOLD_OUT' || crop.availableQuantity === 0 ? (
                <Badge variant="rose" size="md" className="bg-rose-600 text-white font-black">
                  {t('myCrops.soldOut', 'Sold Out')}
                </Badge>
              ) : (
                <Badge variant={crop.farmerType === 'Funded' ? 'emerald' : crop.farmerType === 'Free-Support' ? 'amber' : 'slate'} size="md">
                  {tFarmerType(crop.farmerType)}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>{crop.cropVariety} • {crop.landArea} {t('common.acres', 'Acres')}</span>
              {crop.batchId && (
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Batch: {crop.batchId}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Sold Out button */}
          <button
            onClick={() => {
              if (crop.status === 'SOLD_OUT' || crop.availableQuantity === 0) {
                updateCrop(crop.id, { status: 'ACTIVE', availableQuantity: crop.estimatedQuantity || 1000 });
              } else {
                updateCrop(crop.id, { status: 'SOLD_OUT', availableQuantity: 0 });
              }
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
              crop.status === 'SOLD_OUT' || crop.availableQuantity === 0
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            {crop.status === 'SOLD_OUT' || crop.availableQuantity === 0
              ? t('myCrops.reactivate', 'Reactivate Stock')
              : t('myCrops.markSoldOut', 'Mark as Sold Out')}
          </button>

          {/* Delete / Remove Crop button */}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t('myCrops.removeCrop', 'Remove Listing')}
          </button>

          <Button
            variant="primary"
            onClick={() => setIsUpdateModalOpen(true)}
            leftIcon={<UploadCloud className="w-4 h-4" />}
          >
            {t('common.uploadUpdate', 'Upload Progress')}
          </Button>
        </div>
      </div>

      {/* Sold out alert banner */}
      {(crop.status === 'SOLD_OUT' || crop.availableQuantity === 0) && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-900">{t('myCrops.soldOut', 'This Crop Listing is Sold Out')}</h4>
              <p className="text-[11px] text-rose-700 mt-0.5">Available volume is 0 kg. Buyers cannot place new orders for this batch.</p>
            </div>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0"
          >
            {t('myCrops.removeCrop', 'Remove Listing')}
          </button>
        </div>
      )}

      {/* Main Grid: Crop Overview & AI Harvest Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Image, Specs & AI Harvest Estimation */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Visual Card */}
          <Card className="overflow-hidden border-slate-200">
            <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-100">
              <img
                src={crop.imageUrl}
                alt={crop.cropName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20">
                  {tMethod(crop.farmingMethod)}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-emerald-600 text-white text-sm font-black px-3.5 py-1.5 rounded-xl shadow-lg">
                  ₹{crop.pricePerKg} / {t('common.perKg', 'kg')}
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{t('common.availableQty', 'Available Volume')}</span>
                <span className="text-base font-extrabold text-slate-900">{crop.availableQuantity.toLocaleString()} kg</span>
                <span className="text-[10px] text-slate-500 block">of {crop.estimatedQuantity} kg total</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Land Cultivation</span>
                <span className="text-base font-extrabold text-slate-900">{crop.landArea} {t('common.acres', 'Acres')}</span>
                <span className="text-[10px] text-slate-500 block">Sown: {crop.sowingDate}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cultivation Cost</span>
                <span className="text-base font-extrabold text-slate-900">₹{crop.cultivationCost.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-emerald-600 font-medium block">
                  ROI potential: ~{Math.round(((crop.estimatedQuantity * crop.pricePerKg - crop.cultivationCost) / Math.max(1, crop.cultivationCost)) * 100)}%
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Farm Location</span>
                <span className="text-xs font-bold text-slate-900 truncate block">{crop.location}</span>
                <span className="text-[10px] text-slate-500 block">{crop.farmerDistrict}, {crop.farmerState}</span>
              </div>
            </div>

            {/* Farmer Identity Row */}
            <div className="p-4 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  {crop.farmerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">{crop.farmerName}</span>
                    {crop.farmerVerified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{crop.farmerVillage}, {crop.farmerDistrict}</span>
                </div>
              </div>
              <Badge variant="emerald" size="md">
                {t('action.filter', 'Verified Farmer')}
              </Badge>
            </div>
          </Card>

          {/* AI HARVEST ESTIMATION WIDGET */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border-slate-700 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">AI Harvest Estimation Engine</h3>
                  <p className="text-[11px] text-slate-400">Grounded in vegetative lifecycle duration, on-ground photos & pest logs</p>
                </div>
              </div>

              {aiEstimate && (
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
                    {aiEstimate.confidencePercentage}% Confidence
                  </span>
                </div>
              )}
            </div>

            {aiEstimate ? (
              <div className="space-y-4">
                {/* Big Countdown */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">Harvest Horizon</span>
                    <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                      {aiEstimate.daysRemaining === 0 
                        ? 'Ready for Harvest Immediately' 
                        : `Approximately ${aiEstimate.daysRemaining} days remaining`}
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      Target Ready Date: <strong className="text-amber-300">{aiEstimate.estimatedHarvestDate}</strong>
                    </p>
                  </div>

                  <div className="text-right sm:self-center">
                    <div className="w-32 bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${aiEstimate.growthProgressPercentage}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {aiEstimate.growthProgressPercentage}% Lifecycle Complete
                    </span>
                  </div>
                </div>

                {/* Factors Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Growth Stage Weight</span>
                    <span className="font-semibold text-slate-100">{aiEstimate.factorsUsed.growthStage}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Irrigation Condition</span>
                    <span className="font-semibold text-slate-100">{aiEstimate.factorsUsed.irrigationStatus}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Pest Observation Risk</span>
                    <span className="font-semibold text-slate-100">{aiEstimate.factorsUsed.pestRisk}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Regional Microclimate</span>
                    <span className="font-semibold text-slate-100">{aiEstimate.factorsUsed.weatherCondition}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  * Note: AI estimates are calculated algorithmically based on farmer observation timeline logs, seed variety growth benchmarks, and moisture telemetry.
                </p>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-amber-300">
                Insufficient data for reliable estimation. Please upload a crop progress update.
              </div>
            )}
          </Card>

          {/* CHRONOLOGICAL CROP PROGRESS TIMELINE */}
          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Crop Progress Timeline
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Chronological record of growth updates, photos and irrigation logs</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdateModalOpen(true)}
                leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
              >
                Add Update
              </Button>
            </div>

            {updates.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-2xl">
                No progress updates uploaded yet. Click "Add Update" to upload field photos and observations.
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 before:z-0">
                {updates.map((update, idx) => (
                  <div key={update.id} className="relative z-10 flex items-start space-x-4">
                    {/* Circle marker */}
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-sm flex-shrink-0">
                      {idx + 1}
                    </div>

                    {/* Timeline card */}
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {update.growthStage} Stage
                          </span>
                          <Badge variant="blue" size="sm">
                            {update.irrigationStatus}
                          </Badge>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          {update.updateDate}
                        </span>
                      </div>

                      {update.photoUrl && (
                        <div className="rounded-xl overflow-hidden aspect-video max-w-sm max-h-48 border border-slate-200 shadow-sm">
                          <img src={update.photoUrl} alt="Growth update" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="text-xs text-slate-700 space-y-1">
                        <p><strong className="text-slate-900">Pest Observations:</strong> {update.pestObservations || 'None reported'}</p>
                        <p><strong className="text-slate-900">Farmer Notes:</strong> {update.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>

        {/* Right 1 Col: Batch Digital Passport & AI Buyer Matches */}
        <div className="space-y-6">
          {/* DIGITAL BATCH PASSPORT & TRACEABILITY CARD */}
          <Card className="p-6 border-emerald-200 bg-emerald-50/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Digital Crop Passport</h3>
                  <span className="text-[11px] text-slate-500">Immutable Provenance & QR Trace</span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Verified
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Batch ID</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    {crop.batchId || 'FS-TOM-2026-00124'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(crop.batchId || 'FS-TOM-2026-00124');
                      setCopiedBatch(true);
                      setTimeout(() => setCopiedBatch(false), 2000);
                    }}
                    className="text-[11px] text-slate-500 hover:text-emerald-700 font-semibold"
                  >
                    {copiedBatch ? 'Copied! ✓' : 'Copy ID'}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Public Verification URL</span>
                <Link
                  to={`/trace/${crop.batchId || 'FS-TOM-2026-00124'}`}
                  target="_blank"
                  className="text-emerald-600 hover:underline font-bold flex items-center gap-1 text-[11px]"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => setIsTraceModalOpen(true)}
              leftIcon={<QrCode className="w-4 h-4" />}
            >
              Generate Batch QR & Timeline
            </Button>
          </Card>

          {/* FAIR-TRADE PRICE TRANSPARENCY WIDGET */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Fair Price Realization
            </h4>
            <PriceTransparencyWidget
              priceBreakdown={crop.priceBreakdown}
              pricePerKg={crop.pricePerKg}
              sourceType={crop.sourceType || 'FARMER'}
              isResale={Boolean(crop.isResale || crop.sourceType === 'VENDOR')}
            />
          </div>

          <Card className="p-6 border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Buyer Inquiries</h3>
                  <span className="text-[11px] text-slate-500">Live AI matching requirements</span>
                </div>
              </div>
              <Badge variant="emerald" size="sm">{buyerMatches.length} Matches</Badge>
            </div>

            <div className="space-y-3">
              {buyerMatches.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                  No active buyer requirements match this crop right now.
                </div>
              ) : (
                buyerMatches.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{m.buyerRequirement.buyerBusinessName}</span>
                        <span className="text-[11px] text-slate-500">
                          Needs {m.buyerRequirement.requiredQuantity} kg @ Max ₹{m.buyerRequirement.maxPricePerKg}/kg
                        </span>
                      </div>
                      <Badge variant="emerald" size="sm" className="font-extrabold">
                        {m.overallScore}% Match
                      </Badge>
                    </div>

                    <div className="text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                      <span>{m.factors.matchSummary}</span>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Required: {m.buyerRequirement.requiredByDate}</span>
                      <Link to="/farmer/orders">
                        <Button variant="primary" size="sm" className="text-[11px] py-1 px-2.5">
                          View Inquiries
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* Progress Update Modal */}
      <AddCropUpdateModal
        cropId={crop.id}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />

      {/* Delete / Remove Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title={t('myCrops.removeCrop', 'Remove Crop Listing')}
          subtitle={`Are you sure you want to permanently remove ${tCrop(crop.cropName)} (${crop.cropVariety})?`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900">
                <p className="font-bold">This will remove the crop listing from your dashboard and marketplace.</p>
                <p className="mt-0.5 text-rose-700">All associated buyer matching and inquiries will be unlinked.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                {t('action.cancel', 'Cancel')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  deleteCrop(crop.id);
                  setIsDeleteModalOpen(false);
                  navigate('/farmer/crops');
                }}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                {t('myCrops.removeCrop', 'Remove Crop')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Traceability Modal */}
      {isTraceModalOpen && (
        <CropTraceabilityModal
          crop={crop}
          isOpen={isTraceModalOpen}
          onClose={() => setIsTraceModalOpen(false)}
        />
      )}

    </div>
  );
};
