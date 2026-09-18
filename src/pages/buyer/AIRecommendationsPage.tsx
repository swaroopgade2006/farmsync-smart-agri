import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  ShoppingCart, 
  TrendingUp, 
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { AIMatchResult } from '../../types';
import { CropSourceBadge } from '../../components/verification/CropSourceBadge';
import { CropTraceabilityModal } from '../../components/verification/CropTraceabilityModal';
import { QrCode, ShieldCheck } from 'lucide-react';

export const AIRecommendationsPage: React.FC = () => {
  const { currentUser, buyerProfile } = useAuth();
  const { buyerRequirements, getMatchesForRequirement, createOrder } = useData();
  const navigate = useNavigate();

  const [selectedTraceCrop, setSelectedTraceCrop] = useState<any | null>(null);

  const myRequirements = buyerRequirements.filter(
    r => r.buyerId === buyerProfile?.id || r.buyerId === currentUser?.id || r.buyerId === 'buyer_freshmart'
  );

  const [selectedRequirementId, setSelectedRequirementId] = useState<string>(
    myRequirements[0]?.id || ''
  );

  // Order placing modal state
  const [selectedMatchForOrder, setSelectedMatchForOrder] = useState<AIMatchResult | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1000);
  const [deliveryLocation, setDeliveryLocation] = useState(
    buyerProfile?.deliveryAddress || 'Plot 45, Auto Nagar Industrial Estate, Vijayawada'
  );
  const [expectedDate, setExpectedDate] = useState('2026-10-18');
  const [isOrdering, setIsOrdering] = useState(false);

  const activeRequirement = buyerRequirements.find(r => r.id === selectedRequirementId) || myRequirements[0];
  const matches = activeRequirement ? getMatchesForRequirement(activeRequirement.id) : [];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchForOrder) return;

    setIsOrdering(true);
    await createOrder({
      buyerId: buyerProfile?.id || currentUser?.id || 'buyer_freshmart',
      buyerName: currentUser?.fullName || 'FreshMart Procurement',
      buyerBusinessName: buyerProfile?.businessName || 'FreshMart Wholesale Hub',
      farmerId: selectedMatchForOrder.crop.farmerId,
      farmerName: selectedMatchForOrder.crop.farmerName,
      cropId: selectedMatchForOrder.crop.id,
      cropName: selectedMatchForOrder.crop.cropName,
      cropVariety: selectedMatchForOrder.crop.cropVariety,
      quantity: Number(orderQuantity),
      unitPrice: selectedMatchForOrder.crop.pricePerKg,
      deliveryLocation,
      expectedDeliveryDate: expectedDate
    });

    setIsOrdering(false);
    setSelectedMatchForOrder(null);
    navigate('/buyer/orders');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
              Transparent 5-Factor Weighted AI Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            AI Recommended Farmers & Harvests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective mathematical matching across Crop (30%), Volume (20%), Location (15%), Price (15%), and Harvest Date (20%)
          </p>
        </div>
      </div>

      {/* Requirement Switcher Tabs */}
      <Card className="p-4 border-slate-200 bg-slate-50/80">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Select Active Buyer Procurement Requirement:
        </span>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {myRequirements.map((req) => (
            <button
              key={req.id}
              onClick={() => setSelectedRequirementId(req.id)}
              className={`p-3 rounded-2xl border text-left min-w-[220px] transition-all ${
                activeRequirement?.id === req.id
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-400/30'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black">{req.cropType}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  activeRequirement?.id === req.id ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {req.requiredQuantity.toLocaleString()} kg
                </span>
              </div>
              <span className={`text-[10px] block mt-1 ${activeRequirement?.id === req.id ? 'text-purple-100' : 'text-slate-400'}`}>
                Max ₹{req.maxPricePerKg}/kg • {req.deliveryLocation}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Matches Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Top Ranked Farmer Matches for "{activeRequirement?.cropType}"
            <Badge variant="purple" size="sm">{matches.length} Compatible Lots</Badge>
          </h2>
        </div>

        {matches.length === 0 ? (
          <Card className="p-12 text-center text-slate-400">
            <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-2" />
            <p className="text-sm font-bold">No farmer crops currently meet these requirement parameters.</p>
          </Card>
        ) : (
          matches.map((match, rank) => (
            <Card key={match.id} hover className="p-6 border-slate-200 space-y-5">
              
              {/* Top Row: Rank, Farmer info, Overall AI Score */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-4">
                  {/* Rank Badge & Overall Score */}
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white shadow-md shadow-purple-600/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                      Rank #{rank + 1}
                    </span>
                    <span className="text-xl font-black">{match.overallScore}%</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-black text-slate-900">
                        {match.crop.farmerName}
                      </h3>
                      <CropSourceBadge
                        sourceType={match.crop.sourceType || 'FARMER'}
                        isResale={Boolean(match.crop.isResale || match.crop.sourceType === 'VENDOR')}
                        size="sm"
                      />
                      {match.crop.batchId && (
                        <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {match.crop.batchId}
                        </span>
                      )}
                      <Badge variant="emerald" size="sm">
                        {match.crop.cropName} ({match.crop.cropVariety})
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-slate-500">
                        {match.crop.location} • Available: <strong className="text-slate-800">{match.crop.availableQuantity.toLocaleString()} kg</strong> • Price: <strong className="text-emerald-700">₹{match.crop.pricePerKg}/kg</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedTraceCrop(match.crop)}
                        className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <QrCode className="w-3 h-3" /> Trace Lot
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Estimated Readiness</span>
                  <span className="text-sm font-black text-slate-900">{match.crop.expectedHarvestDate}</span>
                  <span className="text-[10px] text-emerald-700 font-bold block">{match.crop.growthStage} Stage</span>
                </div>
              </div>

              {/* TRANSPARENT 5-FACTOR SCORING BREAKDOWN WITH WHY EXPLANATIONS */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Why FarmSync AI Recommends This Match (5-Factor Weighted Proof):
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  {/* Factor 1: Crop */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">1. Crop Match</span>
                      <span className="font-extrabold text-slate-900">{match.factors.cropScore}/30</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-700">
                      {match.factors.cropEvaluation}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Exact variety match: {match.crop.cropVariety}
                    </p>
                  </div>

                  {/* Factor 2: Quantity */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">2. Quantity</span>
                      <span className="font-extrabold text-slate-900">{match.factors.quantityScore}/20</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-700">
                      {match.factors.quantityEvaluation}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {match.crop.availableQuantity} kg vs {activeRequirement?.requiredQuantity} kg req.
                    </p>
                  </div>

                  {/* Factor 3: Location */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">3. Location</span>
                      <span className="font-extrabold text-slate-900">{match.factors.locationScore}/15</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-700">
                      {match.factors.locationEvaluation}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Same district freight logistics
                    </p>
                  </div>

                  {/* Factor 4: Price */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">4. Price Budget</span>
                      <span className="font-extrabold text-slate-900">{match.factors.priceScore}/15</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-700">
                      {match.factors.priceEvaluation}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      ₹{match.crop.pricePerKg} ≤ Max ₹{activeRequirement?.maxPricePerKg}
                    </p>
                  </div>

                  {/* Factor 5: Harvest Date */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">5. Harvest Date</span>
                      <span className="font-extrabold text-slate-900">{match.factors.dateScore}/20</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-700">
                      {match.factors.dateEvaluation}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Ready by {match.crop.expectedHarvestDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                <span className="text-xs text-purple-900 font-medium">
                  "{match.factors.matchSummary}"
                </span>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedMatchForOrder(match);
                    setOrderQuantity(Math.min(match.crop.availableQuantity, activeRequirement.requiredQuantity));
                  }}
                  rightIcon={<ShoppingCart className="w-4 h-4" />}
                >
                  Place Order with {match.crop.farmerName}
                </Button>
              </div>

            </Card>
          ))
        )}
      </div>

      {/* Place Order Modal */}
      {selectedMatchForOrder && (
        <Modal
          isOpen={Boolean(selectedMatchForOrder)}
          onClose={() => setSelectedMatchForOrder(null)}
          title={`Order ${selectedMatchForOrder.crop.cropName} (${selectedMatchForOrder.overallScore}% AI Match)`}
          subtitle={`Farmer: ${selectedMatchForOrder.crop.farmerName} • Location: ${selectedMatchForOrder.crop.location}`}
          maxWidth="md"
        >
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Unit Price:</span>
                <span className="font-bold text-emerald-800">₹{selectedMatchForOrder.crop.pricePerKg} / kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">AI Compatibility:</span>
                <span className="font-bold text-purple-800">{selectedMatchForOrder.overallScore}% Match</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Quantity to Order (kg) *
              </label>
              <input
                type="number"
                min={50}
                max={selectedMatchForOrder.crop.availableQuantity}
                required
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Delivery Location Yard *
              </label>
              <input
                type="text"
                required
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Expected Delivery Date *
              </label>
              <input
                type="date"
                required
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                <span className="text-xs text-emerald-300">Escrow Protected</span>
              </div>
              <span className="text-2xl font-black text-white">
                ₹{(orderQuantity * selectedMatchForOrder.crop.pricePerKg).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedMatchForOrder(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isOrdering} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Confirm Purchase Order
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Traceability Modal */}
      {selectedTraceCrop && (
        <CropTraceabilityModal
          crop={selectedTraceCrop}
          isOpen={Boolean(selectedTraceCrop)}
          onClose={() => setSelectedTraceCrop(null)}
        />
      )}

    </div>
  );
};
