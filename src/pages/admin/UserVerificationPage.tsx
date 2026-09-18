import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { VerificationRequest, RoleChangeRequest, FraudAlert, UserRole, VerificationStatus } from '../../types';
import { VerificationStatusBadge } from '../../components/verification/VerificationStatusBadge';
import { CropSourceBadge } from '../../components/verification/CropSourceBadge';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Users,
  RefreshCw,
  Building,
  Lock,
  ArrowRight,
  Eye,
  Clock,
  ShieldAlert,
  Award,
  Calendar,
  AlertCircle,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const UserVerificationPage: React.FC = () => {
  const { currentUser, user: adminUser } = useAuth();
  const {
    users,
    verificationRequests,
    verificationAuditLogs,
    roleChangeRequests,
    fraudAlerts,
    reviewVerificationRequest,
    reviewRoleChangeRequest,
    resolveFraudAlert
  } = useData();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'requests' | 'role_changes' | 'fraud' | 'audit_logs'>('requests');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [reviewingRequest, setReviewingRequest] = useState<VerificationRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Role Change Modal state
  const [reviewingRoleChange, setReviewingRoleChange] = useState<RoleChangeRequest | null>(null);
  const [roleChangeNotes, setRoleChangeNotes] = useState('');

  // Stats
  const pendingRequestsCount = verificationRequests.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length;
  const verifiedUsersCount = users.filter(u => u.isVerified || u.verificationStatus === 'VERIFIED').length;
  const pendingRoleChangesCount = roleChangeRequests.filter(r => r.status === 'PENDING').length;
  const openFraudAlertsCount = fraudAlerts.filter(f => f.status === 'OPEN').length;

  // Filter verification requests
  const filteredRequests = verificationRequests.filter(req => {
    if (selectedRoleFilter !== 'ALL' && req.role !== selectedRoleFilter && req.userRole !== selectedRoleFilter) return false;
    if (selectedStatusFilter !== 'ALL' && req.status !== selectedStatusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = req.userName.toLowerCase().includes(q);
      const matchId = req.id.toLowerCase().includes(q);
      const matchUser = req.userId.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchUser) return false;
    }
    return true;
  });

  const handleReviewAction = async (decision: 'APPROVED' | 'REJECTED' | 'REQUESTED_INFO') => {
    if (!reviewingRequest) return;
    if (decision === 'REJECTED' && !rejectionReason.trim()) {
      alert('Please specify a rejection reason.');
      return;
    }

    setIsProcessing(true);
    await reviewVerificationRequest(
      reviewingRequest.id,
      decision,
      decision === 'REJECTED' ? rejectionReason : customNotes || undefined,
      currentUser?.id || 'admin_compliance'
    );

    setIsProcessing(false);
    setReviewingRequest(null);
    setRejectionReason('');
    setCustomNotes('');
  };

  const handleRoleChangeAction = async (decision: 'APPROVED' | 'REJECTED') => {
    if (!reviewingRoleChange) return;
    setIsProcessing(true);
    await reviewRoleChangeRequest(
      reviewingRoleChange.id,
      decision,
      roleChangeNotes || undefined
    );
    setIsProcessing(false);
    setReviewingRoleChange(null);
    setRoleChangeNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Verification & Compliance Center
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              Live Trust Engine
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Identity auditing, land title verification, role transition approvals & anti-fraud governance
          </p>
        </div>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" /> Pending Verifications
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingRequestsCount}</p>
          <span className="text-[11px] text-slate-400">Awaiting document audit</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Accounts
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{verifiedUsersCount}</p>
          <span className="text-[11px] text-slate-400">Farmers, FPOs & Vendors</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-blue-500" /> Role Change Requests
          </span>
          <p className="text-2xl font-black text-blue-600 mt-1">{pendingRoleChangesCount}</p>
          <span className="text-[11px] text-slate-400">Pending classification audits</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" /> Anti-Fraud Alerts
          </span>
          <p className="text-2xl font-black text-rose-600 mt-1">{openFraudAlertsCount}</p>
          <span className="text-[11px] text-slate-400">High-risk & mismatch alerts</span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'requests'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Queue ({filteredRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('role_changes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'role_changes'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Role Change Requests ({roleChangeRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fraud')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'fraud'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Anti-Fraud Monitor ({fraudAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
            activeTab === 'audit_logs'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Audit Log Trail ({verificationAuditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: VERIFICATION REQUESTS QUEUE */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <Card className="p-4 border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, user ID, request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-slate-500">Role:</span>
              {['ALL', 'farmer', 'fpo', 'vendor', 'buyer', 'investor', 'logistics'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRoleFilter(r)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold capitalize transition-all ${
                    selectedRoleFilter === r
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Status:</span>
              {['ALL', 'pending', 'verified', 'rejected'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatusFilter(s)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold capitalize transition-all ${
                    selectedStatusFilter === s
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          {/* Requests Table */}
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Applicant Profile</th>
                    <th className="p-4">Claimed Role</th>
                    <th className="p-4">Attached Proofs & Masked IDs</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4">Audit Status</th>
                    <th className="p-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No verification requests match current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs">
                              {req.userName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{req.userName}</span>
                              <span className="text-slate-400 text-[10px] font-mono">ID: {req.userId}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                            {req.role}
                          </span>
                        </td>

                        <td className="p-4 space-y-1">
                          {req.documents.map((doc, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                              <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                                {doc.title || doc.docType}: {doc.maskedNumber}
                              </span>
                            </div>
                          ))}
                        </td>

                        <td className="p-4 text-slate-500 font-mono text-[11px]">
                          {req.submittedAt}
                        </td>

                        <td className="p-4">
                          <VerificationStatusBadge status={req.status} size="sm" />
                        </td>

                        <td className="p-4 text-right">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setReviewingRequest(req);
                              setRejectionReason(req.rejectionReason || '');
                              setCustomNotes(req.notes || req.adminNotes || '');
                            }}
                            className="text-xs py-1"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Review & Audit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: ROLE CHANGE REQUESTS */}
      {activeTab === 'role_changes' && (
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Current Role $\rightarrow$ Target Role</th>
                  <th className="p-4">Submitted Justification</th>
                  <th className="p-4">Supporting Document</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {roleChangeRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No active role change requests.
                    </td>
                  </tr>
                ) : (
                  roleChangeRequests.map((rc) => (
                    <tr key={rc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{rc.userName}</span>
                        <span className="text-slate-400 text-[10px] font-mono">ID: {rc.userId}</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">{rc.currentRole}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">{rc.requestedRole}</span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-700 max-w-xs leading-snug">
                        {rc.reason}
                      </td>

                      <td className="p-4 font-mono text-slate-600">
                        {rc.supportingDocuments?.[0] || 'No ref provided'}
                      </td>

                      <td className="p-4">
                        <VerificationStatusBadge status={rc.status === 'APPROVED' ? 'VERIFIED' : rc.status === 'REJECTED' ? 'REJECTED' : 'PENDING'} size="sm" />
                      </td>

                      <td className="p-4 text-right">
                        {rc.status === 'PENDING' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setReviewingRoleChange(rc)}
                            className="text-xs py-1"
                          >
                            Audit Transition
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold capitalize">
                            {rc.status} by {rc.reviewedBy || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: ANTI-FRAUD & IMPERSONATION MONITOR */}
      {activeTab === 'fraud' && (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 space-y-1">
              <p className="font-bold">Automated Anti-Fraud & Counterfeiting Radar</p>
              <p>
                Algorithms cross-reference APMC mandi tax filings, land survey numbers, geo-coordinates, and vendor markup percentages to detect intermediaries falsely presenting themselves as original cultivators.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fraudAlerts.map((alert) => (
              <Card key={alert.id} className="p-5 border-rose-200 bg-white space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      alert.severity === 'HIGH' ? 'bg-rose-600 text-white' : alert.severity === 'MEDIUM' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {alert.severity} Risk
                    </span>
                    <span className="font-mono text-xs text-slate-500">{alert.id}</span>
                  </div>
                  <span className={`text-xs font-bold capitalize ${
                    alert.status === 'REVIEWED' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {alert.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{alert.userName}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 flex justify-between">
                  <span>Type: <strong>{alert.ruleName || alert.ruleCode}</strong></span>
                  <span>Reported: {new Date(alert.flaggedAt).toLocaleDateString()}</span>
                </div>

                {alert.status === 'OPEN' && (
                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs py-1 text-slate-600"
                      onClick={() => resolveFraudAlert(alert.id, 'DISMISSED', 'Alert dismissed after inspection.')}
                    >
                      Dismiss Flag
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs py-1 bg-rose-600 hover:bg-rose-700"
                      onClick={() => resolveFraudAlert(alert.id, 'REVIEWED', 'Flagged account restricted & vendor reclassified.')}
                    >
                      Enforce Restrictions & Resolve
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG TRAIL */}
      {activeTab === 'audit_logs' && (
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Target User</th>
                  <th className="p-4">Action Taken</th>
                  <th className="p-4">Reviewer / Admin</th>
                  <th className="p-4">Audit Justification / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {verificationAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No audit events logged.
                    </td>
                  </tr>
                ) : (
                  verificationAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono text-[11px] text-slate-500">
                        {log.date || log.timestamp}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {log.userName}
                        <span className="block text-[10px] text-slate-400 font-mono">ID: {log.userId}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                          log.action === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700 font-medium">
                        {log.reviewerName}
                      </td>
                      <td className="p-4 text-slate-600 max-w-sm">
                        {log.reason || log.notes || 'Routine protocol compliance review'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* VERIFICATION REVIEW MODAL */}
      {reviewingRequest && (
        <Modal
          isOpen={Boolean(reviewingRequest)}
          onClose={() => setReviewingRequest(null)}
          title={`Audit Credentials: ${reviewingRequest.userName}`}
          subtitle={`Verification Request ID: ${reviewingRequest.id} • Role: ${(reviewingRequest.role || reviewingRequest.userRole || 'FARMER').toUpperCase()}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Applicant credentials summary */}
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-emerald-400">
                  Attached Identity & Compliance Documents
                </span>
                <span className="text-[11px] text-slate-400">Encrypted Proofs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {reviewingRequest.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-slate-800 rounded-xl space-y-1 text-xs border border-slate-700">
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                      {(doc.title || doc.docType || 'DOCUMENT').replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-emerald-300 font-bold text-sm block">
                      {doc.maskedNumber || doc.documentNumberMasked}
                    </span>
                    <span className="text-[11px] text-slate-400">Doc Status: {doc.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Reason Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Rejection Reason (Mandatory if Rejecting)
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select standard rejection reason...</option>
                <option value="Incomplete or unreadable 7/12 Land Record copy">Incomplete or unreadable 7/12 Land Record copy</option>
                <option value="Aadhaar / Identity document name does not match registered name">Aadhaar / Identity document name does not match registered name</option>
                <option value="Invalid GSTIN / Mandi license registration number">Invalid GSTIN / Mandi license registration number</option>
                <option value="Intermediary trader claiming direct farmer status without land title">Intermediary trader claiming direct farmer status without land title</option>
                <option value="FPO society registration certificate expired or unverifiable">FPO society registration certificate expired or unverifiable</option>
              </select>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Audit Notes & Justification (Recorded in Audit Log)
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Cross-referenced with state land revenue portal. 7/12 record 742/3A matches applicant name and village."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReviewingRequest(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={isProcessing}
                onClick={() => handleReviewAction('REJECTED')}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Reject Application
              </Button>
              <Button
                variant="harvest"
                size="sm"
                disabled={isProcessing}
                onClick={() => handleReviewAction('REQUESTED_INFO')}
                leftIcon={<AlertCircle className="w-4 h-4" />}
              >
                Request Re-submission
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isProcessing}
                onClick={() => handleReviewAction('APPROVED')}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Approve & Issue Verified Badge
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ROLE CHANGE AUDIT MODAL */}
      {reviewingRoleChange && (
        <Modal
          isOpen={Boolean(reviewingRoleChange)}
          onClose={() => setReviewingRoleChange(null)}
          title={`Role Transition Audit: ${reviewingRoleChange.userName}`}
          subtitle={`Transition from ${reviewingRoleChange.currentRole.toUpperCase()} to ${reviewingRoleChange.requestedRole.toUpperCase()}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <p><strong className="text-slate-900">Applicant Justification:</strong></p>
              <p className="text-slate-700">{reviewingRoleChange.reason}</p>
              <p><strong className="text-slate-900">Document Reference:</strong> <span className="font-mono text-slate-800">{reviewingRoleChange.supportingDocuments?.[0] || 'None'}</span></p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Auditor Assessment Notes
              </label>
              <textarea
                rows={2}
                value={roleChangeNotes}
                onChange={(e) => setRoleChangeNotes(e.target.value)}
                placeholder="e.g. Verified FPO incorporation certificate with state registrar."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setReviewingRoleChange(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={isProcessing}
                onClick={() => handleRoleChangeAction('REJECTED')}
              >
                Reject Transition
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isProcessing}
                onClick={() => handleRoleChangeAction('APPROVED')}
              >
                Approve Role Change
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
