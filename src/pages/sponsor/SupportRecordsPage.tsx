import React from 'react';
import { useData } from '../../context/DataContext';
import { Award, FileText, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const SupportRecordsPage: React.FC = () => {
  const { supportRecords } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Free-Support CSR Grant Disbursal Ledger
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
            {supportRecords.length} Grants
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          100% Non-repayable philanthropic agricultural input assistance. Zero debt model.
        </p>
      </div>

      <div className="space-y-4">
        {supportRecords.map((sup) => (
          <Card key={sup.id} hover className="p-6 border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{sup.supportType}</h3>
                    <Badge variant="amber" size="sm">CSR Grant</Badge>
                    <Badge variant="emerald" size="sm">Disbursed</Badge>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Beneficiary Farmer: <strong className="text-slate-700">{sup.farmerName}</strong> ({sup.farmerVillage}) • Disbursed: {sup.date}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Valuation of Inputs</span>
                <span className="text-xl font-black text-amber-700">
                  ₹{sup.supportValue.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block">
                  100% Non-Repayable
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">Grant Summary:</span>
              <p>{sup.description}</p>
              <p className="text-[10px] text-slate-400 mt-2">Sponsoring CSR Entity: {sup.organizationName}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
