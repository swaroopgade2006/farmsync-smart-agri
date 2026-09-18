import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateAIHarvestEstimate } from '../../services/aiEngine';
import { 
  Sprout, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  UploadCloud, 
  ArrowRight,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  PackageCheck
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { AddCropUpdateModal } from './AddCropUpdateModal';
import { Crop } from '../../types';

export const MyCropsPage: React.FC = () => {
  const { currentUser, farmerProfile } = useAuth();
  const { crops, cropUpdates, updateCrop, deleteCrop } = useData();
  const { t, tCrop, tStage, tMethod } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SOLD_OUT'>('ALL');
  const [selectedCropForUpdate, setSelectedCropForUpdate] = useState<string | null>(null);
  const [cropToDelete, setCropToDelete] = useState<Crop | null>(null);

  const myCrops = crops.filter(
    c => c.farmerId === farmerProfile?.id || c.farmerId === currentUser?.id || c.farmerId === 'farmer_ravi'
  );

  const activeCropsCount = myCrops.filter(c => c.status !== 'SOLD_OUT' && c.availableQuantity > 0).length;
  const soldOutCropsCount = myCrops.filter(c => c.status === 'SOLD_OUT' || c.availableQuantity === 0).length;

  const filteredCrops = myCrops.filter(c => {
    const translatedName = tCrop(c.cropName).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = c.cropName.toLowerCase().includes(searchLower) ||
                          translatedName.includes(searchLower) ||
                          c.cropVariety.toLowerCase().includes(searchLower);
    const matchesStage = stageFilter === 'ALL' || c.growthStage === stageFilter;
    
    const isSoldOut = c.status === 'SOLD_OUT' || c.availableQuantity === 0;
    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && !isSoldOut) ||
      (statusFilter === 'SOLD_OUT' && isSoldOut);

    return matchesSearch && matchesStage && matchesStatus;
  });

  const stagesList = ['ALL', 'Vegetative', 'Flowering', 'Fruiting', 'Maturing', 'Harvest Ready'];

  const handleToggleSoldOut = (crop: Crop, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSoldOut = crop.status === 'SOLD_OUT' || crop.availableQuantity === 0;
    if (isSoldOut) {
      updateCrop(crop.id, { 
        status: 'ACTIVE', 
        availableQuantity: crop.estimatedQuantity || 1000 
      });
    } else {
      updateCrop(crop.id, { 
        status: 'SOLD_OUT', 
        availableQuantity: 0 
      });
    }
  };

  const handleConfirmDelete = () => {
    if (cropToDelete) {
      deleteCrop(cropToDelete.id);
      setCropToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {t('myCrops.title', 'My Cultivated Crops')}
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              {myCrops.length} {t('common.listings', 'Listings')}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('myCrops.subtitle', 'Real-time management of crops, harvest projections, and buyer interest')}
          </p>
        </div>

        <Link to="/farmer/crops/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            {t('myCrops.addNew', '+ Add New Crop')}
          </Button>
        </Link>
      </div>

      {/* Status Tabs & Filters Bar */}
      <div className="space-y-3">
        {/* Status Toggle Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t('myCrops.all', 'All Crops')} ({myCrops.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'ACTIVE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {t('myCrops.activeOnly', 'Active Listings')} ({activeCropsCount})
          </button>
          <button
            onClick={() => setStatusFilter('SOLD_OUT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'SOLD_OUT'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {t('myCrops.soldOutOnly', 'Sold Out')} ({soldOutCropsCount})
          </button>
        </div>

        {/* Filters Bar */}
        <Card className="p-4 border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('myCrops.searchPlaceholder', 'Search crop name, variety...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> {t('common.stage', 'Stage')}:
            </span>
            {stagesList.map((stage) => (
              <button
                key={stage}
                onClick={() => setStageFilter(stage)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  stageFilter === stage
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tStage(stage)}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold">{t('myCrops.noCrops', 'No crops found matching filter.')}</p>
          </div>
        ) : (
          filteredCrops.map((crop) => {
            const updates = cropUpdates.filter(u => u.cropId === crop.id);
            const aiEstimate = calculateAIHarvestEstimate(crop, updates);
            const isSoldOut = crop.status === 'SOLD_OUT' || crop.availableQuantity === 0;

            return (
              <Card 
                key={crop.id} 
                hover 
                className={`border-slate-200 flex flex-col justify-between overflow-hidden group transition-all ${
                  isSoldOut ? 'bg-slate-50/90 border-dashed border-rose-200' : ''
                }`}
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={crop.imageUrl}
                      alt={crop.cropName}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        isSoldOut ? 'grayscale-[40%] opacity-90' : ''
                      }`}
                    />
                    
                    {/* Growth Stage Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <Badge variant="emerald" size="sm" className="bg-white/95 backdrop-blur shadow-sm">
                        {tStage(crop.growthStage)}
                      </Badge>
                      {isSoldOut && (
                        <Badge variant="rose" size="sm" className="bg-rose-600 text-white font-black shadow-md uppercase tracking-wider">
                          {t('myCrops.soldOut', 'Sold Out')}
                        </Badge>
                      )}
                    </div>

                    {/* Price & Delete icon */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <Badge variant="amber" size="sm" className="bg-slate-900/90 text-amber-300 border-amber-500/50 shadow-sm font-bold">
                        ₹{crop.pricePerKg}/{t('common.perKg', 'kg')}
                      </Badge>

                      {/* Quick Delete / Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCropToDelete(crop);
                        }}
                        title={t('myCrops.removeCrop', 'Remove Listing')}
                        className="p-1.5 bg-white/90 hover:bg-rose-600 text-slate-600 hover:text-white rounded-lg shadow-sm backdrop-blur transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Sold out overlay banner */}
                    {isSoldOut && (
                      <div className="absolute inset-x-0 bottom-0 bg-rose-950/80 backdrop-blur-xs py-1.5 px-3 flex items-center justify-between text-rose-100 text-[11px] font-bold">
                        <span className="flex items-center gap-1">
                          <PackageCheck className="w-3.5 h-3.5 text-rose-300" />
                          {t('myCrops.soldOut', 'Stock Depleted / Sold Out')}
                        </span>
                        <button
                          onClick={(e) => handleToggleSoldOut(crop, e)}
                          className="text-[10px] text-amber-300 hover:underline font-semibold"
                        >
                          {t('myCrops.reactivate', 'Reactivate')}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {tCrop(crop.cropName)}
                        </h3>
                        <p className="text-xs text-slate-500">{crop.cropVariety} • {crop.landArea} {t('common.acres', 'Acres')}</p>
                      </div>
                      <Badge variant="slate" size="sm">{tMethod(crop.farmingMethod)}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">{t('common.available', 'Available')}</span>
                        <span className={`font-bold ${isSoldOut ? 'text-rose-600' : 'text-slate-800'}`}>
                          {crop.availableQuantity.toLocaleString()} kg
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">{t('common.harvestTarget', 'Harvest Target')}</span>
                        <span className="font-bold text-slate-800">{crop.expectedHarvestDate}</span>
                      </div>
                    </div>

                    {/* AI Estimate pill */}
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-emerald-950 block">{t('common.aiForecast', 'AI Forecast')}</span>
                          <span className="text-[10px] text-emerald-800 font-medium">
                            {aiEstimate.daysRemaining === 0 
                              ? t('common.readyForHarvest', 'Ready for harvest') 
                              : `~${aiEstimate.daysRemaining} ${t('common.daysRemaining', 'days remaining')}`} ({aiEstimate.confidencePercentage}% {t('common.conf', 'conf.')})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedCropForUpdate(crop.id)}
                      className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> {t('common.uploadUpdate', 'Upload Update')}
                    </button>

                    <Link to={`/farmer/crops/${crop.id}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        {t('common.viewDetails', 'View Details')}
                      </Button>
                    </Link>
                  </div>

                  {/* Mark as Sold Out & Delete Actions Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
                    <button
                      onClick={(e) => handleToggleSoldOut(crop, e)}
                      className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                        isSoldOut 
                          ? 'text-emerald-700 hover:text-emerald-900' 
                          : 'text-amber-700 hover:text-amber-900'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {isSoldOut ? t('myCrops.reactivate', 'Reactivate Stock') : t('myCrops.markSoldOut', 'Mark as Sold Out')}
                    </button>

                    <button
                      onClick={() => setCropToDelete(crop)}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t('myCrops.removeCrop', 'Remove')}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete / Remove Confirmation Modal */}
      {cropToDelete && (
        <Modal
          isOpen={Boolean(cropToDelete)}
          onClose={() => setCropToDelete(null)}
          title={t('myCrops.removeCrop', 'Remove Crop Listing')}
          subtitle={`Are you sure you want to remove ${tCrop(cropToDelete.cropName)} (${cropToDelete.cropVariety})?`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-900">
                <p className="font-bold">This action will remove the crop from the marketplace.</p>
                <p className="mt-0.5 text-rose-700">All associated buyer matching and inquiries will be unlinked.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCropToDelete(null)}
              >
                {t('action.cancel', 'Cancel')}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                {t('myCrops.removeCrop', 'Remove Crop')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {selectedCropForUpdate && (
        <AddCropUpdateModal
          cropId={selectedCropForUpdate}
          isOpen={Boolean(selectedCropForUpdate)}
          onClose={() => setSelectedCropForUpdate(null)}
        />
      )}

    </div>
  );
};
