import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Crop } from '../../types';
import { 
  Sprout, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  Plus, 
  Filter, 
  Search,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { CreateAgreementModal } from './CreateAgreementModal';

export const FarmerProjectsPage: React.FC = () => {
  const { crops } = useData();
  const [modelFilter, setModelFilter] = useState<'ALL' | 'Funded' | 'Free-Support'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [modalState, setModalState] = useState<{
    crop: Crop | null;
    mode: 'FUNDED' | 'FREE_SUPPORT';
    isOpen: boolean;
  }>({
    crop: null,
    mode: 'FUNDED',
    isOpen: false,
  });

  const filteredCrops = crops.filter(crop => {
    if (modelFilter !== 'ALL' && crop.farmerType !== modelFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return crop.cropName.toLowerCase().includes(q) ||
             crop.farmerName.toLowerCase().includes(q) ||
             crop.location.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Farmer Projects & Cultivation Opportunities
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              {filteredCrops.length} Open
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Back rural farmers with capital agreements or disburse non-repayable CSR agricultural grants
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card className="p-4 border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search farmer name, crop, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Model:</span>
          {(['ALL', 'Funded', 'Free-Support'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setModelFilter(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                modelFilter === m
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {m === 'ALL' ? 'All Models' : m}
            </button>
          ))}
        </div>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <Card key={crop.id} hover className="border-slate-200 flex flex-col justify-between overflow-hidden group">
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={crop.imageUrl}
                  alt={crop.cropName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant={crop.farmerType === 'Funded' ? 'emerald' : crop.farmerType === 'Free-Support' ? 'amber' : 'slate'} size="sm">
                    {crop.farmerType}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-xl">
                    {crop.landArea} Acres
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{crop.cropName}</h3>
                  <p className="text-xs text-slate-500">{crop.cropVariety} • {crop.farmingMethod}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    {crop.farmerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900">{crop.farmerName}</span>
                      {crop.farmerVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block">{crop.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Cultivation Cost</span>
                    <span className="font-extrabold text-slate-800">₹{crop.cultivationCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Expected Yield</span>
                    <span className="font-extrabold text-slate-800">{crop.estimatedQuantity.toLocaleString()} kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setModalState({ crop, mode: 'FUNDED', isOpen: true })}
                leftIcon={<TrendingUp className="w-3.5 h-3.5" />}
              >
                Fund Capital
              </Button>

              <Button
                variant="harvest"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setModalState({ crop, mode: 'FREE_SUPPORT', isOpen: true })}
                leftIcon={<Award className="w-3.5 h-3.5 text-slate-900" />}
              >
                CSR Grant
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Agreement / Support modal */}
      {modalState.isOpen && (
        <CreateAgreementModal
          crop={modalState.crop}
          mode={modalState.mode}
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
        />
      )}

    </div>
  );
};
