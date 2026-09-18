import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { DarkStore } from '../../types';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Zap, 
  Navigation, 
  CheckCircle2, 
  Thermometer, 
  Bike, 
  Search, 
  ShieldCheck,
  Star
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RealDarkStoresMap } from '../maps/RealDarkStoresMap';

interface DarkStoreSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStoreId: string;
  onSelectStore: (store: DarkStore) => void;
  currentAddress?: string;
  onAddressChange?: (address: string) => void;
}

export const DarkStoreSelectorModal: React.FC<DarkStoreSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedStoreId,
  onSelectStore,
  currentAddress,
  onAddressChange
}) => {
  const { darkStores } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isLocating, setIsLocating] = useState(false);

  const cities = ['ALL', ...Array.from(new Set(darkStores.map(ds => ds.city)))];

  const filteredStores = darkStores.filter(store => {
    if (selectedCity !== 'ALL' && store.city !== selectedCity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = store.name.toLowerCase().includes(q);
      const matchLoc = store.locality.toLowerCase().includes(q);
      const matchCity = store.city.toLowerCase().includes(q);
      const matchPin = store.pincode.includes(q);
      const matchCovered = store.coveredLocalities.some(c => c.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchCity && !matchPin && !matchCovered) return false;
    }
    return true;
  });

  const handleAutoDetectGPS = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      // Auto-detect to Vijayawada Benz Circle or first available
      const detected = darkStores.find(d => d.code === 'DS-VIJ-01') || darkStores[0];
      if (detected) {
        onSelectStore(detected);
        if (onAddressChange) {
          onAddressChange(`Flat 302, Green Meadows, Benz Circle, ${detected.city}`);
        }
        onClose();
      }
    }, 900);
  };

  const handleManualSelect = (store: DarkStore) => {
    onSelectStore(store);
    if (onAddressChange && (!currentAddress || currentAddress.trim() === '')) {
      onAddressChange(`${store.locality}, ${store.city} - ${store.pincode}`);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Your Nearest Hyperlocal Dark Store"
      maxWidth="lg"
    >
      <div className="space-y-5 text-slate-800">
        
        {/* Banner with GPS Quick Detect */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black flex items-center gap-1.5">
                ⚡ 15–30 Minute Hyperlocal Express Delivery
              </h4>
              <p className="text-[11px] text-emerald-200">
                Fresh farm-harvested produce pre-stocked in cold-vault micro-hubs near your home.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAutoDetectGPS}
            disabled={isLocating}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold border-none shrink-0"
            leftIcon={<Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />}
          >
            {isLocating ? 'Detecting GPS...' : 'Auto-Detect Nearest Hub'}
          </Button>
        </div>

        {/* Address / Search Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by neighborhood, pincode, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Cities' : c}</option>
              ))}
            </select>

            {/* View Mode Toggle: List vs Map */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-emerald-700 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                📋 List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'map'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🗺️ Real Map
              </button>
            </div>
          </div>
        </div>

        {/* Real Map View */}
        {viewMode === 'map' ? (
          <div className="space-y-2">
            <RealDarkStoresMap
              darkStores={filteredStores}
              selectedStoreId={selectedStoreId}
              onSelectStore={handleManualSelect}
              heightClass="h-[340px]"
            />
            <p className="text-[11px] text-slate-400 text-center">
              💡 Tip: Click on any ⚡ dark store marker to view live temperature & select it as your delivery hub.
            </p>
          </div>
        ) : (
          /* List of Dark Stores */
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredStores.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold">No dark stores found matching your location search.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Try searching for Vijayawada, Guntur, Hyderabad, or Bangalore.</p>
            </div>
          ) : (
            filteredStores.map(store => {
              const isSelected = store.id === selectedStoreId;
              return (
                <div
                  key={store.id}
                  onClick={() => handleManualSelect(store)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        {store.name}
                      </span>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-200">
                        {store.code}
                      </span>
                      {store.isOpen ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          ● Open Now
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                          Closed
                        </span>
                      )}
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {store.rating}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {store.address}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500 flex-wrap pt-0.5">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <Clock className="w-3 h-3 text-blue-600" /> ⚡ {store.estimatedDeliveryMinutes} min delivery
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <Thermometer className="w-3 h-3 text-cyan-600" /> Cold Vault: {store.temperatureCelsius}°C
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <Bike className="w-3 h-3 text-emerald-600" /> {store.activeRidersCount} Active Riders
                      </span>
                      <span className="text-slate-400">
                        Radius: {store.deliveryRadiusKm} km
                      </span>
                    </div>

                    <div className="pt-1 flex flex-wrap gap-1">
                      <span className="text-[10px] text-slate-400 font-semibold">Coverage:</span>
                      {store.coveredLocalities.slice(0, 4).map(loc => (
                        <span key={loc} className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          {loc}
                        </span>
                      ))}
                      {store.coveredLocalities.length > 4 && (
                        <span className="text-[10px] text-slate-400">
                          +{store.coveredLocalities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 sm:self-center">
                    {isSelected ? (
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Active Store
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs font-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleManualSelect(store);
                        }}
                      >
                        Select Store
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pre-graded 100% farm-traceable stock replenished daily</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dark-store/manage"
              onClick={onClose}
              className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
            >
              📦 Hub Stock Manager &rarr;
            </Link>

            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
};
