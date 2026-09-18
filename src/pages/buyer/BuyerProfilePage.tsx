import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VerificationStatus } from '../../types';
import { 
  Building, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Save, 
  FileText,
  DollarSign
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { VerificationStatusBadge } from '../../components/verification/VerificationStatusBadge';
import { AccountVerificationModal } from '../../components/verification/AccountVerificationModal';
import { RoleChangeModal } from '../../components/verification/RoleChangeModal';
import { RefreshCw, Lock } from 'lucide-react';

export const BuyerProfilePage: React.FC = () => {
  const { currentUser, buyerProfile, updateCurrentUserProfile } = useAuth();

  const [businessName, setBusinessName] = useState(buyerProfile?.businessName || currentUser?.fullName || 'FreshMart Wholesale Hub');
  const [businessType, setBusinessType] = useState(buyerProfile?.businessType || 'Supermarket Chain & Wholesale');
  const [operatingCity, setOperatingCity] = useState(buyerProfile?.operatingCity || currentUser?.operatingLocation || 'Vijayawada');
  const [deliveryAddress, setDeliveryAddress] = useState(buyerProfile?.deliveryAddress || 'Plot 45, Auto Nagar Industrial Estate, Vijayawada, AP - 520007');
  const [gstNumber, setGstNumber] = useState(buyerProfile?.gstNumber || '37AAAAA0000A1Z5');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 99887 76655');

  const [isSaved, setIsSaved] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isRoleChangeModalOpen, setIsRoleChangeModalOpen] = useState(false);

  const verificationStatus: VerificationStatus = currentUser?.verificationStatus || (currentUser?.isVerified ? 'VERIFIED' : 'PENDING');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      phone,
      fullName: businessName
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white text-blue-900 flex items-center justify-center text-xl font-black shadow-lg">
            {businessName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black">{businessName}</h1>
              <VerificationStatusBadge status={verificationStatus} size="sm" />
            </div>
            <p className="text-xs text-blue-200 mt-1">
              Role: <strong className="text-white uppercase">{currentUser?.role || 'BUYER'}</strong> • Hub: {operatingCity} • GSTIN: <span className="font-mono text-emerald-300">37AABCA****1Z9</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
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

      {/* Verification Card */}
      <Card className="p-6 border-slate-200 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Commercial & Tax Identification Status
                <VerificationStatusBadge status={verificationStatus} size="sm" />
              </h3>
              <p className="text-xs text-slate-500">
                Verified commercial status enables credit terms, high-volume orders & forward contracts
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Masked GSTIN / PAN</span>
            <span className="font-mono text-blue-800 font-bold text-xs mt-0.5 block">
              {verificationStatus === 'VERIFIED' ? '37AABCA****1Z9 (Verified ✓)' : 'Pending Upload'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Trade Authority Check</span>
            <span className="font-semibold text-emerald-700 text-xs mt-0.5 block">
              Verified Commercial Enterprise
            </span>
          </div>
        </div>
      </Card>

      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Buyer procurement profile saved successfully.</span>
        </div>
      )}

      {/* Form */}
      <Card className="p-6 sm:p-8 border-slate-200">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              1. Commercial & Procurement Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Trade Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Classification</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Supermarket Chain & Wholesale">Supermarket Chain & Wholesale</option>
                  <option value="Restaurant & Catering Network">Restaurant & Catering Network</option>
                  <option value="Food Processing Industrialist">Food Processing Industrialist</option>
                  <option value="Agri Export House">Agri Export House</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GST / Trade Identification Number</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Procurement Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              2. Warehouse & Delivery Hub
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Operating City / Region</label>
                <input
                  type="text"
                  value={operatingCity}
                  onChange={(e) => setOperatingCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Receiving Yard Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
              Save Buyer Profile
            </Button>
          </div>

        </form>
      </Card>

      {/* Verification Submission Modal */}
      {isVerificationModalOpen && (
        <AccountVerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          targetRole="buyer"
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
