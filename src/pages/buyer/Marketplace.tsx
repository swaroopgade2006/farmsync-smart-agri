import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ArrowRight,
  UserCheck,
  Plus,
  SlidersHorizontal,
  RotateCcw,
  Zap,
  Building2,
  Clock,
  Thermometer,
  Bike,
  Navigation,
  ShieldCheck,
  QrCode,
  Info,
  ExternalLink,
  PackageCheck
} from 'lucide-react';
import { CropSourceBadge } from '../../components/verification/CropSourceBadge';
import { CropSourceDetailModal } from '../../components/verification/CropSourceDetailModal';
import { CropTraceabilityModal } from '../../components/verification/CropTraceabilityModal';
import { PriceTransparencyWidget } from '../../components/verification/PriceTransparencyWidget';
import { VerificationStatusBadge } from '../../components/verification/VerificationStatusBadge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { LocationDetector } from '../../components/common/LocationDetector';
import { PostRequirementModal } from './PostRequirementModal';
import { DarkStoreSelectorModal } from '../../components/darkstore/DarkStoreSelectorModal';
import { HomeQuickOrderModal } from '../../components/darkstore/HomeQuickOrderModal';
import { DarkStore } from '../../types';
import { useCart } from '../../context/CartContext';

export const Marketplace: React.FC = () => {
  const { currentUser, buyerProfile, user } = useAuth();
  const { crops, createOrder, cropBatches, users, darkStores, getNearestDarkStore } = useData();
  const { addToCart, updateQuantity, cartItems, setIsCartOpen, itemCount, grandTotal } = useCart();
  const { t, tCrop, tStage, tMethod, tFarmerType } = useLanguage();
  const navigate = useNavigate();

  // Pack size selection per crop (default 1kg)
  const [selectedPackSizes, setSelectedPackSizes] = useState<{ [cropId: string]: number }>({});

  // Dual Shopping Mode: 'HOME_NEEDS' (15-30m Dark Store) vs 'VENDOR_BULK' (Standard Farm Sourcing)
  const isConsumerUser = currentUser?.role === 'buyer' && (!buyerProfile?.gstNumber || buyerProfile?.businessType?.includes('Consumer'));
  const [fulfillmentMode, setFulfillmentMode] = useState<'HOME_NEEDS' | 'VENDOR_BULK'>(isConsumerUser ? 'HOME_NEEDS' : 'HOME_NEEDS');

  // Active Dark Store for Home Needs
  const userCity = buyerProfile?.operatingCity || currentUser?.operatingLocation || 'Vijayawada';
  const initialStore = getNearestDarkStore(userCity) || darkStores[0];
  const [selectedDarkStore, setSelectedDarkStore] = useState<DarkStore>(initialStore);
  const [userDeliveryAddress, setUserDeliveryAddress] = useState(
    buyerProfile?.deliveryAddress || 'Flat 402, Green Meadows, Benz Circle, Vijayawada'
  );

  // Modals
  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const [expressOrderCrop, setExpressOrderCrop] = useState<any | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');
  const [farmerTypeFilter, setFarmerTypeFilter] = useState('ALL');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<'ALL' | 'farmer' | 'fpo' | 'vendor'>('ALL');
  const [farmerDirectOnly, setFarmerDirectOnly] = useState(false);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(100);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);

  // Traceability & Source Modal states
  const [selectedTraceCrop, setSelectedTraceCrop] = useState<any | null>(null);
  const [selectedSourceCrop, setSelectedSourceCrop] = useState<any | null>(null);

  // Order placing modal state for bulk orders
  const [orderingCrop, setOrderingCrop] = useState<any | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(500);
  const [deliveryLocation, setDeliveryLocation] = useState(buyerProfile?.deliveryAddress || 'Main Wholesale Market Yard, Vijayawada');
  const [expectedDate, setExpectedDate] = useState('2026-10-18');
  const [isOrdering, setIsOrdering] = useState(false);

  const filteredCrops = crops.filter((crop) => {
    if (crop.status === 'SOLD_OUT' || crop.status === 'ARCHIVED' || crop.availableQuantity <= 0) return false;
    if (crop.status !== 'ACTIVE' && crop.status !== 'HARVESTING') return false;
    if (verifiedOnly && !crop.farmerVerified) return false;
    if (farmerDirectOnly && (crop.sourceType === 'VENDOR' || crop.isResale)) return false;
    if (sourceTypeFilter !== 'ALL') {
      if (sourceTypeFilter === 'farmer' && (crop.sourceType === 'VENDOR' || crop.sourceType === 'FPO' || crop.isResale)) return false;
      if (sourceTypeFilter === 'fpo' && crop.sourceType !== 'FPO') return false;
      if (sourceTypeFilter === 'vendor' && crop.sourceType !== 'VENDOR' && !crop.isResale) return false;
    }
    if (farmerTypeFilter !== 'ALL' && crop.farmerType !== farmerTypeFilter) return false;
    if (selectedCropFilter !== 'ALL' && !crop.cropName.toLowerCase().includes(selectedCropFilter.toLowerCase())) return false;
    if (crop.pricePerKg > maxPriceFilter) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = crop.cropName.toLowerCase().includes(q) || tCrop(crop.cropName).toLowerCase().includes(q);
      const matchVar = crop.cropVariety.toLowerCase().includes(q);
      const matchLoc = crop.location.toLowerCase().includes(q);
      const matchFarmer = crop.farmerName.toLowerCase().includes(q);
      const matchBatch = (crop.batchId || '').toLowerCase().includes(q);
      if (!matchName && !matchVar && !matchLoc && !matchFarmer && !matchBatch) return false;
    }

    return true;
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingCrop) return;

    setIsOrdering(true);
    await createOrder({
      buyerId: buyerProfile?.id || currentUser?.id || 'buyer_freshmart',
      buyerName: currentUser?.fullName || 'FreshMart Procurement',
      buyerBusinessName: buyerProfile?.businessName || 'FreshMart Wholesale Hub',
      farmerId: orderingCrop.farmerId,
      farmerName: orderingCrop.farmerName,
      cropId: orderingCrop.id,
      cropName: orderingCrop.cropName,
      cropVariety: orderingCrop.cropVariety,
      quantity: Number(orderQuantity),
      unitPrice: orderingCrop.pricePerKg,
      deliveryLocation,
      expectedDeliveryDate: expectedDate,
      fulfillmentType: 'FARM_BULK_STANDARD'
    });

    setIsOrdering(false);
    setOrderingCrop(null);
    navigate('/buyer/orders');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {t('marketplace.title', 'Agricultural Crop Marketplace')}
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              {filteredCrops.length} {t('common.activeListings', 'Active Listings')}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('marketplace.subtitle', 'Browse verified farmer harvest lots, check AI match scores, and place direct escrow purchase orders')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/buyer/dark-stores">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-bold bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
              leftIcon={<Building2 className="w-4 h-4 text-emerald-600" />}
            >
              Dark Stores Network
            </Button>
          </Link>
          <Button
            variant="harvest"
            size="sm"
            onClick={() => setIsRequirementModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4 text-slate-900" />}
          >
            {t('marketplace.postRequirement', 'Post Buyer Requirement')}
          </Button>
        </div>
      </div>

      {/* DUAL FULFILLMENT MODE SWITCHER */}
      <div className="bg-white p-2 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => setFulfillmentMode('HOME_NEEDS')}
          className={`flex-1 p-3.5 sm:p-4 rounded-2xl text-left transition-all flex items-center justify-between ${
            fulfillmentMode === 'HOME_NEEDS'
              ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md ring-2 ring-emerald-500/20'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div className={`p-2.5 rounded-2xl transition-colors ${fulfillmentMode === 'HOME_NEEDS' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black">🏠 Home Needs Delivery</span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  fulfillmentMode === 'HOME_NEEDS' ? 'bg-white text-emerald-900 shadow-xs' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  ⚡ 15–30 Mins Express
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  fulfillmentMode === 'HOME_NEEDS' ? 'bg-emerald-800 text-emerald-100' : 'bg-amber-100 text-amber-800'
                }`}>
                  Max ₹10 Delivery (FREE ₹99+)
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${fulfillmentMode === 'HOME_NEEDS' ? 'text-emerald-100' : 'text-slate-500'}`}>
                Instant home dispatch from nearest Dark Store ({selectedDarkStore.name}) • Subsidized max ₹10 flat fee
              </p>
            </div>
          </div>
          {fulfillmentMode === 'HOME_NEEDS' && <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0 hidden sm:block" />}
        </button>

        <button
          type="button"
          onClick={() => setFulfillmentMode('VENDOR_BULK')}
          className={`flex-1 p-3.5 sm:p-4 rounded-2xl text-left transition-all flex items-center justify-between ${
            fulfillmentMode === 'VENDOR_BULK'
              ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-md ring-2 ring-blue-500/20'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center space-x-3.5">
            <div className={`p-2.5 rounded-2xl transition-colors ${fulfillmentMode === 'VENDOR_BULK' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black">🏢 Vendor & Bulk Procurement</span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  fulfillmentMode === 'VENDOR_BULK' ? 'bg-white text-slate-900 shadow-xs' : 'bg-blue-100 text-blue-800'
                }`}>
                  Standard Farm Sourcing
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${fulfillmentMode === 'VENDOR_BULK' ? 'text-blue-200' : 'text-slate-500'}`}>
                Direct farm lots (500kg+), Mandi bulk freight, APMC/GST, Escrow contracts
              </p>
            </div>
          </div>
          {fulfillmentMode === 'VENDOR_BULK' && <CheckCircle2 className="w-5 h-5 text-blue-200 shrink-0 hidden sm:block" />}
        </button>
      </div>

      {/* ACTIVE NEAREST DARK STORE BANNER (For Home Needs Mode) */}
      {fulfillmentMode === 'HOME_NEEDS' && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-500/30">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-white">{selectedDarkStore.name}</span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" /> {selectedDarkStore.estimatedDeliveryMinutes} Min Delivery Radius
                </span>
                <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1">
                  <Thermometer className="w-3 h-3" /> {selectedDarkStore.temperatureCelsius}°C Cold Vault
                </span>
                <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                  <Bike className="w-3 h-3" /> {selectedDarkStore.activeRidersCount} Active Riders
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Delivering to: <strong className="text-white truncate max-w-md">{userDeliveryAddress}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {itemCount > 0 && (
              <Button
                type="button"
                variant="harvest"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20"
                leftIcon={<ShoppingBag className="w-3.5 h-3.5 text-slate-950" />}
              >
                View Cart ({itemCount} • ₹{grandTotal})
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsStoreSelectorOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
              leftIcon={<Navigation className="w-3.5 h-3.5" />}
            >
              Change Nearest Hub
            </Button>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <Card className="p-5 border-slate-200 bg-slate-50/70 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={t('marketplace.searchPlaceholder', 'Search crop, variety, farmer, batch ID (e.g. FS-TOM-2026)...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Commodity Selector */}
          <div>
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">🌱 All Commodities ({t('GROWTH_STAGES.ALL', 'All')})</option>
              <option value="Tomato">{tCrop('Tomato')} (Tomato)</option>
              <option value="Potato">{tCrop('Potato')} (Potato)</option>
              <option value="Onion">{tCrop('Red Onion')} (Onion)</option>
              <option value="Chilli">{tCrop('Green Chilli')} (Chilli)</option>
              <option value="Capsicum">{tCrop('Organic Capsicum')} (Capsicum)</option>
              <option value="Brinjal">{tCrop('Brinjal')} (Brinjal)</option>
              <option value="Lady Finger">{tCrop('Lady Finger')} (Ladyfinger)</option>
              <option value="Cauliflower">{tCrop('Cauliflower')} (Cauliflower)</option>
              <option value="Cabbage">{tCrop('Cabbage')} (Cabbage)</option>
              <option value="Carrot">{tCrop('Carrot')} (Carrot)</option>
              <option value="Spinach">{tCrop('Spinach')} (Spinach)</option>
              <option value="Ginger">{tCrop('Ginger')} (Ginger)</option>
              <option value="Garlic">{tCrop('Garlic')} (Garlic)</option>
              <option value="Rice">{tCrop('Paddy')} (Paddy / Rice)</option>
              <option value="Mango">{tCrop('Mango')} (Mango)</option>
            </select>
          </div>

          {/* Source Provenance Filter */}
          <div>
            <select
              value={sourceTypeFilter}
              onChange={(e) => setSourceTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">🛡️ All Source Types</option>
              <option value="farmer">✓ Verified Farmer Direct</option>
              <option value="fpo">✓ Verified FPO Collective</option>
              <option value="vendor">✓ Verified Vendor (Resale)</option>
            </select>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200/80 text-xs">
          
          {/* Max Price Slider */}
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-slate-600">{t('common.pricePerKg', 'Max Price')}:</span>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-24 sm:w-36 accent-emerald-600"
            />
            <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
              ₹{maxPriceFilter}/{t('common.perKg', 'kg')}
            </span>
          </div>

          {/* Farmer Direct Only Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer select-none bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <input
              type="checkbox"
              checked={farmerDirectOnly}
              onChange={(e) => setFarmerDirectOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-bold text-emerald-900 flex items-center gap-1">
              🌾 Farmer Direct Only
            </span>
          </label>

          {/* Verified toggle */}
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('action.filter', 'Verified')}
            </span>
          </label>

          {/* Reset button */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCropFilter('ALL');
              setFarmerTypeFilter('ALL');
              setSourceTypeFilter('ALL');
              setFarmerDirectOnly(false);
              setMaxPriceFilter(100);
              setVerifiedOnly(false);
            }}
            className="text-slate-500 hover:text-slate-900 flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {t('action.cancel', 'Reset')}
          </button>
        </div>
      </Card>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-700">{t('myCrops.noCrops', 'No matching crops found in marketplace')}</p>
          </div>
        ) : (
          filteredCrops.map((crop) => {
            const isResale = Boolean(crop.isResale || crop.sourceType === 'VENDOR');
            const darkStoreItem = selectedDarkStore.inventory.find(i => i.cropId === crop.id);
            const inDarkStore = Boolean(darkStoreItem && darkStoreItem.stockKg > 0);

            return (
              <Card key={crop.id} hover className="border-slate-200 flex flex-col justify-between overflow-hidden group">
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={crop.imageUrl}
                      alt={crop.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <CropSourceBadge
                        sourceType={crop.sourceType || 'FARMER'}
                        isResale={isResale}
                        size="sm"
                      />
                      {fulfillmentMode === 'HOME_NEEDS' && inDarkStore && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-md">
                          <Zap className="w-3 h-3" /> Ready in Dark Store
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="amber" size="sm" className="bg-slate-900/90 text-amber-300 border-amber-500/50 shadow-sm font-black text-sm">
                        ₹{crop.pricePerKg} / {t('common.perKg', 'kg')}
                      </Badge>
                    </div>

                    {crop.batchId && (
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-[10px] font-mono text-emerald-300 px-2 py-0.5 rounded-md border border-slate-700 flex items-center gap-1">
                        <QrCode className="w-3 h-3" />
                        <span>{crop.batchId}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {tCrop(crop.cropName)}
                        </h3>
                        <p className="text-xs text-slate-500">{crop.cropVariety} • {tMethod(crop.farmingMethod)}</p>
                      </div>
                      <Badge variant={crop.farmerType === 'Funded' ? 'emerald' : crop.farmerType === 'Free-Support' ? 'amber' : 'slate'} size="sm">
                        {tFarmerType(crop.farmerType)}
                      </Badge>
                    </div>

                    {/* Dark Store Express Availability Pill (for Home Needs) */}
                    {fulfillmentMode === 'HOME_NEEDS' && (
                      <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <span className="font-bold text-emerald-950 block text-[11px]">
                              {selectedDarkStore.locality} Micro-Hub
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              {inDarkStore ? `⚡ ${darkStoreItem?.stockKg} kg ready for instant dispatch` : '⚡ Same-day dispatch'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-emerald-300">
                          {selectedDarkStore.estimatedDeliveryMinutes}m ETA
                        </span>
                      </div>
                    )}

                    {/* Resale Warning & Origin info */}
                    {isResale && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between">
                        <div>
                          <span className="font-bold block">Vendor Value-Add Resale Lot</span>
                          <span className="text-slate-600 text-[10px]">Orig Farmgate: ₹{crop.originalFarmerPrice || (crop.pricePerKg * 0.78).toFixed(0)}/kg</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedSourceCrop(crop)}
                          className="px-2 py-1 bg-amber-200/60 hover:bg-amber-200 text-amber-950 font-bold rounded-lg transition-colors text-[10px]"
                        >
                          Trace Origin
                        </button>
                      </div>
                    )}

                    {/* Producer Identity Row */}
                    <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {crop.farmerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-slate-900">{crop.farmerName}</span>
                            {crop.farmerVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedSourceCrop(crop)}
                            className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                          >
                            <Info className="w-3 h-3" /> View Source
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {crop.farmerVillage}, {crop.farmerDistrict}, {crop.farmerState}
                        </span>
                      </div>
                    </div>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('common.availableQty', 'Available Qty')}</span>
                        <span className="font-extrabold text-slate-800">{crop.availableQuantity.toLocaleString()} kg</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          {fulfillmentMode === 'HOME_NEEDS' ? 'Home Packs' : t('common.harvestTarget', 'Harvest Target')}
                        </span>
                        <span className="font-extrabold text-slate-800">
                          {fulfillmentMode === 'HOME_NEEDS' ? '0.5, 1, 2, 5 kg' : crop.expectedHarvestDate}
                        </span>
                      </div>
                    </div>

                    {/* Traceability & QR Trigger */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedTraceCrop(crop)}
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Digital Trace QR</span>
                      </button>

                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 94% AI Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  {fulfillmentMode === 'HOME_NEEDS' ? (
                    <div className="w-full space-y-2.5">
                      {/* Pack Size Selector */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-bold">Select Pack:</span>
                        <div className="flex items-center gap-1">
                          {[0.5, 1, 2, 5].map((size) => {
                            const isSelected = (selectedPackSizes[crop.id] || 1) === size;
                            return (
                              <button
                                type="button"
                                key={size}
                                onClick={() => setSelectedPackSizes(prev => ({ ...prev, [crop.id]: size }))}
                                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {size}kg
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Cart & Order Action Buttons */}
                      <div className="flex items-center gap-2">
                        {(() => {
                          const selectedPack = selectedPackSizes[crop.id] || 1;
                          const itemId = `${crop.id}_${selectedPack}kg`;
                          const existingInCart = cartItems.find(i => i.id === itemId);
                          const qtyInCart = existingInCart ? existingInCart.quantity : 0;

                          return (
                            <>
                              {qtyInCart > 0 ? (
                                <div className="flex-1 flex items-center justify-between bg-emerald-600 text-white rounded-xl p-1 shadow-sm">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(itemId, qtyInCart - 1)}
                                    className="w-7 h-7 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center font-black text-sm transition-colors"
                                    title="Remove 1 pack"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-black px-2">
                                    {qtyInCart} in Cart ({qtyInCart * selectedPack} kg)
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => addToCart({
                                      cropId: crop.id,
                                      cropName: crop.cropName,
                                      cropVariety: crop.cropVariety,
                                      imageUrl: crop.imageUrl,
                                      farmerName: crop.farmerName,
                                      farmerVillage: crop.farmerVillage,
                                      batchId: crop.batchId,
                                      packSizeKg: selectedPack,
                                      quantity: 1,
                                      pricePerKg: crop.pricePerKg,
                                      darkStoreId: selectedDarkStore.id,
                                      darkStoreName: selectedDarkStore.name
                                    })}
                                    className="w-7 h-7 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center font-black text-sm transition-colors"
                                    title="Add 1 more pack"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  variant="harvest"
                                  size="sm"
                                  className="flex-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-sm"
                                  onClick={() => {
                                    addToCart({
                                      cropId: crop.id,
                                      cropName: crop.cropName,
                                      cropVariety: crop.cropVariety,
                                      imageUrl: crop.imageUrl,
                                      farmerName: crop.farmerName,
                                      farmerVillage: crop.farmerVillage,
                                      batchId: crop.batchId,
                                      packSizeKg: selectedPack,
                                      quantity: 1,
                                      pricePerKg: crop.pricePerKg,
                                      darkStoreId: selectedDarkStore.id,
                                      darkStoreName: selectedDarkStore.name
                                    });
                                  }}
                                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                                >
                                  + Add {selectedPack}kg (₹{Math.round(selectedPack * crop.pricePerKg)})
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50 shrink-0 font-bold"
                                onClick={() => setExpressOrderCrop(crop)}
                                title="Instant 1-item express checkout"
                              >
                                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                              </Button>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 w-full">
                      <Link to={`/farmer/crops/${crop.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          {t('common.viewDetails', 'View Specs')}
                        </Button>
                      </Link>

                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => {
                          setOrderingCrop(crop);
                          setOrderQuantity(Math.min(crop.availableQuantity, 1000));
                        }}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        {t('marketplace.orderNow', 'Place Bulk Order')}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Place Bulk Order Modal (For Vendors) */}
      {orderingCrop && (
        <Modal
          isOpen={Boolean(orderingCrop)}
          onClose={() => setOrderingCrop(null)}
          title={`Bulk Order: ${tCrop(orderingCrop.cropName)} (${orderingCrop.cropVariety})`}
          subtitle={`Commercial B2B Contract with ${orderingCrop.farmerName} • Batch ${orderingCrop.batchId || 'FS-TOM-2026'}`}
          maxWidth="lg"
        >
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            {/* Price Transparency Breakdown preview */}
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Transparent Fair-Trade Breakdown
                </span>
                <span className="text-[11px] font-mono text-slate-400">Batch: {orderingCrop.batchId || 'FS-TOM-2026'}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Producer Share</span>
                  <span className="font-bold text-emerald-400">₹{orderingCrop.originalFarmerPrice || orderingCrop.pricePerKg}/kg</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Handling & Pack</span>
                  <span className="font-bold text-slate-200">₹2.00/kg</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Transit Telemetry</span>
                  <span className="font-bold text-slate-200">₹3.00/kg</span>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Settlement Price</span>
                  <span className="font-bold text-amber-400">₹{orderingCrop.pricePerKg}/kg</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Quantity to Purchase (kg) * (Wholesale Lots)
              </label>
              <input
                type="number"
                min={50}
                max={orderingCrop.availableQuantity}
                required
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <LocationDetector
                value={deliveryLocation}
                onChange={(address) => setDeliveryLocation(address)}
                label="Target Delivery Warehouse Yard / APMC Terminal"
                placeholder="Enter warehouse address, market yard, or PIN code..."
                required
                showMapPreview={true}
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Total Calculation */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                <span className="text-xs text-emerald-300">Smart Escrow Protected</span>
              </div>
              <span className="text-2xl font-black text-white">
                ₹{(orderQuantity * orderingCrop.pricePerKg).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOrderingCrop(null)}>
                {t('action.cancel', 'Cancel')}
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isOrdering} rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t('marketplace.orderNow', 'Submit Purchase Request')}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Express Home Needs Order Modal */}
      {expressOrderCrop && (
        <HomeQuickOrderModal
          isOpen={Boolean(expressOrderCrop)}
          onClose={() => setExpressOrderCrop(null)}
          crop={expressOrderCrop}
          darkStore={selectedDarkStore}
          userAddress={userDeliveryAddress}
          onSuccessOrder={() => navigate('/buyer/orders')}
          onOpenStoreSelector={() => {
            setExpressOrderCrop(null);
            setIsStoreSelectorOpen(true);
          }}
        />
      )}

      {/* Dark Store Selector Modal */}
      <DarkStoreSelectorModal
        isOpen={isStoreSelectorOpen}
        onClose={() => setIsStoreSelectorOpen(false)}
        selectedStoreId={selectedDarkStore.id}
        onSelectStore={(store) => setSelectedDarkStore(store)}
        currentAddress={userDeliveryAddress}
        onAddressChange={(addr) => setUserDeliveryAddress(addr)}
      />

      {/* Traceability Modal */}
      {selectedTraceCrop && (
        <CropTraceabilityModal
          crop={selectedTraceCrop}
          isOpen={Boolean(selectedTraceCrop)}
          onClose={() => setSelectedTraceCrop(null)}
        />
      )}

      {/* Source Detail Modal */}
      {selectedSourceCrop && (
        <CropSourceDetailModal
          crop={selectedSourceCrop}
          seller={users.find(u => u.name === selectedSourceCrop.farmerName || u.id === selectedSourceCrop.farmerId)}
          isOpen={Boolean(selectedSourceCrop)}
          onClose={() => setSelectedSourceCrop(null)}
          onOpenTraceModal={() => {
            setSelectedTraceCrop(selectedSourceCrop);
          }}
        />
      )}

      {/* Post Requirement Modal */}
      <PostRequirementModal
        isOpen={isRequirementModalOpen}
        onClose={() => setIsRequirementModalOpen(false)}
      />

    </div>
  );
};
