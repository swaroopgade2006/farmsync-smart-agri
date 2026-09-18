import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { VerificationDocument, UserRole } from '../../types';
import { ShieldCheck, Upload, FileText, CheckCircle2, AlertCircle, X, Building, User, Lock, Award, Info } from 'lucide-react';

interface AccountVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: UserRole;
}

export const AccountVerificationModal: React.FC<AccountVerificationModalProps> = ({
  isOpen,
  onClose,
  targetRole,
}) => {
  const { user } = useAuth();
  const { submitVerificationRequest } = useData();

  const activeRole = targetRole || user?.role || 'farmer';

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [district, setDistrict] = useState(user?.operatingLocation || 'Krishna');
  const [state, setState] = useState('Andhra Pradesh');

  // Farmer specific
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [landRecordPatta, setLandRecordPatta] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [kisanCreditCard, setKisanCreditCard] = useState('');

  // FPO specific
  const [fpoRegNumber, setFpoRegNumber] = useState('');
  const [memberCount, setMemberCount] = useState('');
  const [fpoOperatingArea, setFpoOperatingArea] = useState('');

  // Vendor specific
  const [businessName, setBusinessName] = useState(user?.fullName || '');
  const [gstNumber, setGstNumber] = useState(user?.maskedGst || '');
  const [mandiLicense, setMandiLicense] = useState(user?.maskedTradeLicense || '');
  const [panNumber, setPanNumber] = useState('');

  // Uploaded docs simulation state
  const [uploadedDocs, setUploadedDocs] = useState<{ type: string; name: string; url: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Masking helpers
  const maskString = (val: string, visibleTail = 4) => {
    if (!val) return '';
    if (val.length <= visibleTail) return val;
    return 'X'.repeat(val.length - visibleTail) + val.slice(-visibleTail);
  };

  const handleDocumentSimulateUpload = (type: string, docName: string) => {
    setUploadedDocs(prev => [...prev.filter(d => d.type !== type), {
      type,
      name: docName,
      url: `/docs/simulated_${type.toLowerCase()}.pdf`
    }]);
  };
  const handleSimulatedFileUpload = handleDocumentSimulateUpload;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError('Please login to submit a verification request.');
      return;
    }

    setIsSubmitting(true);

    try {
      const documents: VerificationDocument[] = [];

      if (activeRole === 'farmer') {
        documents.push(
          {
            id: `doc-${Date.now()}-1`,
            docType: 'AADHAAR_CARD',
            title: 'Aadhaar Identity Card',
            maskedNumber: maskString(aadhaarNumber.replace(/\s+/g, ''), 4),
            fileName: 'simulated_aadhaar.pdf',
            fileSize: '1.2 MB',
            uploadDate: new Date().toISOString(),
            status: 'PENDING'
          },
          {
            id: `doc-${Date.now()}-2`,
            docType: 'LAND_PATTA_712',
            title: '7/12 Land Revenue Record',
            maskedNumber: maskString(landRecordPatta, 3),
            fileName: 'simulated_land_record.pdf',
            fileSize: '2.4 MB',
            uploadDate: new Date().toISOString(),
            status: 'PENDING'
          }
        );
      } else if (activeRole === 'vendor') {
        documents.push(
          {
            id: `doc-${Date.now()}-1`,
            docType: 'GST_CERTIFICATE',
            title: 'GSTIN Certificate',
            maskedNumber: maskString(gstNumber, 4),
            fileName: 'simulated_gst.pdf',
            fileSize: '1.4 MB',
            uploadDate: new Date().toISOString(),
            status: 'PENDING'
          },
          {
            id: `doc-${Date.now()}-2`,
            docType: 'TRADE_LICENSE',
            title: 'APMC Trade License',
            maskedNumber: maskString(mandiLicense, 4),
            fileName: 'simulated_trade_license.pdf',
            fileSize: '1.8 MB',
            uploadDate: new Date().toISOString(),
            status: 'PENDING'
          }
        );
      } else if (activeRole === 'fpo') {
        documents.push(
          {
            id: `doc-${Date.now()}-1`,
            docType: 'FPO_REGISTRATION',
            title: 'FPO Registration Certificate',
            maskedNumber: maskString(fpoRegNumber, 4),
            fileName: 'simulated_fpo_cert.pdf',
            fileSize: '2.1 MB',
            uploadDate: new Date().toISOString(),
            status: 'PENDING'
          }
        );
      } else {
        documents.push({
          id: `doc-${Date.now()}-1`,
          docType: 'AADHAAR_CARD',
          title: 'Identity Proof',
          maskedNumber: 'XXXX-2026',
          fileName: 'simulated_id.pdf',
          fileSize: '1.0 MB',
          uploadDate: new Date().toISOString(),
          status: 'PENDING'
        });
      }

      await submitVerificationRequest({
        userId: user.id,
        userName: fullName || user.fullName || user.name || 'Applicant',
        role: activeRole,
        userRole: activeRole,
        phone: phone || user.phone,
        email: user.email,
        location: `${district}, ${state}`,
        district,
        state,
        documents,
        adminNotes: `Verification submitted for role: ${activeRole.toUpperCase()}. Masked documents attached.`,
      });

      setIsSubmittedSuccess(true);
      setTimeout(() => {
        setIsSubmittedSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit verification request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl relative text-slate-100 my-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Identity & Trust Verification
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                  {activeRole}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Submit official credentials to obtain official verified badge status.
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

        {/* Content */}
        {isSubmittedSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Verification Request Submitted!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your credentials have been securely transmitted to the FarmSync Admin Verification Center. All sensitive IDs are masked to protect your privacy. You will receive real-time status updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Privacy & Trust Info Box */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">Bank-Grade Privacy & ID Masking Protected</p>
                <p>
                  Your Aadhaar, PAN, GSTIN, and land records are encrypted. Public buyers and market participants will only see verified badges and masked identifiers (e.g. <span className="font-mono text-emerald-400">XXXX-XXXX-4821</span>).
                </p>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* General Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                1. General Profile Verification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="e.g. Nashik"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={e => setState(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Role Specific Credentials */}
            {activeRole === 'farmer' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> 2. Farmer Land & Identity Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Aadhaar / Govt ID Number *</label>
                    <input
                      type="text"
                      required
                      value={aadhaarNumber}
                      onChange={e => setAadhaarNumber(e.target.value)}
                      placeholder="XXXX-XXXX-4821 (12 digits)"
                      maxLength={14}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    {aadhaarNumber && (
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Masked Preview: <span className="text-emerald-400 font-mono">{maskString(aadhaarNumber, 4)}</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Land Record / 7/12 Patta Number *</label>
                    <input
                      type="text"
                      required
                      value={landRecordPatta}
                      onChange={e => setLandRecordPatta(e.target.value)}
                      placeholder="e.g. Khata / Survey No 742/3A"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Farm Land Size (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={farmSize}
                      onChange={e => setFarmSize(e.target.value)}
                      placeholder="e.g. 5.5"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">KCC / PM-KISAN ID (Optional)</label>
                    <input
                      type="text"
                      value={kisanCreditCard}
                      onChange={e => setKisanCreditCard(e.target.value)}
                      placeholder="KCC-9821039"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeRole === 'vendor' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4" /> 2. Vendor / Trading Firm Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Business / Firm Trading Name *</label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      placeholder="e.g. Deccan Fresh Logistics Pvt Ltd"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">GSTIN Number (15-digit) *</label>
                    <input
                      type="text"
                      required
                      value={gstNumber}
                      onChange={e => setGstNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. 27AABCT3518Q1Z5"
                      maxLength={15}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                    {gstNumber && (
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Masked Preview: <span className="text-amber-400 font-mono">{maskString(gstNumber, 4)}</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">APMC / Mandi Trade License *</label>
                    <input
                      type="text"
                      required
                      value={mandiLicense}
                      onChange={e => setMandiLicense(e.target.value)}
                      placeholder="e.g. APMC-VND-2024-789"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">PAN Card Number</label>
                    <input
                      type="text"
                      value={panNumber}
                      onChange={e => setPanNumber(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeRole === 'fpo' && (
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4" /> 2. FPO Cooperative Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">FPO Society Registration Number *</label>
                    <input
                      type="text"
                      required
                      value={fpoRegNumber}
                      onChange={e => setFpoRegNumber(e.target.value)}
                      placeholder="e.g. FPO-MH-2024-8891"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Total Member Farmers Count *</label>
                    <input
                      type="number"
                      required
                      value={memberCount}
                      onChange={e => setMemberCount(e.target.value)}
                      placeholder="e.g. 340"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-300 mb-1">Coverage Villages / Clusters</label>
                    <input
                      type="text"
                      value={fpoOperatingArea}
                      onChange={e => setFpoOperatingArea(e.target.value)}
                      placeholder="e.g. Niphad, Dindori, Yeola Talukas"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Document Uploads simulation */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>3. Attach Document Proofs (PDF / JPG)</span>
                <span className="text-[11px] text-emerald-400 font-normal">Encrypted & Masked</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSimulatedFileUpload('doc1', activeRole === 'farmer' ? '7/12 Land Patta' : activeRole === 'vendor' ? 'GST Certificate' : 'Registration Proof')}
                  className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-dashed border-slate-600 hover:border-emerald-500 rounded-xl flex items-center gap-3 transition-colors text-left"
                >
                  <Upload className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">
                      {activeRole === 'farmer' ? 'Upload 7/12 Patta' : activeRole === 'vendor' ? 'Upload GST Certificate' : 'Upload Reg Certificate'}
                    </p>
                    <p className="text-slate-400 text-[11px]">Click to attach file</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulatedFileUpload('doc2', activeRole === 'farmer' ? 'Aadhaar / ID Copy' : activeRole === 'vendor' ? 'Mandi Trade License' : 'Member Roster')}
                  className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-dashed border-slate-600 hover:border-emerald-500 rounded-xl flex items-center gap-3 transition-colors text-left"
                >
                  <Upload className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-white">
                      {activeRole === 'farmer' ? 'Upload Aadhaar Card' : activeRole === 'vendor' ? 'Upload Mandi License' : 'Upload Member List'}
                    </p>
                    <p className="text-slate-400 text-[11px]">Click to attach file</p>
                  </div>
                </button>
              </div>

              {uploadedDocs.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {uploadedDocs.map(doc => (
                    <div key={doc.type} className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <span className="text-emerald-400 text-[11px]">Ready to submit ✓</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
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
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? 'Verifying & Submitting...' : 'Submit Official Verification'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
