import React from 'react';
import { useData } from '../../context/DataContext';
import { TrendingUp, FileText, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AgreementsListPage: React.FC = () => {
  const { fundingAgreements } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Funded Farmer Agreements Ledger
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            {fundingAgreements.length} Total
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Legally binding profit-sharing capital contracts with verified farmers
        </p>
      </div>

      <div className="space-y-4">
        {fundingAgreements.map((agr) => (
          <Card key={agr.id} hover className="p-6 border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{agr.farmerName}</h3>
                    <Badge variant="emerald" size="sm">Active Agreement</Badge>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    {agr.farmerVillage}, {agr.farmerDistrict}, {agr.farmerState} • Date: {agr.agreementDate}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Committed Capital</span>
                <span className="text-xl font-black text-emerald-700">
                  ₹{agr.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Return Share: {agr.expectedReturnPercentage}%
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block">Terms & Crop Project:</span>
              <p>{agr.cropName ? `Cultivation Project: ${agr.cropName}` : 'General Farm Input Support'}</p>
              <p className="text-slate-600 mt-1">{agr.terms}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
