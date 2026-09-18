import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Sparkles, ShoppingCart, MapPin, Calendar, DollarSign, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const FarmerMatchesPage: React.FC = () => {
  const { currentUser, farmerProfile } = useAuth();
  const { crops, getMatchesForCrop } = useData();

  const myCrops = crops.filter(
    c => c.farmerId === farmerProfile?.id || c.farmerId === currentUser?.id || c.farmerId === 'farmer_ravi'
  );

  const allMatches = myCrops.flatMap(crop => getMatchesForCrop(crop.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            AI Buyer Matches
            <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-1 rounded-full">
              {allMatches.length} Active Leads
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Institutional buyers and supermarket chains algorithmically matched to your crop parameters
          </p>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="space-y-4">
        {allMatches.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 border-slate-200">
            <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-2" />
            <p className="text-sm font-bold">No active buyer requirements matching your crops right now.</p>
          </Card>
        ) : (
          allMatches.map((m) => (
            <Card key={m.id} hover className="p-6 border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
                    {m.overallScore}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900">
                        {m.buyerRequirement.buyerBusinessName}
                      </h3>
                      {m.buyerRequirement.buyerVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      <Badge variant="purple" size="sm">
                        {m.crop.cropName} Match
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Target Delivery: {m.buyerRequirement.deliveryLocation} • Required by: {m.buyerRequirement.requiredByDate}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Required Volume</span>
                  <span className="text-lg font-black text-slate-900">
                    {m.buyerRequirement.requiredQuantity.toLocaleString()} kg
                  </span>
                  <span className="text-xs text-emerald-700 font-bold block">
                    Max Budget: ₹{m.buyerRequirement.maxPricePerKg}/kg
                  </span>
                </div>
              </div>

              {/* 5-Factor Weighted Score Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Crop Match (30%)</span>
                  <span className="font-extrabold text-slate-900">{m.factors.cropScore}/30</span>
                  <span className="text-[10px] text-emerald-700 font-medium block">Rating: {m.factors.cropEvaluation}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Volume (20%)</span>
                  <span className="font-extrabold text-slate-900">{m.factors.quantityScore}/20</span>
                  <span className="text-[10px] text-emerald-700 font-medium block">Rating: {m.factors.quantityEvaluation}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Location (15%)</span>
                  <span className="font-extrabold text-slate-900">{m.factors.locationScore}/15</span>
                  <span className="text-[10px] text-emerald-700 font-medium block">Rating: {m.factors.locationEvaluation}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Price (15%)</span>
                  <span className="font-extrabold text-slate-900">{m.factors.priceScore}/15</span>
                  <span className="text-[10px] text-emerald-700 font-medium block">Rating: {m.factors.priceEvaluation}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Date Ready (20%)</span>
                  <span className="font-extrabold text-slate-900">{m.factors.dateScore}/20</span>
                  <span className="text-[10px] text-emerald-700 font-medium block">Rating: {m.factors.dateEvaluation}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-600 italic">
                  "{m.factors.matchSummary}"
                </p>

                <Link to={`/farmer/crops/${m.crop.id}`}>
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View My {m.crop.cropName}
                  </Button>
                </Link>
              </div>

            </Card>
          ))
        )}
      </div>

    </div>
  );
};
