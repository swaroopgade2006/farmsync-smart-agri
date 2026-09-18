import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  RefreshCw,
  QrCode,
  Truck
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { SmartEscrowAccount } from '../../types';

export const EscrowSettlementPage: React.FC = () => {
  const { escrowAccounts, advanceEscrowMilestone } = useData();
  const { currentUser } = useAuth();

  const [selectedEscrowId, setSelectedEscrowId] = useState<string>(escrowAccounts[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const activeAccount = escrowAccounts.find(a => a.id === selectedEscrowId) || escrowAccounts[0];

  const handleAdvanceMilestone = async (milestoneId: string) => {
    if (!activeAccount) return;
    setIsProcessing(true);
    await advanceEscrowMilestone(activeAccount.id, milestoneId);
    setIsProcessing(false);
  };

  const getMilestoneStatusBadge = (status: 'LOCKED' | 'READY_FOR_RELEASE' | 'RELEASED' | 'DISPUTED') => {
    switch (status) {
      case 'RELEASED':
        return <Badge variant="emerald" size="sm"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Disbursed to Farmer</Badge>;
      case 'READY_FOR_RELEASE':
        return <Badge variant="blue" size="sm" className="animate-pulse"><Sparkles className="w-3.5 h-3.5 mr-1" /> Ready for Sign-Off</Badge>;
      case 'LOCKED':
        return <Badge variant="slate" size="sm"><Lock className="w-3.5 h-3.5 mr-1" /> Funds Locked in Trust</Badge>;
      case 'DISPUTED':
        return <Badge variant="rose" size="sm"><AlertCircle className="w-3.5 h-3.5 mr-1" /> In Mediation</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> RBI-Compliant Escrow Protection & Milestone Settlements
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Smart Digital Escrow Gateway
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Zero fraud agricultural settlement. Buyer deposits are securely locked in smart escrow, releasing payments to farmers in milestones upon verified harvest grading, transit telemetry, and delivery sign-off.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 4 Cols: Escrow Account Selector & Balance Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-white border-slate-200 shadow-md space-y-4">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" /> Active Escrow Contracts
            </h2>

            <div className="space-y-2">
              {escrowAccounts.map((acc) => {
                const isSelected = activeAccount?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedEscrowId(acc.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>{acc.orderNumber}</span>
                      <span className="text-emerald-700">₹{acc.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{acc.farmerName} ➔ {acc.buyerName}</span>
                      <span className="font-semibold text-slate-700">{acc.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Balance Overview */}
          {activeAccount && (
            <Card className="p-6 bg-gradient-to-br from-slate-900 to-emerald-950 text-white border-emerald-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Escrow Vault Balance
                </span>
                <Badge variant="emerald" size="sm">Active Vault</Badge>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-emerald-300">Total Committed Value</span>
                <div className="text-3xl font-black">₹{activeAccount.totalAmount.toLocaleString('en-IN')}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Released Payouts</span>
                  <span className="text-base font-black text-emerald-400">
                    ₹{activeAccount.releasedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Locked in Vault</span>
                  <span className="text-base font-black text-amber-400">
                    ₹{activeAccount.lockedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right 8 Cols: Milestone Stages & Verification */}
        <div className="lg:col-span-8 space-y-6">
          {activeAccount ? (
            <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-lg space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">
                      Milestone Release Schedule: {activeAccount.orderNumber}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Buyer: <strong>{activeAccount.buyerName}</strong> • Farmer: <strong>{activeAccount.farmerName}</strong>
                  </p>
                </div>

                <Badge variant={activeAccount.status === 'DELIVERED_SETTLED' ? 'emerald' : 'blue'} size="sm">
                  {activeAccount.status}
                </Badge>
              </div>

              {/* Milestones Flow */}
              <div className="space-y-4">
                {activeAccount.milestones.map((ms, index) => {
                  const isReleased = ms.status === 'RELEASED';
                  const isReady = ms.status === 'READY_FOR_RELEASE';

                  return (
                    <div
                      key={ms.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isReleased
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : isReady
                          ? 'bg-blue-50/50 border-blue-300 shadow-sm'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              isReleased
                                ? 'bg-emerald-600 text-white'
                                : isReady
                                ? 'bg-blue-600 text-white animate-pulse'
                                : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {isReleased ? '✓' : index + 1}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{ms.title}</h3>
                            <span className="text-[11px] text-slate-500">
                              {ms.percentageOfTotal}% of total (₹{ms.amount.toLocaleString('en-IN')})
                            </span>
                          </div>
                        </div>

                        <div>
                          {getMilestoneStatusBadge(ms.status)}
                        </div>
                      </div>

                      {ms.verificationEvidence && (
                        <div className="mt-2 text-xs text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/80">
                          <span className="font-bold text-slate-800">Verification Evidence:</span> {ms.verificationEvidence}
                          {ms.releasedAt && (
                            <span className="block text-[10px] text-slate-400 mt-1">
                              Disbursed: {new Date(ms.releasedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}

                      {isReady && (
                        <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center justify-end">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleAdvanceMilestone(ms.id)}
                            isLoading={isProcessing}
                            className="text-xs font-bold bg-blue-600 hover:bg-blue-700"
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          >
                            Approve Verification & Disburse ₹{ms.amount.toLocaleString('en-IN')}
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Escrow Guarantee Policy */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> FarmSync AI Escrow Trust Policy
                </div>
                <p className="leading-relaxed">
                  Funds remain protected in an institutional escrow trust. In the event of quality rejection before dispatch, 100% refund is initiated within 2 business hours. Upon OTP delivery verification, remaining funds are wired directly to the farmer&apos;s linked UPI/Bank account.
                </p>
              </div>

            </Card>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
              No active escrow orders.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
