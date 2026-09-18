import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { ShieldAlert, RefreshCw, CheckCircle2, AlertCircle, X, ArrowRight, Lock } from 'lucide-react';

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { submitRoleChangeRequest } = useData();

  const [requestedRole, setRequestedRole] = useState<UserRole>('fpo');
  const [reason, setReason] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentRole = user?.role || 'farmer';

  const availableRoles = ([
    { role: 'farmer' as UserRole, label: 'Farmer (Direct Cultivator)', desc: 'Cultivate own land, list farmgate produce directly' },
    { role: 'fpo' as UserRole, label: 'Farmer Producer Org (FPO)', desc: 'Collective cooperative representing multiple smallholder farmers' },
    { role: 'vendor' as UserRole, label: 'Vendor / Trader', desc: 'Sourcing, grading, aggregators, cold-chain resale listings' },
    { role: 'buyer' as UserRole, label: 'Direct Buyer / Enterprise', desc: 'Procuring bulk crops for retail, processing, or food service' },
    { role: 'investor' as UserRole, label: 'Investor / Sponsor', desc: 'Crowdfunding farm projects, contract farming financing' },
    { role: 'logistics' as UserRole, label: 'Logistics Provider', desc: 'Cold storage, fleet transportation, delivery tracking' },
  ] as const).filter(r => r.role !== currentRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      setErrorMessage('Please login to request a role transition.');
      return;
    }

    if (!reason.trim()) {
      setErrorMessage('Please provide a legitimate reason for this role reclassification.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitRoleChangeRequest({
        userId: user.id,
        userName: user.fullName || user.name || 'User',
        currentRole,
        requestedRole,
        reason,
        supportingDocuments: documentNumber ? [documentNumber] : [],
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit role change request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100 my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Request Account Role Transition
              </h2>
              <p className="text-xs text-slate-400">
                Formal role reclassification requires Admin audit and verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Role Change Request Submitted!</h3>
            <p className="text-sm text-slate-300">
              Your request to switch from <span className="font-semibold text-amber-400 uppercase">{currentRole}</span> to <span className="font-semibold text-emerald-400 uppercase">{requestedRole}</span> is pending Admin audit.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Anti-Fraud Warning Box */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Integrity & Anti-Impersonation Protocol</span>
                <span>
                  To ensure market authenticity, users cannot self-reassign platform roles without formal credential validation. Intermediaries cannot claim direct farmer status without title proof.
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Current to New Role Badge Row */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Current Active Role</span>
                <span className="text-sm font-bold text-white uppercase px-2.5 py-1 bg-slate-700/60 rounded-md">
                  {currentRole}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <div>
                <span className="text-xs text-slate-400 block mb-1">Target Role</span>
                <span className="text-sm font-bold text-emerald-400 uppercase px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                  {requestedRole}
                </span>
              </div>
            </div>

            {/* Select Target Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Select Target Platform Role *
              </label>
              <div className="grid grid-cols-1 gap-2">
                {availableRoles.map(item => (
                  <label
                    key={item.role}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      requestedRole === item.role
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                        : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="requestedRole"
                      value={item.role}
                      checked={requestedRole === item.role}
                      onChange={() => setRequestedRole(item.role)}
                      className="mt-1 text-emerald-500 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-slate-100">{item.label}</p>
                      <p className="text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Justification Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Justification / Business Transition Reason *
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Explain the transition, e.g., 'Registered as a farmer previously, now incorporated into a registered FPO cooperative with 120 member farmers.'"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Supporting ID / Registration Doc */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Supporting Registration / License Reference (Optional)
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={e => setDocumentNumber(e.target.value)}
                placeholder="e.g. FPO-MH-2026-9921 or GSTIN-27AABCT..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                {isSubmitting ? 'Submitting Request...' : 'Submit Transition for Audit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
