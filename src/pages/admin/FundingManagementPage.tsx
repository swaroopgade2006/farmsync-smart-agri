import React from 'react';
import { useData } from '../../context/DataContext';
import { TrendingUp, Award, HeartHandshake, DollarSign, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const FundingManagementPage: React.FC = () => {
  const { fundingAgreements, supportRecords } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Capital Agreements & CSR Grants Master Ledger
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete audit trail of institutional funding agreements and non-repayable philanthropic support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Funded */}
        <Card className="p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Funded Farmer Agreements ({fundingAgreements.length})
            </h3>
            <Badge variant="emerald" size="sm">Revenue-Share</Badge>
          </div>

          <div className="space-y-3">
            {fundingAgreements.map((agr) => (
              <div key={agr.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{agr.farmerName} ➔ {agr.investorName}</span>
                  <span className="text-emerald-700 font-extrabold">₹{agr.amount.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-slate-600">{agr.terms}</p>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>Date: {agr.agreementDate}</span>
                  <span className="font-bold text-emerald-800">Return: {agr.expectedReturnPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Free-Support */}
        <Card className="p-6 border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Free CSR Support Grants ({supportRecords.length})
            </h3>
            <Badge variant="amber" size="sm">Non-Repayable</Badge>
          </div>

          <div className="space-y-3">
            {supportRecords.map((sup) => (
              <div key={sup.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{sup.farmerName} (Recipient)</span>
                  <span className="text-amber-700 font-extrabold">Valued at ₹{sup.supportValue.toLocaleString('en-IN')}</span>
                </div>
                <p className="font-semibold text-slate-800">{sup.supportType}</p>
                <p className="text-slate-600">{sup.description}</p>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                  <span>Sponsor: {sup.organizationName}</span>
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
