import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateAIHarvestEstimate } from '../../services/aiEngine';
import { 
  Sprout, 
  Calendar, 
  ShoppingCart, 
  TrendingUp, 
  HeartHandshake, 
  Bell, 
  Plus, 
  ArrowRight, 
  CloudSun, 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  ChevronRight, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { AddCropUpdateModal } from './AddCropUpdateModal';

export const FarmerDashboard: React.FC = () => {
  const { currentUser, farmerProfile } = useAuth();
  const { crops, orders, supportRecords, fundingAgreements, notifications, cropUpdates } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [selectedCropForUpdate, setSelectedCropForUpdate] = useState<string | null>(null);

  // Filter crops belonging to this farmer (or all for demo)
  const myCrops = crops.filter(
    c => c.farmerId === farmerProfile?.id || c.farmerId === currentUser?.id || c.farmerId === 'farmer_ravi'
  );

  const myOrders = orders.filter(
    o => o.farmerId === farmerProfile?.id || o.farmerId === currentUser?.id || o.farmerId === 'farmer_ravi'
  );

  const pendingOrders = myOrders.filter(o => o.status === 'REQUESTED' || o.status === 'ACCEPTED');
  const totalSales = myOrders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalSupportValue = supportRecords.reduce((sum, s) => sum + s.supportValue, 0) +
    fundingAgreements.reduce((sum, f) => sum + f.amount, 0);

  const unreadNotifs = notifications.filter(
    n => (n.userId === currentUser?.id || n.userId === `user_${currentUser?.id}`) && !n.isRead
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome & Farm Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald" className="bg-emerald-600/60 text-emerald-100 border-emerald-400/40">
              🌾 Farmer Portal
            </Badge>
            {currentUser?.isVerified ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-200 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Admin Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-200 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/40">
                <Clock className="w-3.5 h-3.5" /> Verification Pending
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Namaste, {currentUser?.fullName || 'Ravi Kumar'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            {farmerProfile?.village}, {farmerProfile?.district}, {farmerProfile?.state} • {farmerProfile?.landSize} Acres ({farmerProfile?.soilType}) • Model: <span className="font-bold text-amber-300">{farmerProfile?.farmerType}</span>
          </p>
        </div>

        {/* Weather & Soil Quick Widget */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-xs flex items-center gap-4 relative z-10 sm:self-center">
          <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">31°C</span>
              <span className="text-emerald-200">Sunny / Optimal</span>
            </div>
            <p className="text-[11px] text-emerald-100 mt-0.5 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-cyan-300" /> Soil Moisture: 68% • Fertigation Ready
            </p>
          </div>
        </div>
      </div>

      {/* 6 Required Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title={t('nav.myCrops', 'Active Crops')}
          value={myCrops.length}
          subtitle="Under cultivation"
          icon={Sprout}
          color="emerald"
        />
        <StatCard
          title="Harvests Soon"
          value={myCrops.filter(c => c.growthStage === 'Fruiting' || c.growthStage === 'Maturing').length}
          subtitle="Next 30 days"
          icon={Calendar}
          color="amber"
        />
        <StatCard
          title={t('nav.orders', 'Buyer Orders')}
          value={pendingOrders.length}
          subtitle="Pending action"
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Sales"
          value={`₹${totalSales.toLocaleString('en-IN')}`}
          subtitle="Verified payments"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title={t('nav.support', 'Funding/Support')}
          value={`₹${totalSupportValue.toLocaleString('en-IN')}`}
          subtitle="Grants & capital"
          icon={HeartHandshake}
          color="purple"
        />
        <StatCard
          title={t('nav.notifications', 'Alerts')}
          value={unreadNotifs.length}
          subtitle="Unread notices"
          icon={Bell}
          color="rose"
        />
      </div>

      {/* Action Header for My Crops */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {t('nav.myCrops', 'My Crops')} <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{myCrops.length}</span>
            </h2>
            <p className="text-xs text-slate-500">Manage listings, monitor growth stages & track AI harvest forecasts</p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/farmer/crops/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                + {t('action.submit', 'Add Crop')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCrops.map((crop) => {
            const updates = cropUpdates.filter(u => u.cropId === crop.id);
            const aiEstimate = calculateAIHarvestEstimate(crop, updates);

            return (
              <Card key={crop.id} hover className="border-slate-200 flex flex-col justify-between overflow-hidden group">
                <div>
                  {/* Image & Stage Header */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={crop.imageUrl}
                      alt={crop.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="emerald" size="sm" className="bg-white/95 backdrop-blur shadow-sm">
                        {crop.growthStage}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="amber" size="sm" className="bg-slate-900/90 text-amber-300 border-amber-500/50 shadow-sm font-bold">
                        ₹{crop.pricePerKg}/kg
                      </Badge>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {crop.cropName}
                        </h3>
                        <p className="text-xs text-slate-500">{crop.cropVariety} • {crop.landArea} Acres</p>
                      </div>
                      <Badge variant={crop.farmerType === 'Funded' ? 'emerald' : crop.farmerType === 'Free-Support' ? 'amber' : 'slate'} size="sm">
                        {crop.farmerType}
                      </Badge>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Available Qty</span>
                        <span className="font-bold text-slate-800">{crop.availableQuantity.toLocaleString()} kg</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Harvest Target</span>
                        <span className="font-bold text-slate-800">{crop.expectedHarvestDate}</span>
                      </div>
                    </div>

                    {/* AI Harvest Estimate Pill */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <div>
                          <span className="text-[11px] font-bold text-emerald-950 block">AI Harvest Estimate</span>
                          <span className="text-[10px] text-emerald-800 font-medium">
                            {aiEstimate.daysRemaining === 0 ? 'Ready for Harvest!' : `~${aiEstimate.daysRemaining} days remaining`} ({aiEstimate.confidencePercentage}% conf.)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Buyer Interest */}
                    <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                        Buyer Interest: <strong className="text-emerald-700">High (96% Match)</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedCropForUpdate(crop.id)}
                    className="flex-1 py-2 px-3 bg-white border border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5" /> Upload Update
                  </button>

                  <Link to={`/farmer/crops/${crop.id}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Access to Orders & Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Orders Card */}
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Recent Buyer Requests</h3>
            </div>
            <Link to="/farmer/orders" className="text-xs text-emerald-600 hover:underline font-bold flex items-center">
              View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {myOrders.slice(0, 2).map((order) => (
              <div key={order.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{order.buyerBusinessName}</span>
                    <Badge variant={order.status === 'ACCEPTED' ? 'emerald' : 'blue'} size="sm">
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.quantity} kg of {order.cropName} • ₹{order.totalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <Link to="/farmer/orders">
                  <Button variant="outline" size="sm" className="text-xs">
                    Review
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        {/* Funding & Free Support Summary Card */}
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Funding & Free-Support Status</h3>
            </div>
            <Link to="/farmer/support" className="text-xs text-emerald-600 hover:underline font-bold flex items-center">
              Explore Grants <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {supportRecords.map((sup) => (
              <div key={sup.id} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="amber" size="sm">Free CSR Grant</Badge>
                    <span className="text-xs font-bold text-slate-900">{sup.supportType}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Sponsored by {sup.sponsorName} • Worth ₹{sup.supportValue.toLocaleString('en-IN')}
                  </p>
                </div>
                <Badge variant="emerald" size="sm">Disbursed</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upload Crop Update Modal */}
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
