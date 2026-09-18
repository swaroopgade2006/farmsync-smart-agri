import React from 'react';
import { useData } from '../../context/DataContext';
import { Package, CheckCircle2, MapPin, DollarSign, Building } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const OrderManagementPage: React.FC = () => {
  const { orders } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Global Orders & Escrow Settlements
          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">
            {orders.length} Total
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Master transaction log across all farmers, buyers, and logistics carriers
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <Card key={o.id} hover className="p-6 border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{o.orderNumber}</span>
                    <Badge variant="blue" size="sm">{o.status}</Badge>
                    <Badge variant={o.paymentStatus === 'Paid' ? 'emerald' : 'amber'} size="sm">
                      {o.paymentStatus}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Buyer: {o.buyerBusinessName} ➔ Farmer: {o.farmerName}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-slate-900">
                  ₹{o.totalAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 block">
                  {o.quantity} kg of {o.cropName}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 flex flex-wrap justify-between gap-2">
              <span>Destination: {o.deliveryLocation}</span>
              <span>Expected Date: {o.expectedDeliveryDate}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
