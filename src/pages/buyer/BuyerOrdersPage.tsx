import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { OrderStatus, Order } from '../../types';
import { 
  Package, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  CreditCard, 
  XCircle, 
  ArrowRight,
  ShieldCheck,
  Phone,
  AlertCircle,
  Zap,
  Bike,
  Building2,
  Thermometer,
  Sparkles,
  Lock,
  KeyRound,
  Copy,
  Check
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { PaymentModal } from './PaymentModal';
import { OtpVerificationModal } from '../../components/delivery/OtpVerificationModal';
import { CropTraceabilityModal } from '../../components/verification/CropTraceabilityModal';
import { CropSourceBadge } from '../../components/verification/CropSourceBadge';
import { RealOrderTrackingMap } from '../../components/maps/RealOrderTrackingMap';
import { QrCode, ExternalLink, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BuyerOrdersPage: React.FC = () => {
  const { currentUser, buyerProfile } = useAuth();
  const { orders, updateOrderStatus, deliveries, crops, verifyDeliveryOtp } = useData();

  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
  const [selectedTraceCrop, setSelectedTraceCrop] = useState<any | null>(null);
  const [expandedMapOrderId, setExpandedMapOrderId] = useState<string | null>(null);
  const [selectedOrderForOtpVerification, setSelectedOrderForOtpVerification] = useState<Order | null>(null);
  const [copiedOtpId, setCopiedOtpId] = useState<string | null>(null);

  const handleCopyOtp = (orderId: string, otp: string) => {
    try {
      navigator.clipboard.writeText(otp);
      setCopiedOtpId(orderId);
      setTimeout(() => setCopiedOtpId(null), 2000);
    } catch (err) {}
  };

  const myOrders = orders.filter(
    o => o.buyerId === buyerProfile?.id || o.buyerId === currentUser?.id || o.buyerId === 'buyer_freshmart'
  );

  const BULK_STAGES: OrderStatus[] = [
    'REQUESTED',
    'ACCEPTED',
    'HARVESTING',
    'PICKUP',
    'IN_TRANSIT',
    'DELIVERED'
  ];

  const EXPRESS_STAGES = [
    { key: 'RECEIVED', label: 'Store Received' },
    { key: 'PACKED', label: 'Vault Packed' },
    { key: 'IN_TRANSIT', label: 'Rider Dispatched' },
    { key: 'NEARBY', label: 'Arriving in 10m' },
    { key: 'DELIVERED', label: 'Delivered' }
  ];

  const getBulkStageIndex = (status: OrderStatus) => {
    return BULK_STAGES.indexOf(status);
  };

  const getExpressStageIndex = (status: OrderStatus) => {
    if (status === 'REQUESTED') return 0;
    if (status === 'ACCEPTED' || status === 'HARVESTING' || status === 'PICKUP') return 1;
    if (status === 'IN_TRANSIT') return 2;
    if (status === 'DELIVERED' || status === 'COMPLETED') return 4;
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            My Orders & Delivery Tracking
            <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full">
              {myOrders.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking for Hyperlocal 15-min Dark Store Home Delivery and Standard Bulk Farm Logistics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/buyer/marketplace">
            <Button variant="harvest" size="sm" className="text-xs font-black" leftIcon={<Zap className="w-4 h-4 text-slate-900" />}>
              Shop Home Needs
            </Button>
          </Link>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {myOrders.length === 0 ? (
          <Card className="p-12 text-center text-slate-400 border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold">No orders placed yet.</p>
          </Card>
        ) : (
          myOrders.map((order) => {
            const isExpress = order.fulfillmentType === 'DARK_STORE_EXPRESS';
            const matchedCrop = crops.find(c => c.id === order.cropId || c.cropName === order.cropName);
            const batchId = order.batchId || matchedCrop?.batchId || 'FS-TOM-2026-00124';
            const deliveryInfo = deliveries.find(d => d.orderId === order.id || d.orderNumber === order.orderNumber);

            return (
              <Card key={order.id} hover className="p-6 border-slate-200 space-y-6">
                
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl font-bold ${
                      isExpress ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isExpress ? <Zap className="w-5 h-5 text-emerald-600 animate-pulse" /> : <Package className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-slate-900">{order.orderNumber}</span>
                        {isExpress ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                            <Zap className="w-3 h-3" /> 15m Dark Store Express
                          </span>
                        ) : (
                          <CropSourceBadge
                            sourceType={matchedCrop?.sourceType || 'FARMER'}
                            isResale={Boolean(matchedCrop?.isResale || matchedCrop?.sourceType === 'VENDOR')}
                            size="sm"
                          />
                        )}
                        <span className="font-mono text-xs text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {batchId}
                        </span>
                        <Badge variant={isExpress ? 'emerald' : 'blue'} size="sm">
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={order.paymentStatus === 'Paid' ? 'emerald' : 'amber'} size="sm">
                          {order.paymentStatus === 'Paid' ? 'Paid in Escrow' : 'Payment Pending'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          Placed on {new Date(order.createdAt).toLocaleDateString()} • {isExpress ? 'Hub:' : 'Producer:'} <strong className="text-slate-700">{order.darkStoreName || order.farmerName}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedTraceCrop(matchedCrop || { name: order.cropName, batchId, farmerName: order.farmerName, price: order.unitPrice })}
                          className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-1"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Digital Trace QR
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">{isExpress ? 'Order Total' : 'Contract Value'}</span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {order.quantity} kg @ ₹{order.unitPrice}/kg
                    </span>
                  </div>
                </div>

                {/* MULTI-STAGE VISUAL PROGRESS TRACKER */}
                {isExpress ? (
                  // EXPRESS DARK STORE LIFECYCLE
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        Live Hyperlocal Dark Store Delivery Progress
                      </span>
                      <div className="flex items-center gap-2">
                        {order.status === 'COMPLETED' ? (
                          <span className="text-[11px] font-black text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
                            ✅ Delivered & Inspected
                          </span>
                        ) : (
                          <span className="text-[11px] font-black text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
                            ⚡ Arriving within ~{order.estimatedDeliveryMinutes || 14} Mins
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {EXPRESS_STAGES.map((st, sIdx) => {
                        const currentIdx = getExpressStageIndex(order.status);
                        const isPast = sIdx < currentIdx;
                        const isCurrent = sIdx === currentIdx;

                        return (
                          <button
                            type="button"
                            key={st.key}
                            onClick={() => {
                              if (st.key === 'DELIVERED') {
                                updateOrderStatus(order.id, 'DELIVERED');
                              } else if (st.key === 'IN_TRANSIT' || st.key === 'NEARBY') {
                                updateOrderStatus(order.id, 'IN_TRANSIT');
                              }
                            }}
                            className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer text-left sm:text-center ${
                              isCurrent
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold ring-2 ring-emerald-400/30'
                                : isPast
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold'
                                : 'bg-white hover:bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                            title={`Click to set stage to ${st.label}`}
                          >
                            <div className="flex items-center justify-center mb-1">
                              {isPast ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              ) : isCurrent ? (
                                <Bike className="w-4 h-4 text-white animate-bounce" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                              )}
                            </div>
                            <span className="text-[10px] block uppercase font-black tracking-tight">
                              {st.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  // STANDARD BULK LOGISTICS LIFECYCLE
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Live Freight & Mandi Procurement Stage
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                      {BULK_STAGES.map((st, sIdx) => {
                        const currentIdx = getBulkStageIndex(order.status);
                        const isPast = sIdx < currentIdx;
                        const isCurrent = sIdx === currentIdx;

                        return (
                          <div
                            key={st}
                            className={`p-2.5 rounded-xl text-center border transition-all ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                                : isPast
                                ? 'bg-blue-100/70 text-blue-900 border-blue-200 font-semibold'
                                : 'bg-white text-slate-400 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-1">
                              {isPast ? (
                                <CheckCircle2 className="w-4 h-4 text-blue-700" />
                              ) : isCurrent ? (
                                <Clock className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '3s' }} />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                              )}
                            </div>
                            <span className="text-[10px] block uppercase font-bold tracking-tight">
                              {st.replace('_', ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Details & Logistics Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Crop Spec & Pack</span>
                    <p className="font-bold text-slate-900 text-sm">{order.cropName}</p>
                    <p className="text-slate-500">{order.cropVariety}</p>
                    <p className="font-semibold text-emerald-700">
                      {order.quantity} kg {isExpress ? '(Home Retail Pack)' : '(Wholesale Freight)'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Delivery Destination</span>
                    <p className="text-slate-800 font-semibold leading-snug flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                      {order.deliveryLocation}
                    </p>
                    <p className="text-slate-400">
                      {isExpress ? 'Dispatched via Nearest EV Fleet' : `Target Date: ${order.expectedDeliveryDate}`}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {isExpress ? 'Assigned Dark Store & Rider' : 'Logistics Status'}
                    </span>
                    {isExpress ? (
                      <div>
                        <p className="font-bold text-emerald-700 flex items-center gap-1">
                          <Bike className="w-3.5 h-3.5" /> {order.riderName || 'EV Rider #4 (On the Way)'}
                        </p>
                        <p className="text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {order.riderPhone || '+91 98480 88221'}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          Vault Origin: {order.darkStoreName || 'Benz Circle Hub'}
                        </p>
                      </div>
                    ) : deliveryInfo ? (
                      <div>
                        <p className="font-bold text-indigo-700">{deliveryInfo.status}</p>
                        <p className="text-slate-500">{deliveryInfo.logisticsName}</p>
                        <p className="text-[10px] text-slate-400 truncate">{deliveryInfo.trackingNotes}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400">Logistics dispatch assigned upon pickup ready.</p>
                    )}
                  </div>
                </div>

                {/* SECURE DOORSTEP HANDOVER OTP CARD */}
                <div className="p-4 rounded-2xl border transition-all bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                          Doorstep Delivery Handover PIN
                        </span>
                        <p className="text-xs text-slate-300">
                          {order.isOtpVerified || order.status === 'DELIVERED' || order.status === 'COMPLETED'
                            ? 'Handover authenticated & produce inspection verified'
                            : 'Provide this 4-digit PIN to the delivery rider only after inspecting your produce at the doorstep'}
                        </p>
                      </div>
                    </div>

                    {order.isOtpVerified || order.status === 'DELIVERED' || order.status === 'COMPLETED' ? (
                      <div className="flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>OTP Handover Verified ✓ ({order.deliveryOtp || '4829'})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="px-4 py-1.5 bg-white/10 rounded-xl border border-white/20 backdrop-blur-xs flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Secret PIN:</span>
                          <span className="font-mono text-xl font-black text-emerald-400 tracking-widest">
                            {order.deliveryOtp || '4829'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyOtp(order.id, order.deliveryOtp || '4829')}
                          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15 cursor-pointer"
                          title="Copy OTP to clipboard"
                        >
                          {copiedOtpId === order.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {!order.isOtpVerified && order.status !== 'DELIVERED' && order.status !== 'COMPLETED' && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-700/60">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Escrow Payout Protected • Funds released only when customer provides 4-digit PIN upon physical inspection
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedOrderForOtpVerification(order)}
                        className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1 cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" /> Authenticate Handover (Rider Mode)
                      </button>
                    </div>
                  )}
                </div>

                {/* Live Real Map Radar (When Expanded or In-Transit) */}
                {(expandedMapOrderId === order.id || (isExpress && order.status === 'IN_TRANSIT')) && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Navigation className="w-4 h-4 text-emerald-600" />
                        Live Transit Tracking Radar Map
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Real-time GPS coordinates via OpenStreetMap
                      </span>
                    </div>
                    <RealOrderTrackingMap
                      originLocation={order.darkStoreName || order.farmerName || 'Origin Depot'}
                      deliveryLocation={order.deliveryLocation}
                      orderNumber={order.orderNumber}
                      cropName={order.cropName}
                      quantityKg={order.quantity}
                      status={order.status}
                      driverName={order.riderName || deliveryInfo?.driverName || 'Kishore Varma'}
                      driverPhone={order.riderPhone || deliveryInfo?.driverPhone || '+91 97000 11223'}
                      vehiclePlate={deliveryInfo?.vehiclePlate || 'AP 16 TX 4412'}
                      isExpress={isExpress}
                    />
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedMapOrderId(expandedMapOrderId === order.id ? null : order.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                        expandedMapOrderId === order.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{expandedMapOrderId === order.id ? 'Hide Live Map' : '🗺️ View Live GPS Map'}</span>
                    </button>
                    
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      {order.paymentStatus === 'Pending' && 'Payment required to initiate harvesting.'}
                      {order.status === 'DELIVERED' && 'Produce delivered & OTP verified. Please confirm freshness inspection.'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {order.status === 'REQUESTED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        className="text-rose-600 hover:bg-rose-50 border-rose-200"
                      >
                        Cancel Order
                      </Button>
                    )}

                    {order.paymentStatus === 'Pending' && (
                      <Button
                        variant="harvest"
                        size="sm"
                        onClick={() => setSelectedOrderForPayment(order)}
                        leftIcon={<CreditCard className="w-4 h-4 text-slate-900" />}
                      >
                        Pay ₹{order.totalAmount.toLocaleString('en-IN')} (Simulated)
                      </Button>
                    )}

                    {/* Dark Store Express OTP Handover Trigger */}
                    {isExpress && order.status === 'IN_TRANSIT' && (
                      <Button
                        variant="harvest"
                        size="sm"
                        onClick={() => setSelectedOrderForOtpVerification(order)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black"
                        leftIcon={<KeyRound className="w-4 h-4" />}
                      >
                        🔑 Authenticate Handover with OTP
                      </Button>
                    )}

                    {/* Standard Freight Delivery Handover Trigger */}
                    {!isExpress && order.status === 'IN_TRANSIT' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedOrderForOtpVerification(order)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                        leftIcon={<KeyRound className="w-4 h-4" />}
                      >
                        🔑 Verify Handover OTP
                      </Button>
                    )}

                    {order.status === 'DELIVERED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        {isExpress ? 'Confirm 15-Min Delivery & Inspect' : 'Confirm Delivery & Release Escrow'}
                      </Button>
                    )}

                    {order.status === 'COMPLETED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Delivered & Verified
                      </span>
                    )}
                  </div>
                </div>

              </Card>
            );
          })
        )}
      </div>

      {/* OTP Verification Modal */}
      {selectedOrderForOtpVerification && (
        <OtpVerificationModal
          isOpen={Boolean(selectedOrderForOtpVerification)}
          onClose={() => setSelectedOrderForOtpVerification(null)}
          orderNumber={selectedOrderForOtpVerification.orderNumber}
          expectedOtp={selectedOrderForOtpVerification.deliveryOtp || '4829'}
          recipientName={selectedOrderForOtpVerification.buyerName}
          deliveryLocation={selectedOrderForOtpVerification.deliveryLocation}
          cropName={selectedOrderForOtpVerification.cropName}
          quantityKg={selectedOrderForOtpVerification.quantity}
          riderName={selectedOrderForOtpVerification.riderName}
          onSuccess={(verifiedOtp) => {
            verifyDeliveryOtp(selectedOrderForOtpVerification.id, verifiedOtp);
            setSelectedOrderForOtpVerification(null);
          }}
        />
      )}

      {/* Payment Modal */}
      <PaymentModal
        order={selectedOrderForPayment}
        isOpen={Boolean(selectedOrderForPayment)}
        onClose={() => setSelectedOrderForPayment(null)}
      />

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

