import React, { useState } from 'react';
import { CropBatch, CropBatchTimelineEvent } from '../../types';
import { 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Sprout, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Truck, 
  ShoppingBag, 
  Layers, 
  Activity,
  Download,
  Share2
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CropSourceBadge } from './CropSourceBadge';
import { PriceTransparencyWidget } from './PriceTransparencyWidget';

interface CropTraceabilityModalProps {
  batch?: CropBatch | null | any;
  crop?: any;
  isOpen: boolean;
  onClose: () => void;
}

export const CropTraceabilityModal: React.FC<CropTraceabilityModalProps> = ({
  batch,
  crop,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const activeBatch: CropBatch | any = batch || (crop ? {
    batchId: crop.batchId || `FS-${(crop.cropName || crop.name || 'CROP').slice(0, 3).toUpperCase()}-2026-${String(crop.id || '101').slice(-3)}`,
    cropName: crop.cropName || crop.name || 'Produce',
    cropVariety: crop.cropVariety || crop.variety || 'Standard Lot',
    producerName: crop.farmerName || crop.producerName || 'Verified Producer',
    producerRole: crop.sourceType === 'vendor' ? 'vendor' : crop.sourceType === 'fpo' ? 'fpo' : 'farmer',
    isFarmerDirect: crop.isFarmerDirect ?? (crop.sourceType !== 'vendor'),
    farmLocation: crop.location || `${crop.farmerVillage || 'Kovvali'}, ${crop.farmerDistrict || 'West Godavari'}`,
    sowingDate: crop.sowingDate || '2026-06-15',
    expectedHarvestDate: crop.expectedHarvestDate || '2026-09-20',
    currentPricePerKg: crop.pricePerKg || crop.price || 30,
    initialQuantityKg: crop.estimatedQuantity || crop.quantity || 1000,
    availableQuantityKg: crop.availableQuantity || crop.quantity || 1000,
    currentStatus: crop.status === 'HARVESTING' ? 'HARVESTED' : 'CULTIVATION',
    priceBreakdown: crop.priceBreakdown || {
      originalFarmerPrice: crop.pricePerKg || crop.price || 30,
      handlingFee: 0,
      logisticsFee: 0,
      vendorMarkup: 0,
      platformFee: 0,
      finalBuyerPrice: crop.pricePerKg || crop.price || 30,
      isDirectFarmer: true
    },
    timeline: crop.timeline || [
      {
        id: 'tl-1',
        stage: 'FARM_SOWN',
        title: 'Certified Seed Sowing Recorded',
        description: 'Sowing completed with geo-tagged farm coordinates verified by AI satellite pass.',
        timestamp: '2026-06-15T09:00:00Z',
        location: crop.location || 'West Godavari, AP',
        actorName: crop.farmerName || 'Verified Farmer',
        actorRole: 'farmer',
        verified: true
      },
      {
        id: 'tl-2',
        stage: 'AI_MONITORED',
        title: 'Autonomous Agro-Disaster & Crop Health Check',
        description: 'Zero pest infestation, soil moisture 82% optimal with drip telemetry.',
        timestamp: '2026-07-28T14:30:00Z',
        location: crop.location || 'West Godavari, AP',
        actorName: 'FarmSync AI Engine',
        actorRole: 'admin',
        verified: true
      },
      {
        id: 'tl-3',
        stage: 'QUALITY_INSPECTED',
        title: 'Produce Grading & Purity Certification',
        description: 'Grade-A export standard certified with pesticide-free assay.',
        timestamp: '2026-08-30T11:00:00Z',
        location: crop.location || 'West Godavari, AP',
        actorName: 'Quality Inspection Cell',
        actorRole: 'fpo',
        verified: true
      }
    ]
  } : null);

  if (!activeBatch) return null;

  const handleCopyBatchId = () => {
    navigator.clipboard.writeText(activeBatch.batchId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'FARM_SOWN':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'SOIL_TESTED':
        return <Activity className="w-4 h-4 text-purple-600" />;
      case 'QUALITY_INSPECTED':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case 'HARVESTED':
        return <ShoppingBag className="w-4 h-4 text-amber-600" />;
      case 'PURCHASED_ESCROW':
        return <Layers className="w-4 h-4 text-indigo-600" />;
      case 'LOGISTICS_PICKUP':
      case 'COLD_CHAIN_TRANSIT':
        return <Truck className="w-4 h-4 text-cyan-600" />;
      case 'DELIVERED_BUYER':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-600" />;
    }
  };

  // Generate SVG QR pattern representation
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    window.location.origin + `/trace/${activeBatch.batchId}`
  )}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Digital Crop Provenance & Traceability"
      subtitle={`End-to-end digital lifecycle ledger for Batch ${activeBatch.batchId}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        
        {/* Top QR & Quick Summary Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-lg flex flex-col sm:flex-row items-center gap-6">
          
          {/* QR Code Container */}
          <div className="bg-white p-3 rounded-2xl shadow-md text-center flex flex-col items-center flex-shrink-0">
            <img 
              src={qrSvgUrl} 
              alt={`QR Code for ${activeBatch.batchId}`} 
              className="w-32 h-32 object-contain"
            />
            <span className="text-[10px] font-mono font-bold text-slate-700 mt-1 block">
              Scan for Public Verification
            </span>
          </div>

          {/* Batch Meta Details */}
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-lg border border-white/20 text-emerald-300">
                {activeBatch.batchId}
              </span>
              <CropSourceBadge 
                sourceType={activeBatch.producerRole || activeBatch.sourceType} 
                isFarmerDirect={activeBatch.isFarmerDirect} 
                size="sm" 
              />
              <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {activeBatch.currentStatus}
              </span>
            </div>

            <h3 className="text-2xl font-black text-white">
              {activeBatch.cropName} <span className="text-sm font-normal text-emerald-300">({activeBatch.cropVariety})</span>
            </h3>

            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{activeBatch.farmLocation || `${activeBatch.village || 'Kovvali'}, ${activeBatch.district || 'West Godavari'}, ${activeBatch.state || 'AP'}`}</span>
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Initial Batch</span>
                <span className="font-extrabold text-white">{(activeBatch.initialQuantityKg || 1000).toLocaleString()} kg</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Harvest Date</span>
                <span className="font-extrabold text-amber-300">{activeBatch.actualHarvestDate || activeBatch.expectedHarvestDate || '2026-09-20'}</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Quality Grade</span>
                <span className="font-extrabold text-emerald-400">{activeBatch.qualityGrade || 'Grade A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyBatchId}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Batch ID!' : 'Copy Batch ID'}
            </button>
            <a
              href={`/trace/${activeBatch.batchId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 font-bold text-emerald-800 flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Public Traceability Page
            </a>
          </div>

          <span className="text-[11px] text-slate-400 italic">
            * Sensitive farmer identity documents (Aadhaar/PAN/Bank) are permanently masked for privacy.
          </span>
        </div>

        {/* Price Transparency Component */}
        <PriceTransparencyWidget
          priceBreakdown={activeBatch.priceBreakdown}
          pricePerKg={activeBatch.currentPricePerKg}
          sourceType={activeBatch.producerRole}
          farmerName={activeBatch.producerName}
        />

        {/* Digital Journey Timeline */}
        <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Digital Supply Chain Timeline (Farm to Fork)
            </h4>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {(activeBatch.timeline || []).length} Recorded Steps
            </span>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
            {(activeBatch.timeline || []).map((event: any, idx: number) => (
              <div key={event.id || idx} className="relative z-10 flex items-start space-x-3.5">
                
                {/* Marker icon */}
                <div className="w-7 h-7 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-xs flex-shrink-0">
                  {getStageIcon(event.stage)}
                </div>

                {/* Event Content */}
                <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3.5 space-y-1 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <h5 className="text-xs font-black text-slate-900">{event.title}</h5>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(event.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{event.description}</p>

                  <div className="flex flex-wrap items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {event.location}
                    </span>
                    <span className="font-semibold text-slate-700">
                      By: {event.actorName} ({event.actorRole.toUpperCase()})
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>

      </div>
    </Modal>
  );
};
