import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { HeartHandshake, TrendingUp, Award, Plus, CheckCircle2, FileText, ShieldCheck, DollarSign } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const FarmerSupportPage: React.FC = () => {
  const { currentUser, farmerProfile } = useAuth();
  const { fundingAgreements, supportRecords, createSupportRecord } = useData();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [supportType, setSupportType] = useState('Organic Fertilizers Kit');
  const [description, setDescription] = useState('Requesting organic bio-inputs to expand 2 acres of organic chilli cultivation.');
  const [requestedValue, setRequestedValue] = useState('15000');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await createSupportRecord({
      farmerId: farmerProfile?.id || currentUser?.id || 'farmer_ravi',
      farmerName: currentUser?.fullName || 'Ravi Kumar',
      farmerVillage: farmerProfile?.village || 'Gudivada',
      sponsorId: 'investor_agrifund',
      sponsorName: 'KisanMitra NGO & CSR Trust',
      organizationName: 'KisanMitra CSR Trust',
      supportType,
      supportValue: Number(requestedValue) || 15000,
      description
    });

    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsApplyModalOpen(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Funding & Free-Support Grants
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access transparent capital partnerships or 100% non-repayable CSR agricultural input kits
          </p>
        </div>

        <Button
          variant="harvest"
          onClick={() => setIsApplyModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4 text-slate-900" />}
        >
          Apply for Free CSR Support Grant
        </Button>
      </div>

      {/* Model Explainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Model 1: Funded Farmer Agreement */}
        <Card className="p-6 border-emerald-200 bg-emerald-50/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Funded Farmer Model</h3>
                <span className="text-xs text-emerald-700 font-semibold">Institutional Capital & Drip Automation</span>
              </div>
            </div>
            <Badge variant="emerald" size="sm">Revenue Share</Badge>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Legally bound transparent agreements where agricultural impact investors provide cultivation and automation capital in exchange for pre-agreed profit shares upon wholesale trade liquidation.
          </p>

          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Active Agreements</span>
            {fundingAgreements.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No active funded agreements.</p>
            ) : (
              fundingAgreements.map((agr) => (
                <div key={agr.id} className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{agr.investorName}</span>
                    <Badge variant="emerald" size="sm">₹{agr.amount.toLocaleString('en-IN')}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-600">{agr.terms}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Agreement Date: {agr.agreementDate}</span>
                    <span className="font-semibold text-emerald-700">Status: {agr.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Model 2: Free Support CSR Grant */}
        <Card className="p-6 border-amber-200 bg-amber-50/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Free-Support Model</h3>
                <span className="text-xs text-amber-700 font-semibold">100% Non-Repayable CSR Input Grants</span>
              </div>
            </div>
            <Badge variant="amber" size="sm">Zero Debt</Badge>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Non-repayable agricultural grants sponsored by CSR trusts, Philanthropic Foundations, and Government schemes. Farmers receive certified bio-fertilizers, hybrid seed kits, and soil health testing.
          </p>

          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase block mb-2">Disbursed Support Records</span>
            {supportRecords.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No support records found.</p>
            ) : (
              supportRecords.map((sup) => (
                <div key={sup.id} className="p-3 bg-white rounded-xl border border-amber-200 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{sup.supportType}</span>
                    <Badge variant="amber" size="sm">Worth ₹{sup.supportValue.toLocaleString('en-IN')}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-600">{sup.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Sponsor: {sup.sponsorName}</span>
                    <span className="font-semibold text-emerald-700">Status: {sup.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Free CSR Agricultural Support"
        subtitle="Submit your input grant application to participating CSR Foundations"
      >
        {success ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Application Submitted Successfully!</h4>
            <p className="text-xs text-slate-500">CSR Sponsor will review and disburse the input kit.</p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Requested Support Type *
              </label>
              <select
                value={supportType}
                onChange={(e) => setSupportType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Organic Fertilizers Kit">Organic Bio-Fertilizers & Pest Repellent Kit</option>
                <option value="Hybrid Certified Seeds Kit">Hybrid Certified High-Yield Seeds Kit</option>
                <option value="Solar Drip Irrigation Unit">Solar Micro-Drip Irrigation Unit</option>
                <option value="Soil Health Card Testing">Digital Soil Health Card & Nutrient Diagnostic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Estimated Value of Support (₹)
              </label>
              <input
                type="number"
                value={requestedValue}
                onChange={(e) => setRequestedValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Farm Purpose & Need Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="harvest" size="sm" isLoading={isSubmitting}>
                Submit Grant Application
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};
