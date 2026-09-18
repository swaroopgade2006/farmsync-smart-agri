import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Crop } from '../../types';
import { CheckCircle2, TrendingUp, Award, DollarSign, ShieldCheck } from 'lucide-react';

interface CreateAgreementModalProps {
  crop: Crop | null;
  mode: 'FUNDED' | 'FREE_SUPPORT';
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAgreementModal: React.FC<CreateAgreementModalProps> = ({
  crop,
  mode,
  isOpen,
  onClose
}) => {
  const { currentUser, investorProfile } = useAuth();
  const { createFundingAgreement, createSupportRecord } = useData();

  // Funded fields
  const [fundingAmount, setFundingAmount] = useState('50000');
  const [returnPercentage, setReturnPercentage] = useState('8.0');
  const [terms, setTerms] = useState(
    'Capital financing for high-efficiency drip irrigation and biological fertilizers. 8% profit share on final institutional harvest sale.'
  );

  // Free support fields
  const [supportType, setSupportType] = useState('Organic Bio-Fertilizers & Hybrid Seeds Kit');
  const [supportValue, setSupportValue] = useState('20000');
  const [description, setDescription] = useState(
    '100% Non-repayable CSR agricultural input assistance. Zero repayment obligation.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!crop) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'FUNDED') {
      await createFundingAgreement({
        farmerId: crop.farmerId,
        farmerName: crop.farmerName,
        farmerVillage: crop.farmerVillage,
        farmerDistrict: crop.farmerDistrict,
        farmerState: crop.farmerState,
        investorId: investorProfile?.id || currentUser?.id || 'investor_agrifund',
        investorName: currentUser?.fullName || 'AgriFund India',
        organizationName: investorProfile?.organizationName || 'AgriFund India & KisanMitra NGO',
        cropId: crop.id,
        cropName: `${crop.cropName} (${crop.cropVariety})`,
        amount: Number(fundingAmount),
        terms,
        expectedReturnPercentage: Number(returnPercentage)
      });
    } else {
      await createSupportRecord({
        farmerId: crop.farmerId,
        farmerName: crop.farmerName,
        farmerVillage: crop.farmerVillage,
        sponsorId: investorProfile?.id || currentUser?.id || 'investor_agrifund',
        sponsorName: currentUser?.fullName || 'KisanMitra CSR Trust',
        organizationName: investorProfile?.organizationName || 'KisanMitra CSR Trust',
        supportType,
        supportValue: Number(supportValue),
        description
      });
    }

    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'FUNDED' ? 'Create Transparent Funding Agreement' : 'Disburse Free Non-Repayable CSR Support'}
      subtitle={`Target Farmer: ${crop.farmerName} • Crop: ${crop.cropName} (${crop.location})`}
      maxWidth="lg"
    >
      {success ? (
        <div className="py-8 text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">
            {mode === 'FUNDED' ? 'Funding Agreement Activated!' : 'Free CSR Support Grant Disbursed!'}
          </h4>
          <p className="text-xs text-slate-500">Record added to public verifiable ledger.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'FUNDED' ? (
            <>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-700" /> Revenue-Share Investment Agreement
                </p>
                <p className="text-[11px] text-emerald-800">
                  Investor capital is directly credited to the farmer for crop inputs. Transparent return percentage is calculated upon harvest liquidation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Investment Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Harvest Profit Share (%) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={returnPercentage}
                    onChange={(e) => setReturnPercentage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Agreement Terms & Milestones *
                </label>
                <textarea
                  rows={3}
                  required
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-700" /> Non-Repayable CSR Grant (Zero Loan)
                </p>
                <p className="text-[11px] text-amber-800">
                  This support is 100% grant-funded through CSR/Philanthropic budgets. The farmer has zero financial debt obligations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Support Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Monetary Valuation (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={supportValue}
                    onChange={(e) => setSupportValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-amber-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Grant Description & Inclusions *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </>
          )}

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={mode === 'FUNDED' ? 'primary' : 'harvest'}
              size="sm"
              isLoading={isLoading}
            >
              {mode === 'FUNDED' ? 'Execute Agreement' : 'Disburse Free CSR Grant'}
            </Button>
          </div>

        </form>
      )}
    </Modal>
  );
};
