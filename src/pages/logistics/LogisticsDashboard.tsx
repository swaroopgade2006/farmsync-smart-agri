import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Package, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';

export const LogisticsDashboard: React.FC = () => {
  const { currentUser, logisticsProfile } = useAuth();
  const { deliveries } = useData();

  const inTransitCount = deliveries.filter(d => d.status === 'In Transit' || d.status === 'Picked Up').length;
  const scheduledCount = deliveries.filter(d => d.status === 'Assigned' || d.status === 'Pickup Scheduled').length;
  const deliveredCount = deliveries.filter(d => d.status === 'Delivered').length;
  const totalVolumeKg = deliveries.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="blue" className="bg-indigo-600/40 text-indigo-100 border-indigo-400/40">
              🚚 Cold-Chain & Agri Logistics Network
            </Badge>
            {currentUser?.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Carrier Partner
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {logisticsProfile?.companyName || currentUser?.fullName || 'SwiftAgri Logistics'}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
            Fleet: {logisticsProfile?.fleetSize || 24} Vehicles • Operating Coverage: Krishna, Guntur, Nalgonda, Hyderabad • License: LOG-AP-2026-9988
          </p>
        </div>

        <Link to="/logistics/deliveries">
          <Button variant="primary" size="md" className="bg-indigo-600 hover:bg-indigo-700" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Manage Active Dispatches
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="In Transit Now"
          value={inTransitCount}
          subtitle="On-road cargo"
          icon={Truck}
          color="blue"
        />
        <StatCard
          title="Pickups Scheduled"
          value={scheduledCount}
          subtitle="At farm depots"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Delivered Trips"
          value={deliveredCount}
          subtitle="Completed fulfillment"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Total Cargo Handled"
          value={`${totalVolumeKg.toLocaleString()} kg`}
          subtitle="Temperature monitored"
          icon={Package}
          color="purple"
        />
      </div>

      {/* Recent Dispatches */}
      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-indigo-600" />
            Live Active Routes
          </h3>
          <Link to="/logistics/deliveries" className="text-xs text-indigo-600 hover:underline font-bold">
            View All Dispatches
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {deliveries.map((del) => (
            <div key={del.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{del.deliveryId}</span>
                  <Badge variant={del.status === 'Delivered' ? 'emerald' : 'blue'} size="sm">
                    {del.status}
                  </Badge>
                  <span className="text-xs font-semibold text-emerald-800">{del.cropName} ({del.quantity} kg)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Origin: {del.pickupLocation} ➔ Destination: {del.deliveryLocation}
                </p>
              </div>

              <div className="text-right text-xs">
                <span className="font-bold text-slate-800 block">Driver: {del.driverName}</span>
                <span className="text-slate-400">{del.vehicleInfo}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};
