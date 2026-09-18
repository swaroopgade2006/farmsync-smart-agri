import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { DarkStore, DarkStoreInventoryItem } from '../../types';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Thermometer, 
  Droplets, 
  Bike, 
  Package, 
  QrCode, 
  Sparkles, 
  RefreshCw, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Layers,
  X,
  Save,
  Truck,
  ExternalLink,
  ChevronDown,
  Lock,
  KeyRound
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { CropTraceabilityModal } from '../../components/verification/CropTraceabilityModal';
import { OtpVerificationModal } from '../../components/delivery/OtpVerificationModal';
import confetti from 'canvas-confetti';

export const DarkStoreInventoryManagerPage: React.FC = () => {
  const { 
    darkStores, 
    updateDarkStoreItemStock, 
    addDarkStoreInventoryItem, 
    removeDarkStoreInventoryItem, 
    updateDarkStoreDetails,
    crops,
    orders,
    deliveries,
    updateOrderStatus,
    updateDeliveryStatus,
    verifyDeliveryOtp
  } = useData();
  const { currentUser } = useAuth();

  const [selectedDispatchForOtp, setSelectedDispatchForOtp] = useState<any | null>(null);

  // Selected Dark Store
  const [selectedStoreId, setSelectedStoreId] = useState<string>(() => {
    return localStorage.getItem('farmsync_selected_darkstore_id') || darkStores[0]?.id || 'ds_vij_01';
  });

  const activeStore = darkStores.find(s => s.id === selectedStoreId) || darkStores[0];

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'DISPATCHES' | 'SETTINGS'>('INVENTORY');

  // Modals
  const [isInwardModalOpen, setIsInwardModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DarkStoreInventoryItem | null>(null);
  const [selectedTraceCrop, setSelectedTraceCrop] = useState<any | null>(null);

  // Inward Form State
  const [inwardForm, setInwardForm] = useState({
    cropId: '',
    cropName: '',
    cropVariety: '',
    batchId: '',
    farmerName: '',
    farmerVillage: '',
    stockKg: 50,
    pricePerKg: 35,
    packSizesStr: '0.5, 1, 2',
    freshnessHarvestDate: new Date().toISOString().split('T')[0],
    qualityGrade: 'Grade A+ Super Prime',
    isOrganic: true
  });

  // Edit Form State
  const [editStockKg, setEditStockKg] = useState<number>(0);
  const [editPricePerKg, setEditPricePerKg] = useState<number>(0);

  if (!activeStore) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-700">No Dark Stores Configured</h2>
      </div>
    );
  }

  // Derived Stats
  const inventoryItems = activeStore.inventory || [];
  const totalStockKg = inventoryItems.reduce((acc, item) => acc + item.stockKg, 0);
  const totalValuation = inventoryItems.reduce((acc, item) => acc + (item.stockKg * item.pricePerKg), 0);
  const lowStockCount = inventoryItems.filter(item => item.stockKg > 0 && item.stockKg < 25).length;
  const outOfStockCount = inventoryItems.filter(item => item.stockKg === 0).length;

  // Active Dispatches for this store
  const storeDispatches = deliveries.filter(
    d => d.darkStoreId === activeStore.id || (d.fulfillmentType === 'DARK_STORE_EXPRESS' && d.darkStoreName?.includes(activeStore.locality))
  );

  // Filtered Inventory
  const filteredInventory = inventoryItems.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.cropName.toLowerCase().includes(q);
      const matchVar = item.cropVariety.toLowerCase().includes(q);
      const matchFarmer = item.farmerName.toLowerCase().includes(q);
      const matchBatch = item.batchId.toLowerCase().includes(q);
      if (!matchName && !matchVar && !matchFarmer && !matchBatch) return false;
    }

    if (stockStatusFilter === 'IN_STOCK' && item.stockKg <= 0) return false;
    if (stockStatusFilter === 'LOW_STOCK' && (item.stockKg === 0 || item.stockKg >= 25)) return false;
    if (stockStatusFilter === 'OUT_OF_STOCK' && item.stockKg > 0) return false;

    return true;
  });

  // Handle Quick Stock Adjustments
  const handleQuickAdjust = (cropId: string, currentStock: number, delta: number) => {
    const updated = Math.max(0, currentStock + delta);
    updateDarkStoreItemStock(activeStore.id, cropId, updated);
  };

  // Handle Temperature Change
  const handleTempAdjust = (delta: number) => {
    const newTemp = Number((activeStore.temperatureCelsius + delta).toFixed(1));
    updateDarkStoreDetails(activeStore.id, { temperatureCelsius: newTemp });
  };

  // Handle Active Riders Change
  const handleRidersAdjust = (delta: number) => {
    const newCount = Math.max(1, activeStore.activeRidersCount + delta);
    updateDarkStoreDetails(activeStore.id, { activeRidersCount: newCount });
  };

  // Handle Toggle Open/Close
  const handleToggleStoreStatus = () => {
    updateDarkStoreDetails(activeStore.id, { isOpen: !activeStore.isOpen });
  };

  // Open Edit Modal
  const handleOpenEdit = (item: DarkStoreInventoryItem) => {
    setEditingItem(item);
    setEditStockKg(item.stockKg);
    setEditPricePerKg(item.pricePerKg);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateDarkStoreItemStock(activeStore.id, editingItem.cropId, editStockKg, editPricePerKg);
    setEditingItem(null);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
  };

  // Handle Inward Produce Submission
  const handleInwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inwardForm.cropName.trim()) return;

    const cropId = inwardForm.cropId || `crop_ds_${Date.now()}`;
    const batchId = inwardForm.batchId || `FS-${inwardForm.cropName.substring(0, 3).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const packSizes = inwardForm.packSizesStr
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n) && n > 0);

    const newItem: DarkStoreInventoryItem = {
      cropId,
      cropName: inwardForm.cropName,
      cropVariety: inwardForm.cropVariety || 'Selected Prime',
      batchId,
      farmerName: inwardForm.farmerName || 'Verified Farm Partner',
      farmerVillage: inwardForm.farmerVillage || activeStore.locality,
      stockKg: Number(inwardForm.stockKg),
      packSizesAvailableKg: packSizes.length > 0 ? packSizes : [0.5, 1, 2],
      pricePerKg: Number(inwardForm.pricePerKg),
      freshnessHarvestDate: inwardForm.freshnessHarvestDate,
      qualityGrade: inwardForm.qualityGrade,
      isOrganic: inwardForm.isOrganic
    };

    addDarkStoreInventoryItem(activeStore.id, newItem);
    setIsInwardModalOpen(false);

    // Reset Form
    setInwardForm({
      cropId: '',
      cropName: '',
      cropVariety: '',
      batchId: '',
      farmerName: '',
      farmerVillage: '',
      stockKg: 50,
      pricePerKg: 35,
      packSizesStr: '0.5, 1, 2',
      freshnessHarvestDate: new Date().toISOString().split('T')[0],
      qualityGrade: 'Grade A+ Super Prime',
      isOrganic: true
    });

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}
  };

  // Quick autofill when selecting an existing crop from platform
  const handleSelectPlatformCrop = (selectedId: string) => {
    const matched = crops.find(c => c.id === selectedId);
    if (matched) {
      setInwardForm(prev => ({
        ...prev,
        cropId: matched.id,
        cropName: matched.cropName,
        cropVariety: matched.cropVariety,
        batchId: matched.batchId,
        farmerName: matched.farmerName,
        farmerVillage: matched.farmerVillage || matched.location || activeStore.city,
        pricePerKg: matched.pricePerKg,
        isOrganic: matched.farmingMethod?.toLowerCase().includes('organic') || false
      }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600 fill-current" />
              15-Min Hyperlocal Fulfillment
            </span>
            <span className="text-xs text-slate-400 font-medium">• Micro-Warehouse Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Dark Store Stock & Hub Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage real-time produce stock, inward fresh farmer consignments, cold vault temperatures, and EV dispatch fleet
          </p>
        </div>

        {/* Hub Selector Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Select Active Hub</label>
            <div className="relative">
              <select
                value={selectedStoreId}
                onChange={(e) => {
                  setSelectedStoreId(e.target.value);
                  localStorage.setItem('farmsync_selected_darkstore_id', e.target.value);
                }}
                className="appearance-none bg-white border border-slate-300 rounded-2xl px-4 py-2.5 pr-10 text-sm font-bold text-slate-900 shadow-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer min-w-[260px]"
              >
                {darkStores.map(ds => (
                  <option key={ds.id} value={ds.id}>
                    📍 {ds.city} - {ds.name} ({ds.locality})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="pt-5 flex items-center gap-2">
            <Link to="/rider">
              <Button
                variant="primary"
                size="md"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md cursor-pointer"
                leftIcon={<Bike className="w-4 h-4" />}
              >
                🛵 Open Rider App (Blinkit Mode)
              </Button>
            </Link>

            <Button
              variant="harvest"
              size="md"
              className="font-black text-slate-900 shadow-md shadow-emerald-500/10 cursor-pointer"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsInwardModalOpen(true)}
            >
              Inward Farm Produce
            </Button>
          </div>
        </div>
      </div>

      {/* Hub Operational Status & Cold Vault Telemetry Banner */}
      <Card className="p-5 border-emerald-200/80 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          
          {/* Store Info */}
          <div className="space-y-1 md:border-r md:border-emerald-800/40 md:pr-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-black text-white">{activeStore.name}</h3>
            </div>
            <p className="text-xs text-emerald-200/80 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {activeStore.address}, {activeStore.city} ({activeStore.pincode})
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-700/50">
                Code: {activeStore.code}
              </span>
              <span className="text-[10px] font-bold text-slate-300">
                Mgr: {activeStore.managerName}
              </span>
            </div>
          </div>

          {/* Cold Vault Climate Control */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                Cold Vault Chiller
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                {activeStore.temperatureCelsius <= 5 ? 'Optimal' : 'Elevated'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-cyan-300">
                {activeStore.temperatureCelsius}°C
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleTempAdjust(-0.5)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors text-xs"
                  title="Lower chiller temperature"
                >
                  -0.5
                </button>
                <button
                  type="button"
                  onClick={() => handleTempAdjust(0.5)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors text-xs"
                  title="Raise chiller temperature"
                >
                  +0.5
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-400" /> Humidity: 86% RH
              </span>
              <span>Target: 2°C - 5°C</span>
            </div>
          </div>

          {/* Active EV Rider Fleet */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-emerald-400" />
                EV Express Riders
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                ⚡ ~{activeStore.estimatedDeliveryMinutes}m SLA
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-emerald-300">
                {activeStore.activeRidersCount} <span className="text-xs text-slate-400 font-normal">Active</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleRidersAdjust(-1)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors text-xs"
                  title="Decrease rider on duty"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => handleRidersAdjust(1)}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition-colors text-xs"
                  title="Add rider on duty"
                >
                  +1
                </button>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Radius: {activeStore.deliveryRadiusKm} km • Hours: {activeStore.operatingHours}
            </div>
          </div>

          {/* Store Online Status Toggle */}
          <div className="flex flex-col justify-center items-start md:items-end space-y-2">
            <button
              type="button"
              onClick={handleToggleStoreStatus}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                activeStore.isOpen
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${activeStore.isOpen ? 'bg-slate-950 animate-ping' : 'bg-white'}`} />
              {activeStore.isOpen ? 'HUB LIVE & ACCEPTING ORDERS' : 'STORE CURRENTLY PAUSED'}
            </button>
            <span className="text-[11px] text-slate-400">
              {activeStore.coveredLocalities.length} Localities in Delivery Zone
            </span>
          </div>

        </div>
      </Card>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Produce In Stock"
          value={`${totalStockKg.toLocaleString()} kg`}
          subtitle={`${inventoryItems.length} active SKUs available`}
          icon={Package}
          color="emerald"
        />

        <StatCard
          title="Stock Valuation (Est.)"
          value={`₹${totalValuation.toLocaleString('en-IN')}`}
          subtitle="At current retail pricing"
          icon={DollarSign}
          color="blue"
        />

        <StatCard
          title="Low Stock Warning"
          value={lowStockCount}
          subtitle={lowStockCount > 0 ? "Consignments below 25 kg" : "All SKUs well stocked"}
          icon={AlertTriangle}
          color={lowStockCount > 0 ? "amber" : "emerald"}
        />

        <StatCard
          title="Active Express Orders"
          value={storeDispatches.filter(d => d.status !== 'Delivered').length}
          subtitle={`${storeDispatches.length} total today`}
          icon={Zap}
          color="emerald"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'INVENTORY'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            Produce Inventory & Stock ({inventoryItems.length})
          </button>

          <button
            onClick={() => setActiveTab('DISPATCHES')}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'DISPATCHES'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bike className="w-4 h-4" />
            Live Express Dispatches ({storeDispatches.length})
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          Live sync with QuickMart customer orders
        </span>
      </div>

      {/* TAB 1: INVENTORY MANAGEMENT */}
      {activeTab === 'INVENTORY' && (
        <div className="space-y-6">
          
          {/* Controls & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by crop, variety, batch ID or farmer..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-800 shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setStockStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  stockStatusFilter === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All ({inventoryItems.length})
              </button>

              <button
                onClick={() => setStockStatusFilter('IN_STOCK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  stockStatusFilter === 'IN_STOCK'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                In Stock ({inventoryItems.filter(i => i.stockKg > 0).length})
              </button>

              <button
                onClick={() => setStockStatusFilter('LOW_STOCK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  stockStatusFilter === 'LOW_STOCK'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                Low Stock &lt;25kg ({lowStockCount})
              </button>

              <button
                onClick={() => setStockStatusFilter('OUT_OF_STOCK')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  stockStatusFilter === 'OUT_OF_STOCK'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
                }`}
              >
                Out of Stock ({outOfStockCount})
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <Card className="border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3.5 px-4">Produce Spec & Batch</th>
                    <th className="py-3.5 px-4">Origin Farmer</th>
                    <th className="py-3.5 px-4">Quality & Harvest</th>
                    <th className="py-3.5 px-4">Stock Level (kg)</th>
                    <th className="py-3.5 px-4">Retail Price</th>
                    <th className="py-3.5 px-4 text-center">Quick Adjust Stock</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Package className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold">No inventory items matched your filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const isLow = item.stockKg > 0 && item.stockKg < 25;
                      const isOut = item.stockKg === 0;

                      return (
                        <tr key={item.cropId} className="hover:bg-slate-50/60 transition-colors">
                          
                          {/* Produce Spec & Batch */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-black text-slate-900 text-sm">
                                  {item.cropName}
                                </span>
                                {item.isOrganic && (
                                  <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                                    🌱 Organic
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-500">{item.cropVariety}</p>
                              <button
                                type="button"
                                onClick={() => setSelectedTraceCrop({
                                  name: item.cropName,
                                  batchId: item.batchId,
                                  farmerName: item.farmerName,
                                  price: item.pricePerKg
                                })}
                                className="font-mono text-[10px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 inline-flex items-center gap-1 transition-colors"
                              >
                                <QrCode className="w-3 h-3 text-blue-600" />
                                {item.batchId}
                              </button>
                            </div>
                          </td>

                          {/* Sourced Farmer */}
                          <td className="py-4 px-4">
                            <p className="font-bold text-slate-800">{item.farmerName}</p>
                            <p className="text-slate-400 text-[11px] flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {item.farmerVillage}
                            </p>
                          </td>

                          {/* Quality & Harvest */}
                          <td className="py-4 px-4 space-y-1">
                            <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              {item.qualityGrade}
                            </span>
                            <p className="text-[11px] text-slate-500">
                              Harvested: {item.freshnessHarvestDate}
                            </p>
                          </td>

                          {/* Stock Level Progress */}
                          <td className="py-4 px-4">
                            <div className="space-y-1.5 min-w-[120px]">
                              <div className="flex items-center justify-between font-black">
                                <span className={`text-sm ${
                                  isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-700'
                                }`}>
                                  {item.stockKg} kg
                                </span>
                                <Badge variant={isOut ? 'rose' : isLow ? 'amber' : 'emerald'} size="sm">
                                  {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Good'}
                                </Badge>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (item.stockKg / 100) * 100)}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-slate-400 block">
                                Packs: {item.packSizesAvailableKg.join('kg, ')}kg
                              </span>
                            </div>
                          </td>

                          {/* Retail Price */}
                          <td className="py-4 px-4">
                            <span className="text-sm font-black text-slate-900 block">
                              ₹{item.pricePerKg}/kg
                            </span>
                            <span className="text-[10px] text-slate-400">
                              MRP Max: ₹{Math.round(item.pricePerKg * 1.15)}
                            </span>
                          </td>

                          {/* Quick Adjust Buttons */}
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                              <button
                                type="button"
                                onClick={() => handleQuickAdjust(item.cropId, item.stockKg, -5)}
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 font-black rounded-lg text-xs shadow-2xs transition-colors"
                                title="Deduct 5 kg"
                              >
                                -5
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickAdjust(item.cropId, item.stockKg, 10)}
                                className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-700 font-black rounded-lg text-xs shadow-2xs transition-colors"
                                title="Add 10 kg"
                              >
                                +10
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickAdjust(item.cropId, item.stockKg, 25)}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-xs shadow-2xs transition-colors"
                                title="Add 25 kg crate"
                              >
                                +25
                              </button>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                                title="Edit Stock & Pricing"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeDarkStoreInventoryItem(activeStore.id, item.cropId)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition-colors"
                                title="Remove Item from Vault"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: LIVE EXPRESS DISPATCHES QUEUE */}
      {activeTab === 'DISPATCHES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                Live 15-Minute Express Dispatches Queue
              </h2>
              <p className="text-xs text-slate-500">
                Orders dispatched from {activeStore.name} to customer doorsteps
              </p>
            </div>
          </div>

          {storeDispatches.length === 0 ? (
            <Card className="p-12 text-center text-slate-400 border-slate-200">
              <Bike className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold">No active dispatches currently assigned to this hub.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {storeDispatches.map((disp) => {
                return (
                  <Card key={disp.id} className="p-5 border-slate-200 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                          <Bike className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-slate-900">{disp.deliveryId}</span>
                            <span className="text-xs text-slate-400 font-mono">({disp.orderNumber})</span>
                            <Badge variant={disp.status === 'Delivered' ? 'emerald' : 'blue'} size="sm">
                              {disp.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-slate-500 block">
                            Rider: <strong className="text-slate-800">{disp.driverName || 'EV Courier'}</strong> ({disp.driverPhone}) • {disp.vehicleInfo}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Consignment</span>
                        <span className="text-sm font-black text-slate-900">{disp.quantity} kg • {disp.cropName}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Hub Vault Origin</span>
                        <p className="font-semibold text-slate-800">{disp.pickupLocation}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Drop Location</span>
                        <p className="font-semibold text-slate-800 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          {disp.deliveryLocation}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Cold-Pack Insulated Status</span>
                        <p className="font-semibold text-emerald-700 flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5" />
                          Insulated Vault Pack: {activeStore.temperatureCelsius}°C
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        {disp.trackingNotes}
                      </span>

                      {disp.status !== 'Delivered' ? (
                        <Button
                          variant="harvest"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                          onClick={() => setSelectedDispatchForOtp(disp)}
                          leftIcon={<KeyRound className="w-4 h-4" />}
                        >
                          🔑 Authenticate Doorstep Handover (Verify OTP)
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-black">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Delivered & Handover PIN Verified ({disp.deliveryOtp || '4829'})</span>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: INWARD NEW FRESH PRODUCE BATCH */}
      {isInwardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-6 animate-fade-in my-8">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Inward Fresh Produce to Vault</h3>
                  <p className="text-xs text-slate-500">Add or restock items into {activeStore.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInwardModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInwardSubmit} className="space-y-4">
              
              {/* Optional: Autofill from listed farm crops */}
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-1.5">
                <label className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Quick Autofill from Platform Farmers (Optional)
                </label>
                <select
                  onChange={(e) => handleSelectPlatformCrop(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="">-- Choose verified farmer harvest --</option>
                  {crops.filter(c => c.status === 'ACTIVE').map(c => (
                    <option key={c.id} value={c.id}>
                      {c.cropName} ({c.cropVariety}) - {c.farmerName}, {c.farmerVillage || c.location} (₹{c.pricePerKg}/kg)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Produce Name *</label>
                  <input
                    type="text"
                    required
                    value={inwardForm.cropName}
                    onChange={(e) => setInwardForm(prev => ({ ...prev, cropName: e.target.value }))}
                    placeholder="e.g. Tomatoes (Hybrid)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Variety / Grade</label>
                  <input
                    type="text"
                    value={inwardForm.cropVariety}
                    onChange={(e) => setInwardForm(prev => ({ ...prev, cropVariety: e.target.value }))}
                    placeholder="e.g. F1 Abhinav Prime"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Origin Farmer Name</label>
                  <input
                    type="text"
                    value={inwardForm.farmerName}
                    onChange={(e) => setInwardForm(prev => ({ ...prev, farmerName: e.target.value }))}
                    placeholder="e.g. Ravi Kumar"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Village / Region</label>
                  <input
                    type="text"
                    value={inwardForm.farmerVillage}
                    onChange={(e) => setInwardForm(prev => ({ ...prev, farmerVillage: e.target.value }))}
                    placeholder="e.g. Kanchikacherla"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Inward Stock (kg) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={inwardForm.stockKg}
                    onChange={(e) => setInwardForm(prev => ({ ...prev, stockKg: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Retail Price (₹/kg) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={inwardForm.pricePerKg}
                    onChange={(e) => setInwardForm(prev => ({ ...prev, pricePerKg: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pack Sizes (kg)</label>
                  <input
                    type="text"
                    value={inwardForm.packSizesStr}
                    onChange={(e) => setInwardForm(prev => ({ ...prev, packSizesStr: e.target.value }))}
                    placeholder="0.5, 1, 2"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quality Certification</label>
                  <select
                    value={inwardForm.qualityGrade}
                    onChange={(e) => setInwardForm(prev => ({ ...prev, qualityGrade: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Grade A+ Super Prime">Grade A+ Super Prime (100% Fresh)</option>
                    <option value="Grade A Export Quality">Grade A Export Quality</option>
                    <option value="Grade B+ Standard Direct">Grade B+ Standard Direct</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Harvest Date</label>
                  <input
                    type="date"
                    value={inwardForm.freshnessHarvestDate}
                    onChange={(e) => setInwardForm(prev => ({ ...prev, freshnessHarvestDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isOrganicCheck"
                  checked={inwardForm.isOrganic}
                  onChange={(e) => setInwardForm(prev => ({ ...prev, isOrganic: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="isOrganicCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Certified Chemical-Free / Organic Produce
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInwardModalOpen(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="harvest"
                  size="sm"
                  className="font-black text-slate-900"
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save & Inward to Vault
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT STOCK & PRICE */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Update Stock & Pricing
                </h3>
                <p className="text-xs text-slate-500">{editingItem.cropName} ({editingItem.cropVariety})</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Available Stock (kg)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editStockKg}
                  onChange={(e) => setEditStockKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Retail Price (₹/kg)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editPricePerKg}
                  onChange={(e) => setEditPricePerKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="harvest"
                  size="sm"
                  className="font-black text-slate-900"
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Update Vault Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {selectedDispatchForOtp && (
        <OtpVerificationModal
          isOpen={Boolean(selectedDispatchForOtp)}
          onClose={() => setSelectedDispatchForOtp(null)}
          orderNumber={selectedDispatchForOtp.orderNumber || selectedDispatchForOtp.deliveryId}
          expectedOtp={selectedDispatchForOtp.deliveryOtp || '4829'}
          recipientName="Doorstep Customer"
          deliveryLocation={selectedDispatchForOtp.deliveryLocation}
          cropName={selectedDispatchForOtp.cropName}
          quantityKg={selectedDispatchForOtp.quantity}
          riderName={selectedDispatchForOtp.driverName || selectedDispatchForOtp.riderName}
          onSuccess={(verifiedOtp) => {
            verifyDeliveryOtp(selectedDispatchForOtp.id, verifiedOtp);
            setSelectedDispatchForOtp(null);
          }}
        />
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
