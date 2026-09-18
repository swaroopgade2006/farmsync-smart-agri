import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FarmerType, VerificationStatus } from '../../types';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Sprout, 
  ShieldCheck, 
  Save, 
  Award,
  DollarSign
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LocationDetector } from '../../components/common/LocationDetector';
import { VerificationStatusBadge } from '../../components/verification/VerificationStatusBadge';
import { AccountVerificationModal } from '../../components/verification/AccountVerificationModal';
import { RoleChangeModal } from '../../components/verification/RoleChangeModal';
import { Lock, RefreshCw, AlertCircle, FileText } from 'lucide-react';

export const FarmerProfilePage: React.FC = () => {
  const { currentUser, farmerProfile, updateCurrentUserProfile } = useAuth();

  const [fullName, setFullName] = useState(currentUser?.fullName || 'Ravi Kumar');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98480 12345');
  const [village, setVillage] = useState(farmerProfile?.village || 'Gudivada');
  const [district, setDistrict] = useState(farmerProfile?.district || 'Krishna');
  const [stateName, setStateName] = useState(farmerProfile?.state || 'Andhra Pradesh');
  const [landSize, setLandSize] = useState(String(farmerProfile?.landSize || 4.5));
  const [soilType, setSoilType] = useState(farmerProfile?.soilType || 'Black Clay Loam');
  const [farmingExperience, setFarmingExperience] = useState(String(farmerProfile?.farmingExperience || 14));
  const [farmerType, setFarmerType] = useState<FarmerType>(farmerProfile?.farmerType || 'Funded');
  const [upiId, setUpiId] = useState(farmerProfile?.upiId || 'ravikumar@oksbi');

  const [isSaved, setIsSaved] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isRoleChangeModalOpen, setIsRoleChangeModalOpen] = useState(false);

  const verificationStatus: VerificationStatus = currentUser?.verificationStatus || (currentUser?.isVerified ? 'VERIFIED' : 'PENDING');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      fullName,
      phone
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white text-emerald-800 flex items-center justify-center text-xl font-black shadow-lg">
            {fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black">{fullName}</h1>
              <VerificationStatusBadge status={verificationStatus} size="sm" />
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              {village}, {district}, {stateName} • Platform Role: <strong className="text-white uppercase">{currentUser?.role || 'FARMER'}</strong>
            </p>
          </div>
        </div>

        <div className="text-right sm:self-center flex flex-col sm:items-end gap-2">
          <div>
            <span className="text-[10px] text-emerald-300 uppercase tracking-widest block">Direct Bank / UPI Link</span>
            <span className="text-xs font-mono font-bold text-white bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/60 inline-block mt-1">
              {upiId}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsRoleChangeModalOpen(true)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Request Role Change
          </button>
        </div>
      </div>

      {/* Verification Status & ID Credentials Card */}
      <Card className="p-6 border-slate-200 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Identity & Land Title Verification Status
                <VerificationStatusBadge status={verificationStatus} size="sm" />
              </h3>
              <p className="text-xs text-slate-500">
                Verified badge unlocks full marketplace listing visibility and direct escrow instant payouts
              </p>
            </div>
          </div>

          <Button
            variant={verificationStatus === 'VERIFIED' ? 'outline' : 'primary'}
            size="sm"
            onClick={() => setIsVerificationModalOpen(true)}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            {verificationStatus === 'VERIFIED' ? 'Update Credentials' : 'Submit Verification Proofs'}
          </Button>
        </div>

        {/* Masked Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">7/12 Land Patta Title</span>
            <span className="font-mono text-emerald-800 font-bold text-xs mt-0.5 block">
              {verificationStatus === 'VERIFIED' ? '742/3A (Verified ✓)' : 'Pending Document Upload'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Aadhaar Identity Proof</span>
            <span className="font-mono text-slate-800 font-bold text-xs mt-0.5 block">
              {verificationStatus === 'VERIFIED' ? 'XXXX-XXXX-4821 (Masked)' : 'Pending Document Upload'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Anti-Impersonation Check</span>
            <span className="font-semibold text-emerald-700 text-xs mt-0.5 block">
              Direct Land Cultivator Pass
            </span>
          </div>
        </div>
      </Card>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Farmer profile information saved successfully.</span>
        </div>
      )}

      {/* Profile Form */}
      <Card className="p-6 sm:p-8 border-slate-200">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Contact Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              1. Personal & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (Aadhaar linked)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || 'ravi.kumar@farm.in'}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Farm Geography */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              2. Farm Geography & Location Detector
            </h3>

            <LocationDetector
              value={`${village}, ${district}, ${stateName}`}
              onChange={(address, details) => {
                if (details) {
                  setVillage(details.villageOrLocality || village);
                  setDistrict(details.district || district);
                  setStateName(details.state || stateName);
                  if (details.soilZone?.includes('Black')) setSoilType('Black Clay Loam');
                  else if (details.soilZone?.includes('Red')) setSoilType('Red Sandy Loam');
                  else if (details.soilZone?.includes('Alluvial')) setSoilType('Alluvial Soil');
                  else if (details.soilZone?.includes('Laterite')) setSoilType('Laterite Soil');
                }
              }}
              label="Farm Geographical Location & Depots"
              placeholder="Search farm village, mandal, or enter 6-digit PIN code..."
              showMapPreview={true}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Village / Mandal</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Agricultural Agronomy */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-amber-600" />
              3. Agronomy & Operational Scale
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Land Size (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Black Clay Loam">Black Clay Loam</option>
                  <option value="Red Sandy Loam">Red Sandy Loam</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Laterite Soil">Laterite Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
                <input
                  type="number"
                  value={farmingExperience}
                  onChange={(e) => setFarmingExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Farmer Type Model</label>
                <select
                  value={farmerType}
                  onChange={(e) => setFarmerType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Self-Funded">Self-Funded</option>
                  <option value="Funded">Funded (Investor Backed)</option>
                  <option value="Free-Support">Free-Support (CSR Grant)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>

        </form>
      </Card>

      {/* Verification Submission Modal */}
      {isVerificationModalOpen && (
        <AccountVerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          targetRole="farmer"
        />
      )}

      {/* Role Change Modal */}
      {isRoleChangeModalOpen && (
        <RoleChangeModal
          isOpen={isRoleChangeModalOpen}
          onClose={() => setIsRoleChangeModalOpen(false)}
        />
      )}

    </div>
  );
};
