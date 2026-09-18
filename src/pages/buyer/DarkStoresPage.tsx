import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
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
  Star, 
  ArrowRight,
  Package,
  Layers,
  Activity,
  AlertCircle,
  Truck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { DarkStoreSelectorModal } from '../../components/darkstore/DarkStoreSelectorModal';
import { RealDarkStoresMap } from '../../components/maps/RealDarkStoresMap';

export const DarkStoresPage: React.FC = () => {
  const { darkStores } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [pincodeCheckInput, setPincodeCheckInput] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ store: DarkStore; distance: string } | null>(null);
  const [hasSearchedPincode, setHasSearchedPincode] = useState(false);
  const [selectedStoreForDetail, setSelectedStoreForDetail] = useState<DarkStore | null>(null);

  const cities = ['ALL', ...Array.from(new Set(darkStores.map(ds => ds.city)))];

  const totalInventoryKg = darkStores.reduce(
    (sum, ds) => sum + ds.inventory.reduce((iSum, i) => iSum + i.stockKg, 0), 0
  );
  const totalRiders = darkStores.reduce((sum, ds) => sum + ds.activeRidersCount, 0);

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

  const handlePincodeLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeCheckInput.trim()) return;

    setHasSearchedPincode(true);
    const q = pincodeCheckInput.trim().toLowerCase();

    const matched = darkStores.find(ds => {
      if (ds.pincode.includes(q)) return true;
      if (ds.locality.toLowerCase().includes(q) || ds.city.toLowerCase().includes(q)) return true;
      return ds.coveredLocalities.some(l => l.toLowerCase().includes(q));
    });

    if (matched) {
      setPincodeResult({ store: matched, distance: '1.8 km' });
    } else {
      setPincodeResult(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-emerald-500/20">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="emerald" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
              ⚡ FarmSync Hyperlocal Quick-Commerce
            </Badge>
            <span className="text-xs text-amber-300 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
              ⚡ Max ₹10 Delivery Fee (FREE on ₹99+)
            </span>
            <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Direct Farm Freshness • Zero Delay
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Hyperlocal Agri Dark Stores Network
          </h1>
          
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Eliminate long delivery waiting times for household needs. Our micro-fulfillment dark stores are stationed inside urban neighborhoods, continuously replenished with pre-graded, cold-chain protected crops directly from verified local farmers.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/buyer/marketplace">
              <Button
                variant="harvest"
                size="md"
                className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20"
                rightIcon={<ArrowRight className="w-4 h-4 text-slate-950" />}
              >
                Shop Home Needs Express (15m)
              </Button>
            </Link>

            <Link to="/dark-store/manage">
              <Button
                variant="outline"
                size="md"
                className="border-emerald-400/60 text-emerald-300 hover:bg-emerald-900/40 font-bold"
                leftIcon={<Package className="w-4 h-4 text-emerald-400" />}
              >
                Hub Stock & Operations Manager
              </Button>
            </Link>

            <Link to="/rider">
              <Button
                variant="outline"
                size="md"
                className="border-emerald-400/60 text-emerald-300 hover:bg-emerald-900/40 font-bold cursor-pointer"
                leftIcon={<Bike className="w-4 h-4 text-emerald-400" />}
              >
                🛵 Rider Partner App
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Grid BG */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Dark Stores"
          value={darkStores.length}
          subtitle="Neighborhood micro-hubs"
          icon={Building2}
          color="emerald"
        />
        <StatCard
          title="Avg Delivery Speed"
          value="17.4 Mins"
          subtitle="From store to doorstep"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Active EV Fleet"
          value={`${totalRiders} Riders`}
          subtitle="On-demand dispatchers"
          icon={Bike}
          color="purple"
        />
        <StatCard
          title="Cold Vault Fresh Stock"
          value={`${totalInventoryKg.toLocaleString()} kg`}
          subtitle="Direct from verified farms"
          icon={Thermometer}
          color="amber"
        />
      </div>

      {/* Pincode & Locality Delivery Coverage Checker */}
      <Card className="p-6 sm:p-8 border-slate-200 bg-gradient-to-r from-emerald-50/70 via-white to-blue-50/70 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-600" />
              Check Dark Store 15-Minute Coverage in Your Locality
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your PIN code (e.g. 520010, 500034, 560038) or area name to find your neighborhood micro-hub
            </p>
          </div>

          <form onSubmit={handlePincodeLookup} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="e.g. 520010 or Benz Circle"
              value={pincodeCheckInput}
              onChange={(e) => setPincodeCheckInput(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
            />
            <Button type="submit" variant="primary" size="md" className="shrink-0 text-xs font-bold">
              Check Area
            </Button>
          </form>
        </div>

        {hasSearchedPincode && (
          <div className="pt-2 animate-fade-in">
            {pincodeResult ? (
              <div className="p-4 bg-emerald-100/80 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black flex items-center gap-1.5">
                      🎉 15-Minute Express Delivery Available in Your Area!
                    </h4>
                    <p className="text-[11px] text-emerald-800">
                      Fulfilled by <strong>{pincodeResult.store.name}</strong> ({pincodeResult.distance} away • ~{pincodeResult.store.estimatedDeliveryMinutes} min delivery).
                    </p>
                  </div>
                </div>

                <Link to="/buyer/marketplace">
                  <Button variant="harvest" size="sm" className="text-xs font-black">
                    Start Shopping Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-bold block">No express dark store located within 5km for "{pincodeCheckInput}".</span>
                  <span className="text-[11px] text-amber-700">
                    Standard 24-hour direct farm dispatch is still active for your region!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Interactive Real Geographic Map of Dark Stores */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Live Dark Stores Geographic Map & 15-Min Delivery Radii
            </h2>
            <p className="text-xs text-slate-500">
              Real OpenStreetMap tiles with micro-hub cold vaults and on-duty express delivery riders
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Click any pin to inspect inventory & select hub
          </span>
        </div>

        <RealDarkStoresMap
          darkStores={darkStores}
          selectedStoreId={pincodeResult?.store.id}
          onSelectStore={(store) => {
            localStorage.setItem('farmsync_selected_darkstore_id', store.id);
            navigate('/buyer/marketplace');
          }}
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Explore All Micro-Fulfillment Dark Store Hubs
          </h2>
          <p className="text-xs text-slate-500">Live inventory, cold vault temperatures, and rider availability</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search dark store..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            {cities.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'All Cities' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dark Stores Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map(store => {
          const totalStock = store.inventory.reduce((sum, item) => sum + item.stockKg, 0);

          return (
            <Card key={store.id} hover className="p-6 border-slate-200 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-base font-black text-slate-900">{store.name}</span>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-200">
                        {store.code}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">{store.locality}, {store.city}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0">
                    ● Open Now
                  </span>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block">Delivery ETA</span>
                    <span className="text-sm font-black text-emerald-950 flex items-center justify-center gap-0.5 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" /> {store.estimatedDeliveryMinutes}m
                    </span>
                  </div>

                  <div className="p-2.5 bg-cyan-50 rounded-xl border border-cyan-100">
                    <span className="text-[10px] text-cyan-700 font-bold uppercase block">Cold Vault</span>
                    <span className="text-sm font-black text-cyan-950 flex items-center justify-center gap-0.5 mt-0.5">
                      <Thermometer className="w-3.5 h-3.5 text-cyan-600" /> {store.temperatureCelsius}°C
                    </span>
                  </div>

                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="text-[10px] text-amber-700 font-bold uppercase block">Active Fleet</span>
                    <span className="text-sm font-black text-amber-950 flex items-center justify-center gap-0.5 mt-0.5">
                      <Bike className="w-3.5 h-3.5 text-amber-600" /> {store.activeRidersCount}
                    </span>
                  </div>
                </div>

                {/* Location & Radius info */}
                <div className="text-xs text-slate-600 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{store.address}</span>
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Operating: <strong className="text-slate-700">{store.operatingHours}</strong></span>
                    <span>Radius: <strong className="text-slate-700">{store.deliveryRadiusKm} km</strong></span>
                  </div>
                </div>

                {/* Live Inventory Preview */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-emerald-600" />
                      Live Fresh Inventory ({totalStock} kg):
                    </span>
                    <span className="text-[10px] text-slate-400">Restocked 5:00 AM</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {store.inventory.map(item => (
                      <span
                        key={item.cropId}
                        className="text-[11px] font-semibold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200 flex items-center gap-1"
                      >
                        <span>{item.cropName}</span>
                        <span className="font-mono text-[10px] text-emerald-700 font-bold">({item.stockKg}kg)</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Covered Neighborhoods */}
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Coverage Localities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {store.coveredLocalities.map(loc => (
                      <span key={loc} className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link to="/buyer/marketplace" className="w-full">
                  <Button
                    variant="harvest"
                    size="sm"
                    className="w-full text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-slate-950"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Order Express from this Hub
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* How It Works Explainer */}
      <Card className="p-6 sm:p-8 border-slate-200 bg-slate-900 text-white space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Dual Fulfillment Logistics Architecture
          </span>
          <h3 className="text-2xl font-black">
            How FarmSync Delivers Home Needs in 15 Mins While Serving Bulk Vendors
          </h3>
          <p className="text-xs text-slate-300">
            A hybrid supply chain uniting rural farmer empowerment with state-of-the-art urban quick-commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Home Needs Flow */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">1. Home Consumers (Daily Needs)</h4>
                <p className="text-[11px] text-emerald-300">⚡ 15–30 Minute Hyperlocal Delivery</p>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Customer selects retail packs (0.5 kg, 1 kg, 2 kg) from nearest neighborhood dark store.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Produce is packed inside climate-controlled 5°C cold vault within 2 minutes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Dedicated EV cargo rider dispatched immediately to doorstep with live arrival countdown.</span>
              </li>
            </ul>
          </div>

          {/* Vendor Bulk Flow */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-blue-500/30 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">2. Mandi Traders & Bulk Vendors</h4>
                <p className="text-[11px] text-blue-300">Standard Farm-to-Business Logistics</p>
              </div>
            </div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Wholesalers order bulk harvest lots (500 kg to 50,000 kg) directly from farm gate.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Scheduled harvesting, APMC lot inspections, and multi-ton cold-chain freight transit.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Full GST / APMC invoicing, smart escrow release, and crop traceability certificates.</span>
              </li>
            </ul>
          </div>

        </div>
      </Card>

    </div>
  );
};
