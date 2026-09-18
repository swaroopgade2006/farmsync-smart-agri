import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OrderStatus } from '../../types';
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Scissors, 
  MapPin, 
  Clock, 
  DollarSign, 
  AlertCircle,
  Phone,
  Building
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { CropTraceabilityModal } from '../../components/verification/CropTraceabilityModal';
import { CropSourceBadge } from '../../components/verification/CropSourceBadge';
import { ShieldCheck, QrCode, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FarmerOrdersPage: React.FC = () => {
  const { currentUser, farmerProfile, user } = useAuth();
  const { orders, updateOrderStatus, crops } = useData();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedTraceCrop, setSelectedTraceCrop] = useState<any | null>(null);

  const myOrders = orders.filter(
    o => o.farmerId === farmerProfile?.id || o.farmerId === currentUser?.id || o.farmerId === user?.id || o.farmerId === 'farmer_ravi'
  );

  const filteredOrders = myOrders.filter(
    o => filterStatus === 'ALL' || o.status === filterStatus
  );

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'REQUESTED': return 'blue';
      case 'ACCEPTED': return 'emerald';
      case 'HARVESTING': return 'amber';
      case 'PICKUP': return 'purple';
      case 'IN_TRANSIT': return 'purple';
      case 'DELIVERED': return 'emerald';
      case 'COMPLETED': return 'emerald';
      case 'REJECTED': return 'rose';
      case 'CANCELLED': return 'slate';
      default: return 'slate';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Incoming Buyer Orders & Realization Ledger
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              {myOrders.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Accept buyer purchase requests, monitor transparent realization, and track digital lot batches
          </p>
        </div>
      </div>

      {/* Farmer Protection Ledger Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Farmer Protection & Direct Realization Guarantee
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-mono">
                100% Direct Payout
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Every lot is tracked on our decentralized ledger. You receive the full listed unit price into your verified bank account without hidden mandi cuts.
            </p>
          </div>
        </div>

        <Link
          to="/trace/FS-TOM-2026-00124"
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0"
        >
          <span>Audit Provenance Ledger</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {['ALL', 'REQUESTED', 'ACCEPTED', 'HARVESTING', 'PICKUP', 'IN_TRANSIT', 'DELIVERED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === st
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold">No orders found matching this status.</p>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const matchedCrop = crops.find(c => c.id === order.cropId || c.cropName === order.cropName);
            const batchId = order.batchId || matchedCrop?.batchId || 'FS-TOM-2026-00124';

            return (
              <Card key={order.id} hover className="p-6 border-slate-200 space-y-5">
                
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-black text-slate-900">{order.orderNumber}</span>
                        <span className="font-mono text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {batchId}
                        </span>
                        <Badge variant={getStatusBadgeVariant(order.status)} size="sm">
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={order.paymentStatus === 'Paid' ? 'emerald' : 'amber'} size="sm">
                          Payment: {order.paymentStatus}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} • Expected Delivery: {order.expectedDeliveryDate}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Direct Farmer Realization</span>
                    <span className="text-xl font-black text-emerald-700">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      (₹{order.unitPrice}/kg × {order.quantity} kg • 0% Intermediary Fee)
                    </span>
                  </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  
                  {/* Crop Spec */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Crop Requested</span>
                    <p className="font-bold text-slate-900 text-sm">{order.cropName}</p>
                    <p className="text-slate-500">{order.cropVariety}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="font-semibold text-emerald-800">{order.quantity} kg</span>
                      <button
                        type="button"
                        onClick={() => setSelectedTraceCrop(matchedCrop || { name: order.cropName, batchId, farmerName: order.farmerName, price: order.unitPrice })}
                        className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <QrCode className="w-3 h-3" /> Trace Lot
                      </button>
                    </div>
                  </div>

                  {/* Buyer Details */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Buyer Organization</span>
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-blue-600" />
                      {order.buyerBusinessName}
                    </p>
                    <p className="text-slate-600 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {order.buyerPhone || '+91 99887 76655'}
                    </p>
                  </div>

                  {/* Delivery Location */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Destination Yard</span>
                    <p className="text-slate-700 leading-snug flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                      {order.deliveryLocation}
                    </p>
                  </div>
                </div>

              {/* Farmer Workflow Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {order.status === 'REQUESTED' && 'Buyer has submitted purchase order. Please accept or reject.'}
                  {order.status === 'ACCEPTED' && 'Order confirmed. Click "Start Harvesting" once cutting commences.'}
                  {order.status === 'HARVESTING' && 'Crops are being harvested and graded. Mark ready for logistics pickup.'}
                  {order.status === 'PICKUP' && 'Awaiting logistics vehicle pickup at farm depot.'}
                  {order.status === 'IN_TRANSIT' && 'In transit with logistics carrier.'}
                  {order.status === 'DELIVERED' && 'Delivered to buyer yard. Payment released from escrow.'}
                </div>

                <div className="flex items-center space-x-2">
                  {order.status === 'REQUESTED' && (
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'REJECTED')}
                        leftIcon={<XCircle className="w-4 h-4" />}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'ACCEPTED')}
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Accept Order
                      </Button>
                    </>
                  )}

                  {order.status === 'ACCEPTED' && (
                    <Button
                      variant="harvest"
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'HARVESTING')}
                      leftIcon={<Scissors className="w-4 h-4 text-slate-900" />}
                    >
                      Mark as Harvesting
                    </Button>
                  )}

                  {order.status === 'HARVESTING' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updateOrderStatus(order.id, 'PICKUP')}
                      leftIcon={<Truck className="w-4 h-4" />}
                    >
                      Mark Ready for Pickup
                    </Button>
                  )}
                </div>
              </div>

            </Card>
          );
        })
      )}
      </div>

      {/* Traceability Modal */}
      {selectedTraceCrop && (
        <CropTraceabilityModal
          crop={selectedTraceCrop}
          isOpen={Boolean(selectedTraceCrop)}
          onClose={() => setSelectedTraceCrop(null)}
        />
      )}

    </div>
  );
};
