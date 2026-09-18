import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  ShoppingBag, 
  Sparkles, 
  Package, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  FileText, 
  Plus, 
  ArrowRight, 
  DollarSign, 
  Building,
  Building2,
  MapPin,
  ChevronRight,
  Zap,
  Bike,
  Thermometer
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { PostRequirementModal } from './PostRequirementModal';

export const BuyerDashboard: React.FC = () => {
  const { currentUser, buyerProfile } = useAuth();
  const { buyerRequirements, crops, orders, darkStores, getNearestDarkStore } = useData();
  const navigate = useNavigate();

  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);

  const userCity = buyerProfile?.operatingCity || currentUser?.operatingLocation || 'Vijayawada';
  const nearestStore = getNearestDarkStore(userCity) || darkStores[0];

  const myRequirements = buyerRequirements.filter(
    r => r.buyerId === buyerProfile?.id || r.buyerId === currentUser?.id || r.buyerId === 'buyer_freshmart'
  );

  const myOrders = orders.filter(
    o => o.buyerId === buyerProfile?.id || o.buyerId === currentUser?.id || o.buyerId === 'buyer_freshmart'
  );

  const pendingOrders = myOrders.filter(o => o.status !== 'DELIVERED' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const completedOrders = myOrders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED');
  const totalPurchases = myOrders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="blue" className="bg-blue-600/50 text-blue-100 border-blue-400/40">
              🛒 Buyer Procurement Hub
            </Badge>
            {currentUser?.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Commercial Off-Taker
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {buyerProfile?.businessName || currentUser?.fullName || 'FreshMart Wholesale'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            {buyerProfile?.businessType} • Operating Hub: {buyerProfile?.operatingCity} • GST: {buyerProfile?.gstNumber || '37AAAAA0000A1Z5'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:self-center">
          <Button
            variant="harvest"
            size="md"
            onClick={() => setIsRequirementModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4 text-slate-900" />}
          >
            Post New Requirement
          </Button>

          <Link to="/buyer/marketplace">
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              leftIcon={<Search className="w-4 h-4" />}
            >
              Marketplace
            </Button>
          </Link>
        </div>
      </div>

      {/* NEAREST DARK STORE LIVE STATUS BAR */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-500/30">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-white">⚡ Nearest Dark Store: {nearestStore.name}</span>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                {nearestStore.estimatedDeliveryMinutes} Min Delivery Ready
              </span>
              <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1">
                <Thermometer className="w-3 h-3" /> {nearestStore.temperatureCelsius}°C Cold Vault
              </span>
              <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                <Bike className="w-3 h-3" /> {nearestStore.activeRidersCount} Active Riders
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              Need fresh vegetables or fruits for home today? Get hassle-free 15-minute express delivery from your local neighborhood dark store.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          <Link to="/buyer/dark-stores">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-bold"
            >
              Explore Hubs
            </Button>
          </Link>
          <Link to="/buyer/marketplace">
            <Button
              variant="harvest"
              size="sm"
              className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 text-xs font-black"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Shop Home Needs
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Buyer Dashboard KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Active Demands"
          value={myRequirements.length}
          subtitle="Open requirements"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="AI Matches"
          value={crops.length}
          subtitle="Recommended crops"
          icon={Sparkles}
          color="purple"
        />
        <StatCard
          title="In Transit / Pending"
          value={pendingOrders.length}
          subtitle="Active dispatches"
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={completedOrders.length}
          subtitle="Fulfillments"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Purchases"
          value={`₹${totalPurchases.toLocaleString('en-IN')}`}
          subtitle="Escrow transactions"
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Recommended Crops from Verified Farmers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              AI Recommended Crops Available for Bulk Order
            </h2>
            <p className="text-xs text-slate-500">Curated high-match crops from verified local producers</p>
          </div>

          <Link to="/buyer/marketplace" className="text-xs text-emerald-600 hover:underline font-bold flex items-center">
            Explore All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.slice(0, 3).map((crop) => (
            <Card key={crop.id} hover className="border-slate-200 flex flex-col justify-between overflow-hidden group">
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="emerald" size="sm" className="bg-white/95 backdrop-blur shadow-sm">
                      {crop.farmerDistrict}, {crop.farmerState}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="amber" size="sm" className="bg-slate-900/90 text-amber-300 font-bold">
                      ₹{crop.pricePerKg}/kg
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {crop.cropName}
                      </h3>
                      <p className="text-xs text-slate-500">{crop.cropVariety} • {crop.farmingMethod}</p>
                    </div>
                    <Badge variant="purple" size="sm">94% AI Match</Badge>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                      {crop.farmerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{crop.farmerName}</span>
                      <span className="text-[10px] text-slate-400">Available: {crop.availableQuantity.toLocaleString()} kg</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">Harvest: {crop.expectedHarvestDate}</span>
                <Link to={`/buyer/marketplace`}>
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View & Order
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Requirements List */}
      <Card className="p-6 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Active Procurement Requirements</h3>
              <p className="text-xs text-slate-500">Requirements currently being matched by the AI engine</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRequirementModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Post Demand
          </Button>
        </div>

        <div className="divide-y divide-slate-100">
          {myRequirements.map((req) => (
            <div key={req.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{req.cropType}</span>
                  <Badge variant="emerald" size="sm">{req.requiredQuantity.toLocaleString()} kg</Badge>
                  <Badge variant="blue" size="sm">Max ₹{req.maxPricePerKg}/kg</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Required by {req.requiredByDate} • Delivery Yard: {req.deliveryLocation}
                </p>
              </div>

              <Link to="/buyer/ai-recommendations">
                <Button variant="primary" size="sm" className="text-xs" rightIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  View AI Matches
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>

      {/* Post Requirement Modal */}
      <PostRequirementModal
        isOpen={isRequirementModalOpen}
        onClose={() => setIsRequirementModalOpen(false)}
      />

    </div>
  );
};
