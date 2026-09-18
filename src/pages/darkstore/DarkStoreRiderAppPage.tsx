import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Order, Delivery, DarkStore } from '../../types';
import { 
  Bike, 
  Zap, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertCircle, 
  Sparkles, 
  BatteryCharging, 
  Wallet, 
  ArrowRight, 
  Check, 
  X, 
  Volume2, 
  VolumeX, 
  Thermometer, 
  Package, 
  RotateCw, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  ArrowUpRight,
  Radio,
  Star,
  Building2,
  Share2
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { RealOrderTrackingMap } from '../../components/maps/RealOrderTrackingMap';
import { OtpVerificationModal } from '../../components/delivery/OtpVerificationModal';
import confetti from 'canvas-confetti';

type RiderDeliveryStep = 'TO_HUB' | 'PICKUP_BAG' | 'TO_CUSTOMER' | 'OTP_HANDOVER';

export const DarkStoreRiderAppPage: React.FC = () => {
  const { 
    darkStores, 
    orders, 
    deliveries, 
    updateOrderStatus, 
    updateDeliveryStatus, 
    verifyDeliveryOtp 
  } = useData();
  const { currentUser } = useAuth();

  // Rider Profile & Duty State
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(() => {
    return darkStores[0]?.id || 'dark_store_vij_benz';
  });
  const activeStore = darkStores.find(s => s.id === selectedStoreId) || darkStores[0];

  // Rider Stats
  const [walletBalance, setWalletBalance] = useState(1480);
  const [todayEarnings, setTodayEarnings] = useState(640);
  const [completedDropsCount, setCompletedDropsCount] = useState(11);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Active Order State
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [deliveryStep, setDeliveryStep] = useState<RiderDeliveryStep>('TO_HUB');
  const [stepChecklist, setStepChecklist] = useState<{ [key: string]: boolean }>({
    bagInsulated: true,
    tempVerified: true,
    itemsSealed: true
  });

  // Incoming Ping Order Alert Modal
  const [incomingOrder, setIncomingOrder] = useState<Order | null>(null);
  const [pingTimerSec, setPingTimerSec] = useState(15);
  const [activeTab, setActiveTab] = useState<'DELIVERY' | 'AVAILABLE_POOL' | 'EARNINGS'>('DELIVERY');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [payoutSuccessBanner, setPayoutSuccessBanner] = useState<{ amount: number; orderNumber: string } | null>(null);

  // Filter express orders for selected dark store
  const storeExpressOrders = orders.filter(
    o => o.fulfillmentType === 'DARK_STORE_EXPRESS' && 
         (o.darkStoreId === activeStore.id || o.darkStoreName === activeStore.name || !o.darkStoreId)
  );

  const activeOrder = orders.find(o => o.id === activeOrderId) || 
    storeExpressOrders.find(o => o.status === 'IN_TRANSIT') || 
    null;

  const activeDelivery = deliveries.find(d => d.orderId === activeOrder?.id || d.orderNumber === activeOrder?.orderNumber);

  // Auto-select active order if exists
  useEffect(() => {
    if (!activeOrderId && activeOrder) {
      setActiveOrderId(activeOrder.id);
    }
  }, [activeOrder, activeOrderId]);

  // Ping timer countdown
  useEffect(() => {
    let timer: any;
    if (incomingOrder && pingTimerSec > 0) {
      timer = setInterval(() => {
        setPingTimerSec(prev => {
          if (prev <= 1) {
            setIncomingOrder(null);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [incomingOrder, pingTimerSec]);

  // Simulate Incoming Order Ping
  const handleTriggerSimulatedOrderPing = () => {
    const unassignedOrder = storeExpressOrders.find(o => o.id !== activeOrder?.id) || {
      id: `order_exp_sim_${Date.now()}`,
      orderNumber: `ORD-EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      fulfillmentType: 'DARK_STORE_EXPRESS',
      darkStoreId: activeStore.id,
      darkStoreName: activeStore.name,
      packSizeKg: 2,
      estimatedDeliveryMinutes: 14,
      riderName: 'P. Sai Kumar (You)',
      riderPhone: '+91 98480 88221',
      buyerId: 'buyer_freshmart',
      buyerName: 'Pooja Sharma',
      buyerBusinessName: 'Direct Consumer (Home Needs)',
      buyerPhone: '+91 99887 76655',
      farmerId: 'farmer_ravi',
      farmerName: 'Ravi Kumar (Gudivada Farm Direct)',
      cropId: 'crop_tomato_1',
      cropName: 'Tomato & Fresh Coriander',
      cropVariety: 'Arka Rakshak (Fresh 2kg Crate)',
      quantity: 2,
      unitPrice: 32,
      totalAmount: 64,
      deliveryLocation: 'Flat 402, Sri Krishna Apts, Benz Circle, Vijayawada, AP',
      expectedDeliveryDate: 'Today (Within 15 mins)',
      status: 'IN_TRANSIT',
      paymentStatus: 'Paid',
      deliveryOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      isOtpVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Order;

    setIncomingOrder(unassignedOrder);
    setPingTimerSec(15);
  };

  // Accept Order
  const handleAcceptIncomingOrder = () => {
    if (!incomingOrder) return;
    setActiveOrderId(incomingOrder.id);
    setDeliveryStep('TO_HUB');
    setIncomingOrder(null);
    setActiveTab('DELIVERY');

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  // Decline Order
  const handleDeclineIncomingOrder = () => {
    setIncomingOrder(null);
    setPingTimerSec(15);
  };

  // Advance Rider Journey Steps
  const handleAdvanceStep = () => {
    if (deliveryStep === 'TO_HUB') {
      setDeliveryStep('PICKUP_BAG');
    } else if (deliveryStep === 'PICKUP_BAG') {
      setDeliveryStep('TO_CUSTOMER');
    } else if (deliveryStep === 'TO_CUSTOMER') {
      setDeliveryStep('OTP_HANDOVER');
      setIsOtpModalOpen(true);
    }
  };

  // Handle Delivery Completion & Payout
  const handleCompleteDeliveryWithOtp = async (verifiedOtp: string) => {
    if (!activeOrder) return;
    
    await verifyDeliveryOtp(activeOrder.id, verifiedOtp);
    
    const payoutEarned = 45;
    setTodayEarnings(prev => prev + payoutEarned);
    setWalletBalance(prev => prev + payoutEarned);
    setCompletedDropsCount(prev => prev + 1);

    setPayoutSuccessBanner({
      amount: payoutEarned,
      orderNumber: activeOrder.orderNumber
    });

    setIsOtpModalOpen(false);
    setActiveOrderId(null);
    setDeliveryStep('TO_HUB');

    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    } catch {}

    setTimeout(() => {
      setPayoutSuccessBanner(null);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* TOP RIDER MOBILE APP BAR */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Rider Identity */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                  alt="Rider Avatar"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white tracking-tight">
                  P. Sai Kumar
                </h1>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-emerald-400" /> 4.96
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                EV Cargo #4 • AP 16 EV 4902
              </p>
            </div>
          </div>

          {/* Quick Controls: Hub Switcher & Duty Toggle */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              {darkStores.map(store => (
                <option key={store.id} value={store.id}>
                  🏬 {store.name.replace('Express Fresh Vault', 'Vault')}
                </option>
              ))}
            </select>

            {/* Online / Offline Switch */}
            <button
              type="button"
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isOnDuty 
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isOnDuty ? 'animate-pulse' : ''}`} />
              {isOnDuty ? 'ON DUTY' : 'OFFLINE'}
            </button>
          </div>

        </div>
      </div>

      {/* RIDER STATS STRIP (BLINKIT STYLE) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-2.5 bg-slate-800/60 rounded-2xl border border-slate-750 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Today's Payout</span>
              <span className="text-base font-black text-emerald-400">₹{todayEarnings}</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded-2xl border border-slate-750 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Completed Drops</span>
              <span className="text-base font-black text-white">{completedDropsCount} Orders</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded-2xl border border-slate-750 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Trip Time</span>
              <span className="text-base font-black text-amber-400">11.8 Mins</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded-2xl border border-slate-750 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">EV Battery</span>
              <span className="text-base font-black text-teal-400">86% (42km)</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <BatteryCharging className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

      {/* PAYOUT CELEBRATION POPUP BANNER */}
      {payoutSuccessBanner && (
        <div className="max-w-4xl mx-auto px-4 pt-4 animate-bounce">
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
                🎉
              </div>
              <div>
                <h4 className="text-sm font-black">Delivery Authenticated with Customer OTP!</h4>
                <p className="text-xs text-emerald-100">
                  +₹{payoutSuccessBanner.amount}.00 credited to wallet for {payoutSuccessBanner.orderNumber}
                </p>
              </div>
            </div>
            <span className="text-xs font-black bg-white text-emerald-900 px-3 py-1.5 rounded-xl shadow-xs">
              Wallet Balance: ₹{walletBalance}
            </span>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* NAV TABS */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('DELIVERY')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'DELIVERY'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Bike className="w-4 h-4" />
              Active Dispatch {activeOrder && '⚡'}
            </button>

            <button
              onClick={() => setActiveTab('AVAILABLE_POOL')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'AVAILABLE_POOL'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Available Orders ({storeExpressOrders.length})
            </button>

            <button
              onClick={() => setActiveTab('EARNINGS')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'EARNINGS'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Wallet & Payouts
            </button>
          </div>

          {/* Test Simulation Button */}
          <button
            type="button"
            onClick={handleTriggerSimulatedOrderPing}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-xs font-black hover:brightness-110 flex items-center gap-1 cursor-pointer shadow-md"
            title="Simulate Blinkit/Instamart incoming order flash ping"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Simulate Order Ping 🔔</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE DELIVERY JOURNEY */}
        {activeTab === 'DELIVERY' && (
          <div className="space-y-6">
            
            {activeOrder ? (
              <div className="space-y-6 animate-fade-in">
                
                {/* 15-MINUTE TARGET CLOCK & TRIP BANNER */}
                <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-750 shadow-xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> 15-Min Express Drop in Progress
                      </span>
                      <h2 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                        {activeOrder.orderNumber}
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          (₹45 Earning)
                        </span>
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Target SLA Time</span>
                        <span className="font-mono text-xl font-black text-emerald-400 animate-pulse">
                          09:42 Left
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <Clock className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* 4-STAGE RIDER JOURNEY STEPPER */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                    
                    <div className={`p-2 rounded-xl text-center border transition-all ${
                      deliveryStep === 'TO_HUB' 
                        ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <span className="text-[10px] block">Step 1</span>
                      <span className="text-xs block truncate font-bold">1. Reach Hub</span>
                    </div>

                    <div className={`p-2 rounded-xl text-center border transition-all ${
                      deliveryStep === 'PICKUP_BAG' 
                        ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md' 
                        : deliveryStep === 'TO_CUSTOMER' || deliveryStep === 'OTP_HANDOVER'
                        ? 'bg-slate-800 text-emerald-400 border-slate-700'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <span className="text-[10px] block">Step 2</span>
                      <span className="text-xs block truncate font-bold">2. Bag Pickup</span>
                    </div>

                    <div className={`p-2 rounded-xl text-center border transition-all ${
                      deliveryStep === 'TO_CUSTOMER' 
                        ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md' 
                        : deliveryStep === 'OTP_HANDOVER'
                        ? 'bg-slate-800 text-emerald-400 border-slate-700'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <span className="text-[10px] block">Step 3</span>
                      <span className="text-xs block truncate font-bold">3. Doorstep GPS</span>
                    </div>

                    <div className={`p-2 rounded-xl text-center border transition-all ${
                      deliveryStep === 'OTP_HANDOVER' 
                        ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <span className="text-[10px] block">Step 4</span>
                      <span className="text-xs block truncate font-bold">4. OTP Auth</span>
                    </div>

                  </div>
                </div>

                {/* STEP DETAILS & ACTION CARD */}
                <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 space-y-6">
                  
                  {/* STEP 1: REACHING HUB */}
                  {deliveryStep === 'TO_HUB' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-white flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-emerald-400" />
                            Navigate to {activeStore.name}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Pick up freshly packaged items from cold vault ({activeStore.temperatureCelsius}°C)
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                          0.4 km away
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Hub Address:</span>
                          <span className="font-bold text-white text-right">{activeStore.address}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-700/60">
                          <span className="text-slate-400">Vault Manager:</span>
                          <span className="font-bold text-white">{activeStore.managerName} ({activeStore.contactPhone})</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="harvest"
                        size="lg"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-4 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        onClick={handleAdvanceStep}
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                      >
                        📍 I Have Arrived at Dark Store Hub
                      </Button>
                    </div>
                  )}

                  {/* STEP 2: PICKUP BAG & VERIFY */}
                  {deliveryStep === 'PICKUP_BAG' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-white flex items-center gap-2">
                            <Package className="w-5 h-5 text-emerald-400" />
                            Pickup Insulated Produce Bag
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Verify consignment crate items and zip-seal before departure
                          </p>
                        </div>
                        <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-xl border border-teal-500/20 flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5" /> {activeStore.temperatureCelsius}°C Chilled
                        </span>
                      </div>

                      {/* Items checklist */}
                      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                          <span className="text-xs font-bold text-slate-300">Produce Item</span>
                          <span className="text-xs font-black text-emerald-400">
                            {activeOrder.quantity} kg • {activeOrder.cropName}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                            />
                            <span>Chilled insulated box seal inspected</span>
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700"
                            />
                            <span>Batch QR code verified ({activeOrder.batchId || 'FS-EXP-2026'})</span>
                          </label>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="harvest"
                        size="lg"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-4 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        onClick={handleAdvanceStep}
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                      >
                        📦 Bag Picked & Box Sealed (Start Journey)
                      </Button>
                    </div>
                  )}

                  {/* STEP 3: EN ROUTE TO CUSTOMER */}
                  {deliveryStep === 'TO_CUSTOMER' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-white flex items-center gap-2">
                            <Navigation className="w-5 h-5 text-emerald-400" />
                            Heading to Customer Doorstep
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Customer: <strong className="text-white">{activeOrder.buyerName}</strong>
                          </p>
                        </div>
                        <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                          0.9 km (4 mins)
                        </span>
                      </div>

                      {/* Drop Location */}
                      <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs space-y-2">
                        <div className="flex items-start gap-2 text-slate-200">
                          <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span className="font-semibold leading-relaxed">{activeOrder.deliveryLocation}</span>
                        </div>
                      </div>

                      {/* Quick Communication Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={`tel:${activeOrder.buyerPhone || '+919988776655'}`}
                          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-white rounded-xl border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                          <Phone className="w-4 h-4 text-emerald-400" />
                          Call Customer
                        </a>

                        <button
                          type="button"
                          onClick={() => alert(`WhatsApp notification sent to ${activeOrder.buyerName}: "Hi! Your FarmSync rider P. Sai Kumar is arriving at your doorstep in 3 mins with your fresh produce."`)}
                          className="py-2.5 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 rounded-xl border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-400" />
                          WhatsApp Alert
                        </button>
                      </div>

                      {/* Live Radar Map */}
                      <div className="rounded-2xl overflow-hidden border border-slate-800">
                        <RealOrderTrackingMap
                          originLocation={activeStore.name}
                          deliveryLocation={activeOrder.deliveryLocation}
                          orderNumber={activeOrder.orderNumber}
                          cropName={activeOrder.cropName}
                          quantityKg={activeOrder.quantity}
                          status={activeOrder.status}
                          driverName="P. Sai Kumar (You)"
                          driverPhone="+91 98480 88221"
                          vehiclePlate="AP 16 EV 4902"
                          isExpress={true}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="harvest"
                        size="lg"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-4 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        onClick={handleAdvanceStep}
                        rightIcon={<KeyRound className="w-5 h-5" />}
                      >
                        🛵 Arrived at Doorstep (Ask Customer for OTP)
                      </Button>
                    </div>
                  )}

                  {/* STEP 4: OTP HANDOVER AUTHENTICATION */}
                  {deliveryStep === 'OTP_HANDOVER' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-white flex items-center gap-2">
                            <Lock className="w-5 h-5 text-emerald-400" />
                            Doorstep OTP Handover Authentication
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Ask <strong className="text-white">{activeOrder.buyerName}</strong> for the 4-digit PIN on their screen
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-xs space-y-3">
                        <div className="flex items-center gap-2 text-emerald-300">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Customer must inspect produce quality before providing PIN</span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-700">
                          <span className="text-slate-400 text-[11px]">Customer's Secret OTP:</span>
                          <span className="font-mono text-sm font-black text-emerald-400">
                            {activeOrder.deliveryOtp || '4829'}
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="harvest"
                        size="lg"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-4 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        onClick={() => setIsOtpModalOpen(true)}
                        leftIcon={<KeyRound className="w-5 h-5" />}
                      >
                        🔑 Enter 4-Digit Customer Handover PIN
                      </Button>
                    </div>
                  )}

                </div>

              </div>
            ) : (
              /* No Active Order State */
              <Card className="p-12 text-center text-slate-400 bg-slate-900 border-slate-800 space-y-4 rounded-3xl">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Bike className="w-8 h-8 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">You're On Duty & Ready!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Waiting for new 15-minute express orders from {activeStore.name}. You'll receive a sound and visual ping instantly.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTriggerSimulatedOrderPing}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 cursor-pointer"
                  >
                    ⚡ Simulate Incoming Order Ping
                  </button>
                </div>
              </Card>
            )}

          </div>
        )}

        {/* TAB 2: AVAILABLE ORDERS POOL */}
        {activeTab === 'AVAILABLE_POOL' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Nearby Express Orders Pool</h3>
                <p className="text-xs text-slate-400">Available dispatches at {activeStore.name}</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                {storeExpressOrders.length} Orders
              </span>
            </div>

            <div className="space-y-3">
              {storeExpressOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-white">{ord.orderNumber}</span>
                      <p className="text-[11px] text-slate-400">
                        {ord.quantity} kg • {ord.cropName}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400">₹45 Payout</span>
                      <span className="text-[10px] text-slate-400 block font-mono">1.2 km away</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px] truncate max-w-[220px]">
                      Drop: {ord.deliveryLocation}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveOrderId(ord.id);
                        setDeliveryStep('TO_HUB');
                        setActiveTab('DELIVERY');
                      }}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Accept Drop ⚡
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WALLET & EARNINGS BREAKDOWN */}
        {activeTab === 'EARNINGS' && (
          <div className="space-y-6">
            
            {/* Balance Card */}
            <div className="p-6 bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-950 rounded-3xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Available Wallet Balance</span>
                  <h2 className="text-3xl font-black text-white mt-1">₹{walletBalance.toLocaleString('en-IN')}.00</h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-emerald-500/20">
                <span className="text-xs text-slate-300">
                  Direct UPI Payout: <strong className="font-mono text-emerald-300">saikumar@oksbi</strong>
                </span>

                <button
                  type="button"
                  onClick={() => alert(`Instant UPI Withdrawal of ₹${walletBalance} initiated to saikumar@oksbi. Funds will settle within 60 seconds.`)}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer"
                >
                  Withdraw to UPI ⚡
                </button>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="p-5 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Shift Incentives & Earnings</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-300">Base Delivery Fees (11 Drops @ ₹35)</span>
                  <span className="font-bold text-white">₹385.00</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-300">15-Minute On-Time Target Bonus</span>
                  <span className="font-bold text-emerald-400">+₹165.00</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-300">Customer Doorstep Tips</span>
                  <span className="font-bold text-emerald-400">+₹90.00</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-800/90 rounded-xl font-black text-sm pt-2 border-t border-slate-700">
                  <span className="text-white">Total Today</span>
                  <span className="text-emerald-400">₹{todayEarnings}.00</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* BLINKIT / INSTAMART STYLE INCOMING ORDER POPUP ALERT */}
      {incomingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-500 space-y-5 animate-bounce text-slate-100 ring-4 ring-emerald-500/20">
            
            {/* Header Banner */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">NEW 15-MIN EXPRESS DROP!</h3>
                  <p className="text-[11px] text-emerald-400 font-bold">{incomingOrder.orderNumber}</p>
                </div>
              </div>

              {/* Timer Countdown Badge */}
              <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center font-mono font-black text-sm text-emerald-400">
                {pingTimerSec}s
              </div>
            </div>

            {/* Earning Big Callout */}
            <div className="p-4 bg-emerald-950/80 rounded-2xl border border-emerald-500/40 text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-300 uppercase">You will earn</span>
              <h2 className="text-3xl font-black text-white">₹45.00</h2>
              <p className="text-[10px] text-emerald-400">Base ₹35 + ₹10 Instant SLA Bonus</p>
            </div>

            {/* Pickup & Drop Points */}
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2.5 bg-slate-800 rounded-xl">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">PICKUP VAULT (0.4 km)</span>
                  <span className="font-semibold text-white">{activeStore.name}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2.5 bg-slate-800 rounded-xl">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">CUSTOMER DROP (1.2 km)</span>
                  <span className="font-semibold text-white">{incomingOrder.deliveryLocation}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDeclineIncomingOrder}
                className="py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-black rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Decline
              </button>

              <button
                type="button"
                onClick={handleAcceptIncomingOrder}
                className="py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs transition-transform active:scale-95 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                ACCEPT ORDER ⚡
              </button>
            </div>

          </div>
        </div>
      )}

      {/* OTP HANDOVER VERIFICATION MODAL */}
      {activeOrder && isOtpModalOpen && (
        <OtpVerificationModal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          orderNumber={activeOrder.orderNumber}
          expectedOtp={activeOrder.deliveryOtp || '4829'}
          recipientName={activeOrder.buyerName}
          deliveryLocation={activeOrder.deliveryLocation}
          cropName={activeOrder.cropName}
          quantityKg={activeOrder.quantity}
          riderName="P. Sai Kumar (You)"
          onSuccess={handleCompleteDeliveryWithOtp}
        />
      )}

    </div>
  );
};
