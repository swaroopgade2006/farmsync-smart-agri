import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  Sprout, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';

export const AdminDashboard: React.FC = () => {
  const { users, crops, orders, fundingAgreements, supportRecords, payments, deliveries } = useData();

  const farmersCount = users.filter(u => u.role === 'farmer').length;
  const buyersCount = users.filter(u => u.role === 'buyer').length;
  const unverifiedCount = users.filter(u => !u.isVerified).length;
  const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
  const completedOrders = orders.filter(o => o.status === 'DELIVERED' || o.status === 'COMPLETED').length;
  const totalFunding = fundingAgreements.reduce((s, a) => s + a.amount, 0) + supportRecords.reduce((s, r) => s + r.supportValue, 0);
  const totalGMV = orders.reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="rose" className="bg-rose-500/30 text-rose-200 border-rose-400/40">
              🛡️ Master Administration Hub
            </Badge>
            <span className="text-xs text-slate-300 font-semibold">
              Smart India Hackathon 2026 Live Oversight
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            FarmSync AI Central Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time platform governance, user verification, escrow ledger oversight, and agricultural macro analytics
          </p>
        </div>

        <Link to="/admin/verifications">
          <Button variant="harvest" size="md" rightIcon={<ArrowRight className="w-4 h-4 text-slate-900" />}>
            Review Verifications ({unverifiedCount} Pending)
          </Button>
        </Link>
      </div>

      {/* 7 Required Platform Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        <StatCard
          title="Farmers"
          value={farmersCount}
          subtitle="Registered"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Buyers"
          value={buyersCount}
          subtitle="Off-takers"
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Total Crops"
          value={crops.length}
          subtitle="Listings"
          icon={Sprout}
          color="emerald"
        />
        <StatCard
          title="Active Orders"
          value={activeOrders}
          subtitle="In pipeline"
          icon={Package}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={completedOrders}
          subtitle="Settled"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Funding / Grants"
          value={`₹${totalFunding.toLocaleString('en-IN')}`}
          subtitle="Impact capital"
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Platform GMV"
          value={`₹${totalGMV.toLocaleString('en-IN')}`}
          subtitle="Gross volume"
          icon={DollarSign}
          color="rose"
        />
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Verification Card */}
        <Card hover className="p-6 border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <Badge variant={unverifiedCount > 0 ? 'rose' : 'emerald'} size="sm">
                {unverifiedCount} Pending
              </Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900">User Verification Center</h3>
            <p className="text-xs text-slate-500 mt-1">
              Verify farmer land records, buyer GST trade licenses, and sponsor organization credentials with 1-click issuance of verification badges.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link to="/admin/verifications">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Open Verification Center
              </Button>
            </Link>
          </div>
        </Card>

        {/* Crops Management */}
        <Card hover className="p-6 border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <Sprout className="w-5 h-5" />
              </div>
              <Badge variant="emerald" size="sm">{crops.length} Listed</Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900">Global Crop Oversight</h3>
            <p className="text-xs text-slate-500 mt-1">
              Inspect active farmer crop varieties, pricing benchmarks, growth stage progression, and pest observation telemetry across all districts.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link to="/admin/crops">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Manage Crops
              </Button>
            </Link>
          </div>
        </Card>

        {/* Analytics & Supply Gap */}
        <Card hover className="p-6 border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="blue" size="sm">Macro Analytics</Badge>
            </div>
            <h3 className="text-base font-bold text-slate-900">Demand-Supply Analytics</h3>
            <p className="text-xs text-slate-500 mt-1">
              Deep dive into institutional crop deficits, state-wise price variations, and predictive AI harvest yield distributions.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link to="/admin/analytics">
              <Button variant="outline" size="sm" className="w-full text-xs">
                View Market Intelligence
              </Button>
            </Link>
          </div>
        </Card>

      </div>

    </div>
  );
};
