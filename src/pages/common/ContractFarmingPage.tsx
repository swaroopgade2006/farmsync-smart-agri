import React, { useState } from 'react';
import { 
  FileText, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  Users, 
  ChevronRight, 
  Layers, 
  HelpCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ForwardContract } from '../../types';

export const ContractFarmingPage: React.FC = () => {
  const { forwardContracts, contractApplications, applyForContract, createForwardContract } = useData();
  const { currentUser, currentRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'MARKETPLACE' | 'MY_AGREEMENTS' | 'NEW_CONTRACT'>('MARKETPLACE');
  const [selectedContract, setSelectedContract] = useState<ForwardContract | null>(null);
  const [proposedAcreage, setProposedAcreage] = useState<number>(3.0);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  // New Contract Form State (for Institutional Buyers)
  const [newCropName, setNewCropName] = useState('Malting Barley (Two-Row)');
  const [newVariety, setNewVariety] = useState('DWRB-123 High Extract');
  const [newTotalAcreage, setNewTotalAcreage] = useState(100);
  const [newAgreedPrice, setNewAgreedPrice] = useState(28.5);
  const [newMsp, setNewMsp] = useState(18.5);
  const [newAdvancePct, setNewAdvancePct] = useState(25);
  const [newHub, setNewHub] = useState('Karnal Processing Center, Haryana');
  const [newDesc, setNewDesc] = useState('Guaranteed buyback for premium malting barley with free grain moisture testing.');

  const handleOpenApplyModal = (contract: ForwardContract) => {
    setSelectedContract(contract);
  };

  const handleConfirmApplication = async () => {
    if (!selectedContract) return;
    setIsApplying(true);

    await applyForContract({
      contractId: selectedContract.id,
      farmerId: currentUser?.id || 'farmer_ravi',
      farmerName: currentUser?.fullName || 'Ravi Kumar',
      farmerPhone: '+91 98480 12345',
      village: 'Gudivada, Krishna District, AP',
      proposedAcreage,
      estimatedOutputKg: Math.round(proposedAcreage * 1600)
    });

    setIsApplying(false);
    setSelectedContract(null);
    setActiveTab('MY_AGREEMENTS');
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    const bonus = Math.round(((newAgreedPrice - newMsp) / newMsp) * 100);

    await createForwardContract({
      buyerId: currentUser?.id || 'buyer_itc_agri',
      buyerName: currentUser?.fullName || 'Institutional Agri Corp',
      buyerCompany: 'National Agro Industries Corp',
      cropName: newCropName,
      varietyRequired: newVariety,
      totalAcreageDemanded: newTotalAcreage,
      agreedPricePerKg: newAgreedPrice,
      mspBenchmarkPricePerKg: newMsp,
      bonusOverMspPercentage: bonus,
      deliveryWindowStart: '2026-11-01',
      deliveryWindowEnd: '2026-12-15',
      deliveryHubLocation: newHub,
      inputAssistanceProvided: [
        'Certified high-germination seed supply',
        'Subsidized soil testing & drone health audit'
      ],
      advancePaymentPercentage: newAdvancePct,
      minQualityGrade: 'Grade A',
      description: newDesc,
      termsAndConditions: [
        'Good Agricultural Practices mandatory',
        'Direct settlement via Escrow payout within 48h of weighment'
      ]
    });

    setActiveTab('MARKETPLACE');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 shadow-xl border border-amber-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Institutional Pre-Harvest Off-Take Agreements
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Direct Forward Contract Farming
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Eliminate market price volatility. Connect directly with institutional food processors and exporters with guaranteed MSP+ buyback prices, input seed support, and up to 30% mobilization advances.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('MARKETPLACE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'MARKETPLACE' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-200 hover:text-white'
              }`}
            >
              Open Contracts ({forwardContracts.length})
            </button>
            <button
              onClick={() => setActiveTab('MY_AGREEMENTS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'MY_AGREEMENTS' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-200 hover:text-white'
              }`}
            >
              My Signed Agreements ({contractApplications.length})
            </button>
            <button
              onClick={() => setActiveTab('NEW_CONTRACT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'NEW_CONTRACT' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-200 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Post Contract
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Open Contracts Marketplace */}
      {activeTab === 'MARKETPLACE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forwardContracts.map((contract) => {
              const subscribedPercentage = Math.round((contract.committedAcreage / contract.totalAcreageDemanded) * 100);

              return (
                <Card
                  key={contract.id}
                  className="p-6 bg-white border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Buyer Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 font-black text-sm">
                          <Building2 className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                          <h2 className="text-sm font-black text-slate-900 leading-snug">{contract.buyerCompany}</h2>
                          <span className="text-[11px] text-slate-400 font-mono">{contract.contractNumber}</span>
                        </div>
                      </div>
                      <Badge variant={contract.status === 'OPEN' ? 'emerald' : 'amber'} size="sm">
                        {contract.status === 'OPEN' ? 'Open for Acreage' : 'Fully Booked'}
                      </Badge>
                    </div>

                    {/* Crop & Price Box */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                        Target Crop & Variety
                      </span>
                      <h3 className="text-base font-black text-slate-900">{contract.cropName}</h3>
                      <p className="text-xs text-slate-600 font-medium">{contract.varietyRequired}</p>
                      
                      <div className="pt-2 mt-2 border-t border-amber-200/60 flex items-baseline justify-between">
                        <div>
                          <span className="text-xs text-slate-500">Guaranteed Buyback:</span>
                          <div className="text-xl font-black text-emerald-700">₹{contract.agreedPricePerKg.toFixed(2)} <span className="text-xs text-slate-500">/ kg</span></div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400">Govt MSP: ₹{contract.mspBenchmarkPricePerKg.toFixed(2)}</span>
                          <span className="block text-xs font-black text-emerald-800">+{contract.bonusOverMspPercentage}% Bonus</span>
                        </div>
                      </div>
                    </div>

                    {/* Acreage Demanded vs Committed */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Acreage Committed</span>
                        <span>{contract.committedAcreage} / {contract.totalAcreageDemanded} Acres ({subscribedPercentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${Math.min(100, subscribedPercentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Input Assistance Tags */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        Included Corporate Benefits:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {contract.inputAssistanceProvided.map((benefit, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-medium">
                            ✓ {benefit}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Delivery & Advance Info */}
                    <div className="pt-2 text-xs text-slate-500 space-y-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{contract.deliveryHubLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Off-Take Window: {contract.deliveryWindowStart} to {contract.deliveryWindowEnd}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="primary"
                      className="w-full text-xs font-bold bg-amber-600 hover:bg-amber-700"
                      onClick={() => handleOpenApplyModal(contract)}
                      disabled={contract.status !== 'OPEN'}
                    >
                      {contract.status === 'OPEN' ? 'Apply with My Land Acreage' : 'Acreage Quota Filled'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Signed Agreements */}
      {activeTab === 'MY_AGREEMENTS' && (
        <div className="space-y-6">
          {contractApplications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
              No signed forward contract agreements found. Browse open contracts to apply!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contractApplications.map((app) => {
                const contract = forwardContracts.find(c => c.id === app.contractId);

                return (
                  <Card key={app.id} className="p-6 bg-white border-slate-200 shadow-md space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                          Legally Binding Agreement
                        </span>
                        <h3 className="text-base font-black text-slate-900">{contract?.buyerCompany}</h3>
                      </div>
                      <Badge variant="emerald" size="sm">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {app.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block">Committed Acreage</span>
                        <span className="text-base font-black text-slate-900">{app.proposedAcreage} Acres</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block">Expected Harvest</span>
                        <span className="text-base font-black text-slate-900">{app.estimatedOutputKg} kg</span>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl">
                        <span className="text-emerald-700 block">Mobilization Advance</span>
                        <span className="text-base font-black text-emerald-800">₹{app.advanceAmountPaid.toLocaleString('en-IN')} (Credited)</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block">Guaranteed Price</span>
                        <span className="text-base font-black text-slate-900">₹{contract?.agreedPricePerKg}/kg</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                      <span>Agreement Sign Date: <strong>{app.contractAgreementDate || '2026-08-15'}</strong></span>
                      <span className="text-emerald-700 font-bold">✓ Digital OTP Signed</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Post Forward Contract Form */}
      {activeTab === 'NEW_CONTRACT' && (
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-white border-slate-200 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
              <Building2 className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Publish Forward Off-Take Contract</h2>
              <p className="text-xs text-slate-500">Corporate procurement demand for farming clusters</p>
            </div>
          </div>

          <form onSubmit={handleCreateContract} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  required
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Variety Required
                </label>
                <input
                  type="text"
                  required
                  value={newVariety}
                  onChange={(e) => setNewVariety(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Total Acreage
                </label>
                <input
                  type="number"
                  required
                  value={newTotalAcreage}
                  onChange={(e) => setNewTotalAcreage(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Agreed Price (₹/kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newAgreedPrice}
                  onChange={(e) => setNewAgreedPrice(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Govt MSP (₹/kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newMsp}
                  onChange={(e) => setNewMsp(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Delivery Hub Location
              </label>
              <input
                type="text"
                required
                value={newHub}
                onChange={(e) => setNewHub(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contract Description & Terms
              </label>
              <textarea
                rows={3}
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4 bg-amber-600 hover:bg-amber-700"
            >
              Publish Forward Off-Take Contract
            </Button>
          </form>
        </Card>
      )}

      {/* Apply Modal */}
      {selectedContract && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <Card className="max-w-lg w-full p-6 bg-white border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                  Acreage Allocation Application
                </span>
                <h3 className="text-base font-black text-slate-900">{selectedContract.cropName}</h3>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl text-slate-800">
                <span className="block font-bold mb-0.5">{selectedContract.buyerCompany}</span>
                <span>Guaranteed Price: <strong>₹{selectedContract.agreedPricePerKg}/kg</strong> (+{selectedContract.bonusOverMspPercentage}% over MSP)</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Proposed Acreage from My Farm: <strong>{proposedAcreage} Acres</strong>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={proposedAcreage}
                  onChange={(e) => setProposedAcreage(parseFloat(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Production Yield:</span>
                  <span className="font-bold text-slate-900">{Math.round(proposedAcreage * 1600)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Total Revenue:</span>
                  <span className="font-black text-emerald-700">₹{(Math.round(proposedAcreage * 1600) * selectedContract.agreedPricePerKg).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-amber-800 font-bold">Immediate Mobilization Advance ({selectedContract.advancePaymentPercentage}%):</span>
                  <span className="font-black text-amber-900">₹{Math.round(proposedAcreage * 12000 * (selectedContract.advancePaymentPercentage / 100)).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <Button
                variant="secondary"
                className="flex-1 text-xs"
                onClick={() => setSelectedContract(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-xs bg-amber-600 hover:bg-amber-700"
                onClick={handleConfirmApplication}
                isLoading={isApplying}
              >
                Sign Agreement & Receive Advance
              </Button>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};
