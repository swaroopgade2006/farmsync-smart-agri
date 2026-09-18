import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  TrendingUp, 
  HeartHandshake, 
  Award, 
  Users, 
  DollarSign, 
  Sprout, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';

export const SponsorDashboard: React.FC = () => {
  const { currentUser, investorProfile } = useAuth();
  const { crops, fundingAgreements, supportRecords } = useData();

  const totalFundedAmount = fundingAgreements.reduce((sum, a) => sum + a.amount, 0);
  const totalGrantAmount = supportRecords.reduce((sum, s) => sum + s.supportValue, 0);
  const totalBeneficiaryFarmers = new Set([
    ...fundingAgreements.map(a => a.farmerId),
    ...supportRecords.map(s => s.farmerId)
  ]).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="amber" className="bg-amber-500/30 text-amber-200 border-amber-400/40">
              🌱 Sponsor & Impact Investor Hub
            </Badge>
            {currentUser?.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified CSR Sponsor
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome, {investorProfile?.organizationName || currentUser?.fullName || 'AgriFund India'}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-xl">
            {investorProfile?.investorType} • Allocated Impact Budget: <strong className="text-white">₹{(investorProfile?.allocatedBudget || 2500000).toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <Link to="/sponsor/projects">
          <Button variant="harvest" size="md" rightIcon={<ArrowRight className="w-4 h-4 text-slate-900" />}>
            Explore Farmer Projects
          </Button>
        </Link>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Capital Deployed"
          value={`₹${totalFundedAmount.toLocaleString('en-IN')}`}
          subtitle="Funded agreements"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Free CSR Grants"
          value={`₹${totalGrantAmount.toLocaleString('en-IN')}`}
          subtitle="Non-repayable aid"
          icon={Award}
          color="amber"
        />
        <StatCard
          title="Farmers Supported"
          value={totalBeneficiaryFarmers}
          subtitle="Beneficiary families"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={crops.length}
          subtitle="Seeking investment/grants"
          icon={Sprout}
          color="purple"
        />
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Funded Agreements */}
        <Card className="p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Funded Farmer Agreements</h3>
                <p className="text-xs text-slate-500">Transparent profit-sharing agricultural capital</p>
              </div>
            </div>
            <Link to="/sponsor/agreements" className="text-xs text-emerald-600 hover:underline font-bold flex items-center">
              View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {fundingAgreements.map((agr) => (
              <div key={agr.id} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{agr.farmerName}</span>
                    <span className="text-[10px] text-slate-500 block">{agr.farmerVillage}, {agr.farmerDistrict}</span>
                  </div>
                  <Badge variant="emerald" size="sm">₹{agr.amount.toLocaleString('en-IN')}</Badge>
                </div>
                <p className="text-xs text-slate-600">{agr.terms}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-emerald-100">
                  <span>Crop: {agr.cropName}</span>
                  <span className="font-bold text-emerald-700">Return Share: {agr.expectedReturnPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Free-Support CSR Grants */}
        <Card className="p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Free CSR Input Support Grants</h3>
                <p className="text-xs text-slate-500">100% non-repayable philanthropic input kits</p>
              </div>
            </div>
            <Link to="/sponsor/support-records" className="text-xs text-amber-600 hover:underline font-bold flex items-center">
              View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {supportRecords.map((sup) => (
              <div key={sup.id} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{sup.supportType}</span>
                    <span className="text-[10px] text-slate-500 block">Farmer: {sup.farmerName} ({sup.farmerVillage})</span>
                  </div>
                  <Badge variant="amber" size="sm">Grant: ₹{sup.supportValue.toLocaleString('en-IN')}</Badge>
                </div>
                <p className="text-xs text-slate-600">{sup.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-amber-100">
                  <span>Date Disbursed: {sup.date}</span>
                  <Badge variant="emerald" size="sm">Disbursed</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
};
