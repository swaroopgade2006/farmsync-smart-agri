import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DeliveryStatus, Delivery } from '../../types';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Package, 
  ArrowRight, 
  AlertCircle, 
  Navigation, 
  Thermometer, 
  Radio, 
  AlertTriangle, 
  AlertOctagon, 
  Sparkles,
  Bike,
  Zap,
  Lock,
  ShieldCheck,
  KeyRound
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { OtpVerificationModal } from '../../components/delivery/OtpVerificationModal';

export const DeliveriesPage: React.FC = () => {
  const { currentUser, logisticsProfile } = useAuth();
  const { deliveries, updateDeliveryStatus, verifyDeliveryOtp } = useData();

  const [statusNotes, setStatusNotes] = useState<{ [key: string]: string }>({});
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'IN_TRANSIT' | 'EXPRESS' | 'WARNINGS'>('ALL');
  const [selectedDeliveryForOtp, setSelectedDeliveryForOtp] = useState<Delivery | null>(null);

  const STAGES: DeliveryStatus[] = [
    'Assigned',
    'Pickup Scheduled',
    'Picked Up',
    'In Transit',
    'Delivered'
  ];

  const getStatusBadgeVariant = (status: DeliveryStatus) => {
    switch (status) {
      case 'Assigned': return 'blue';
      case 'Pickup Scheduled': return 'amber';
      case 'Picked Up': return 'purple';
      case 'In Transit': return 'purple';
      case 'Delivered': return 'emerald';
      default: return 'slate';
    }
  };

  const handleNextStage = (delivery: Delivery) => {
    const currentIdx = STAGES.indexOf(delivery.status);
    if (currentIdx < STAGES.length - 1) {
      const nextStatus = STAGES[currentIdx + 1];
      if (nextStatus === 'Delivered') {
        setSelectedDeliveryForOtp(delivery);
        return;
      }
      const customNote = statusNotes[delivery.id] || `Status updated to ${nextStatus}`;
      updateDeliveryStatus(delivery.id, nextStatus, customNote);
    }
  };

  const filteredDeliveries = deliveries.filter(d => {
    if (selectedFilter === 'IN_TRANSIT') return d.status === 'In Transit' || d.status === 'Picked Up';
    if (selectedFilter === 'EXPRESS') return d.fulfillmentType === 'DARK_STORE_EXPRESS';
    if (selectedFilter === 'WARNINGS') return d.telemetryState === 'MID_CASE_WARNING' || d.telemetryState === 'WORST_CASE_CRITICAL';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Agricultural Dispatches & Cold-Chain Fleet
            <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2.5 py-1 rounded-full">
              {deliveries.length} Active Vehicles
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Refrigerated produce transit monitoring across AP & Telangana farm corridors & Dark Store Express Hubs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/logistics/radar">
            <Button
              variant="primary"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              leftIcon={<Radio className="w-4 h-4 animate-pulse" />}
            >
              Open Live Telemetry Radar
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedFilter === 'ALL'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Dispatches ({deliveries.length})
        </button>

        <button
          onClick={() => setSelectedFilter('IN_TRANSIT')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            selectedFilter === 'IN_TRANSIT'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Active On-Road ({deliveries.filter(d => d.status === 'In Transit' || d.status === 'Picked Up').length})
        </button>

        <button
          onClick={() => setSelectedFilter('EXPRESS')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedFilter === 'EXPRESS'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          ⚡ Dark Store Express ({deliveries.filter(d => d.fulfillmentType === 'DARK_STORE_EXPRESS').length})
        </button>

        <button
          onClick={() => setSelectedFilter('WARNINGS')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
            selectedFilter === 'WARNINGS'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Thermal Alerts ({deliveries.filter(d => d.telemetryState === 'MID_CASE_WARNING' || d.telemetryState === 'WORST_CASE_CRITICAL').length})
        </button>
      </div>

      {/* Deliveries List */}
      <div className="space-y-6">
        {filteredDeliveries.map((delivery) => {
          const isExpress = delivery.fulfillmentType === 'DARK_STORE_EXPRESS';
          const currentIdx = STAGES.indexOf(delivery.status);
          const isCritical = delivery.telemetryState === 'WORST_CASE_CRITICAL';
          const isWarning = delivery.telemetryState === 'MID_CASE_WARNING';

          return (
            <Card key={delivery.id} hover className={`p-6 border space-y-6 transition-all ${
              isExpress
                ? 'border-emerald-200 bg-emerald-50/10 ring-1 ring-emerald-500/10'
                : isCritical
                ? 'border-rose-300 ring-2 ring-rose-500/20 bg-rose-50/20'
                : isWarning
                ? 'border-amber-300 bg-amber-50/20'
                : 'border-slate-200'
            }`}>
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl font-bold ${
                    isExpress
                      ? 'bg-emerald-100 text-emerald-800'
                      : isCritical
                      ? 'bg-rose-100 text-rose-800'
                      : isWarning
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {isExpress ? <Bike className="w-5 h-5 text-emerald-600" /> : <Truck className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-black text-slate-900">{delivery.deliveryId}</span>
                      <span className="text-xs text-slate-400 font-mono">({delivery.orderNumber})</span>
                      {isExpress && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                          <Zap className="w-3 h-3" /> 15m Express
                        </span>
                      )}
                      <Badge variant={isExpress ? 'emerald' : getStatusBadgeVariant(delivery.status)} size="sm">
                        {delivery.status}
                      </Badge>
                      
                      {/* Telemetry Sensor Tag */}
                      {isCritical ? (
                        <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300 flex items-center gap-1 animate-pulse">
                          <AlertOctagon className="w-3 h-3 text-rose-600" />
                          Reefer Alarm: 25.4°C
                        </span>
                      ) : isWarning ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Deviation: 16.8°C
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-emerald-600" />
                          {isExpress ? 'Insulated Pack' : 'Cold-Chain'}: {delivery.initialTemperature || 11.7}°C
                        </span>
                      )}
                    </div>
                    
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {isExpress ? (
                        <>Dark Store Vault: <strong className="text-slate-800">{delivery.darkStoreName || 'Benz Circle Micro-Hub'}</strong> • Vehicle: {delivery.vehicleInfo || 'EV Cargo Scooter'}</>
                      ) : (
                        <>Carrier: <strong className="text-slate-800">{delivery.logisticsName}</strong> • Vehicle: {delivery.vehicleInfo}</>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Cargo Volume</span>
                    <span className="text-lg font-black text-slate-900">{delivery.quantity} kg</span>
                    <span className="text-xs text-emerald-700 font-bold block">{delivery.cropName}</span>
                  </div>

                  <Link to="/logistics/radar">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                      leftIcon={<Navigation className="w-3.5 h-3.5" />}
                    >
                      Radar View
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Multi-Stage Visual Delivery Tracker */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Delivery Workflow Stages
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STAGES.map((st, idx) => {
                    const isPast = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={st}
                        className={`p-2.5 rounded-xl text-center border transition-all ${
                          isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md font-bold'
                            : isPast
                            ? 'bg-indigo-100/70 text-indigo-800 border-indigo-200 font-semibold'
                            : 'bg-white text-slate-400 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1">
                          {isPast ? (
                            <CheckCircle2 className="w-4 h-4 text-indigo-700" />
                          ) : isCurrent ? (
                            <Clock className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '3s' }} />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-tight block">
                          {st}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transit Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Farm Pickup Origin</span>
                  <p className="font-semibold text-slate-900 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    {delivery.pickupLocation}
                  </p>
                  <p className="text-slate-500">Scheduled: {delivery.pickupDate}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Buyer Destination</span>
                  <p className="font-semibold text-slate-900 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                    {delivery.deliveryLocation}
                  </p>
                  <p className="text-slate-500">Target Delivery: {delivery.deliveryDate}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Driver & Telemetry</span>
                  <p className="font-bold text-slate-800">{delivery.driverName} ({delivery.driverPhone})</p>
                  <p className="text-[11px] text-slate-500">{delivery.trackingNotes}</p>
                </div>
              </div>

              {/* Advance Stage Action Button */}
              {currentIdx < STAGES.length - 1 ? (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                  <div className="text-xs text-indigo-950 font-medium flex items-center gap-2">
                    <span>Advance to next stage:</span>
                    <strong className="text-indigo-700 font-bold">{STAGES[currentIdx + 1]}</strong>
                    {STAGES[currentIdx + 1] === 'Delivered' && (
                      <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Lock className="w-3 h-3" /> OTP Auth Required
                      </span>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className={STAGES[currentIdx + 1] === 'Delivered' 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold" 
                      : "bg-indigo-600 hover:bg-indigo-700 text-white font-bold"}
                    onClick={() => handleNextStage(delivery)}
                    rightIcon={STAGES[currentIdx + 1] === 'Delivered' ? <KeyRound className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  >
                    {STAGES[currentIdx + 1] === 'Delivered' ? '🔑 Authenticate Handover (Verify OTP)' : `Mark as "${STAGES[currentIdx + 1]}"`}
                  </Button>
                </div>
              ) : (
                <div className="pt-2 flex items-center justify-between bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs">
                  <span className="text-emerald-900 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Doorstep Delivery Authenticated & Completed
                  </span>
                  <span className="font-mono font-black text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    OTP Verified ({delivery.deliveryOtp || '4829'})
                  </span>
                </div>
              )}

            </Card>
          );
        })}
      </div>

      {/* OTP Handover Verification Modal */}
      {selectedDeliveryForOtp && (
        <OtpVerificationModal
          isOpen={Boolean(selectedDeliveryForOtp)}
          onClose={() => setSelectedDeliveryForOtp(null)}
          orderNumber={selectedDeliveryForOtp.orderNumber || selectedDeliveryForOtp.deliveryId}
          expectedOtp={selectedDeliveryForOtp.deliveryOtp || '4829'}
          recipientName="Doorstep Customer / Consignee"
          deliveryLocation={selectedDeliveryForOtp.deliveryLocation}
          cropName={selectedDeliveryForOtp.cropName}
          quantityKg={selectedDeliveryForOtp.quantity}
          riderName={selectedDeliveryForOtp.driverName || selectedDeliveryForOtp.riderName}
          onSuccess={(verifiedOtp) => {
            verifyDeliveryOtp(selectedDeliveryForOtp.id, verifiedOtp);
            setSelectedDeliveryForOtp(null);
          }}
        />
      )}

    </div>
  );
};
