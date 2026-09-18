import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Truck, 
  MapPin, 
  Thermometer, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Phone, 
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Radio,
  Sparkles,
  Gauge,
  Zap,
  RotateCcw,
  ShieldAlert,
  Wind,
  Droplets,
  Layers,
  ArrowUpRight,
  BatteryCharging,
  Compass,
  Building2
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { RealFleetRadarMap } from '../../components/maps/RealFleetRadarMap';
import confetti from 'canvas-confetti';

type ScenarioMode = 'OPTIMAL' | 'MID_CASE_WARNING' | 'WORST_CASE_CRITICAL';

export const LiveFleetRadarPage: React.FC = () => {
  const { deliveries, updateDeliveryStatus } = useData();

  const [activeDeliveryId, setActiveDeliveryId] = useState(deliveries[0]?.id || '');
  const activeDelivery = deliveries.find(d => d.id === activeDeliveryId) || deliveries[0];

  // Scenario Mode state
  const [scenarioMode, setScenarioMode] = useState<ScenarioMode>(
    (activeDelivery?.telemetryState as ScenarioMode) || 'OPTIMAL'
  );

  // Live fluctuating telemetry values
  const [temperature, setTemperature] = useState(11.7);
  const [speed, setSpeed] = useState(57);
  const [humidity, setHumidity] = useState(84);
  const [distanceRemaining, setDistanceRemaining] = useState(16.5);
  const [etaMinutes, setEtaMinutes] = useState(24);
  
  // Emergency actions feedback
  const [isAuxCoolingActive, setIsAuxCoolingActive] = useState(false);
  const [isReroutedToColdHub, setIsReroutedToColdHub] = useState(false);
  const [isCryoInjected, setIsCryoInjected] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [insuranceClaimFiled, setInsuranceClaimFiled] = useState(false);

  // When active vehicle changes, initialize its preset scenario
  useEffect(() => {
    if (activeDelivery) {
      const preset = (activeDelivery.telemetryState as ScenarioMode) || 'OPTIMAL';
      setScenarioMode(preset);
      applyScenarioValues(preset);
      setIsReroutedToColdHub(false);
      setIsCryoInjected(false);
      setIsAuxCoolingActive(false);
      setSosSent(false);
      setInsuranceClaimFiled(false);
    }
  }, [activeDeliveryId]);

  const applyScenarioValues = (mode: ScenarioMode) => {
    if (mode === 'OPTIMAL') {
      setTemperature(activeDelivery?.initialTemperature || 11.7);
      setHumidity(84);
      setSpeed(57);
      setEtaMinutes(24);
      setDistanceRemaining(16.5);
    } else if (mode === 'MID_CASE_WARNING') {
      setTemperature(16.8);
      setHumidity(91);
      setSpeed(62);
      setEtaMinutes(29);
      setDistanceRemaining(21.4);
    } else if (mode === 'WORST_CASE_CRITICAL') {
      setTemperature(25.4);
      setHumidity(96);
      setSpeed(48);
      setEtaMinutes(38);
      setDistanceRemaining(28.0);
    }
  };

  const handleScenarioSwitch = (mode: ScenarioMode) => {
    setScenarioMode(mode);
    applyScenarioValues(mode);
    setIsReroutedToColdHub(false);
    setIsCryoInjected(false);
    setIsAuxCoolingActive(false);
    setSosSent(false);
  };

  // Telemetry fluctuation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTemperature(prev => {
        if (scenarioMode === 'OPTIMAL') {
          return +(11.5 + Math.random() * 0.5).toFixed(1);
        } else if (scenarioMode === 'MID_CASE_WARNING') {
          return isAuxCoolingActive ? +(12.6 + Math.random() * 0.4).toFixed(1) : +(16.6 + Math.random() * 0.6).toFixed(1);
        } else {
          return isCryoInjected ? +(12.2 + Math.random() * 0.5).toFixed(1) : +(25.2 + Math.random() * 0.8).toFixed(1);
        }
      });

      setSpeed(prev => Math.min(75, Math.max(30, Math.round(prev + (Math.random() * 4 - 2)))));
      setDistanceRemaining(prev => Math.max(0.2, +(prev - (isReroutedToColdHub ? 0.3 : 0.05)).toFixed(1)));
      setEtaMinutes(prev => Math.max(1, isReroutedToColdHub ? Math.min(prev, 6) : Math.round(prev - 0.1)));
    }, 2000);
    return () => clearInterval(timer);
  }, [scenarioMode, isAuxCoolingActive, isCryoInjected, isReroutedToColdHub]);

  // Aux Sub-Cooling Trigger
  const handleActivateAuxCooling = () => {
    setIsAuxCoolingActive(true);
    setTemperature(12.6);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
  };

  // Emergency Reroute Trigger
  const handleEmergencyReroute = () => {
    setIsReroutedToColdHub(true);
    setEtaMinutes(6);
    setDistanceRemaining(4.2);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
  };

  // Cryogenic CO2 Recovery Shot Trigger
  const handleCryoInjection = () => {
    setIsCryoInjected(true);
    setTemperature(12.4);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-lg bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Cold-Chain IoT Telemetry & Dispatch Radar
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Live Agri-Logistics Fleet Radar & Cold-Chain Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Real-time multi-vehicle GPS tracking, active reefer sensor diagnostics, and automated thermal breach emergency protocols.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:self-center">
          <Badge variant="emerald" size="lg" className="bg-emerald-950/80 text-emerald-300 border-emerald-500/40">
            <Radio className="w-3.5 h-3.5 mr-1 text-emerald-400 animate-ping" />
            7 Fleet Vehicles Connected
          </Badge>
        </div>
      </div>

      {/* Global Scenario Simulation Bar for Judges & Evaluators */}
      <Card className="p-4 sm:p-5 border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-emerald-50/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Live Cold-Chain Telemetry Scenario Simulator
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              Switch thermal sensor conditions to test normal logistics, heat-wave warning deviations, and emergency compressor failures:
            </p>
          </div>

          {/* 3 Scenario Mode Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            
            {/* Optimal */}
            <button
              onClick={() => handleScenarioSwitch('OPTIMAL')}
              className={`px-3.5 py-2.5 rounded-xl border text-left sm:text-center transition-all flex items-center sm:justify-center gap-2 ${
                scenarioMode === 'OPTIMAL'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-xs">
                <strong className="block font-bold">Optimal Case</strong>
                <span className="text-[10px] opacity-90">11.7°C (100% In Range)</span>
              </div>
            </button>

            {/* Mid Case */}
            <button
              onClick={() => handleScenarioSwitch('MID_CASE_WARNING')}
              className={`px-3.5 py-2.5 rounded-xl border text-left sm:text-center transition-all flex items-center sm:justify-center gap-2 ${
                scenarioMode === 'MID_CASE_WARNING'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${scenarioMode === 'MID_CASE_WARNING' ? 'text-white' : 'text-amber-500'}`} />
              <div className="text-xs">
                <strong className="block font-bold">Mid-Case (Warning)</strong>
                <span className="text-[10px] opacity-90">16.8°C (+2.8°C Deviation)</span>
              </div>
            </button>

            {/* Worst Case */}
            <button
              onClick={() => handleScenarioSwitch('WORST_CASE_CRITICAL')}
              className={`px-3.5 py-2.5 rounded-xl border text-left sm:text-center transition-all flex items-center sm:justify-center gap-2 ${
                scenarioMode === 'WORST_CASE_CRITICAL'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-500/30 animate-pulse'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
              }`}
            >
              <AlertOctagon className={`w-3.5 h-3.5 ${scenarioMode === 'WORST_CASE_CRITICAL' ? 'text-white' : 'text-rose-500'}`} />
              <div className="text-xs">
                <strong className="block font-bold">Worst-Case (Critical)</strong>
                <span className="text-[10px] opacity-90">25.4°C (Reefer Breakdown)</span>
              </div>
            </button>

          </div>
        </div>
      </Card>

      {/* Main Grid: Telemetry Gauges + Navigation Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Fleet Selection & Interactive Sensor Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Dispatch Selector */}
          <Card className="p-5 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Select Fleet Vehicle ({deliveries.length} Total):
              </span>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                Live GPS Active
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {deliveries.map(del => {
                const isSelected = activeDelivery?.id === del.id;
                const isWarning = del.telemetryState === 'MID_CASE_WARNING';
                const isCritical = del.telemetryState === 'WORST_CASE_CRITICAL';

                return (
                  <button
                    key={del.id}
                    onClick={() => setActiveDeliveryId(del.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <Truck className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                        <span className="text-xs font-black text-slate-900">{del.deliveryId}</span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {del.vehiclePlate || 'AP 16 TX 4412'}
                        </span>
                      </div>
                      
                      {/* Telemetry Indicator Badge */}
                      {isCritical ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          25.4°C Critical
                        </span>
                      ) : isWarning ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          16.8°C Warning
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Optimal
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                        {del.cropName} ({del.quantity} kg)
                      </span>
                      <span className="text-slate-400 font-medium">{del.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* IoT Temperature Sensor Gauge (Matches User Screenshot + Interactive States) */}
          <Card className={`p-6 border text-white space-y-4 transition-all duration-300 ${
            scenarioMode === 'WORST_CASE_CRITICAL'
              ? 'bg-gradient-to-br from-rose-950 via-slate-950 to-red-950 border-rose-500 ring-4 ring-rose-500/20 shadow-2xl'
              : scenarioMode === 'MID_CASE_WARNING'
              ? 'bg-gradient-to-br from-amber-950 via-slate-950 to-stone-950 border-amber-500 ring-2 ring-amber-500/20 shadow-xl'
              : 'bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 border-slate-700 shadow-xl'
          }`}>
            
            {/* Sensor Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer className={`w-5 h-5 ${
                  scenarioMode === 'WORST_CASE_CRITICAL' ? 'text-rose-400 animate-bounce' :
                  scenarioMode === 'MID_CASE_WARNING' ? 'text-amber-400' : 'text-cyan-400'
                }`} />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  REEFER COLD CHAIN SENSOR
                </h3>
              </div>

              {/* Status Badge */}
              {scenarioMode === 'WORST_CASE_CRITICAL' ? (
                <span className="text-[10px] font-black text-rose-300 bg-rose-950 px-2.5 py-1 rounded-full border border-rose-500 animate-pulse flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3" />
                  CRITICAL BREACH
                </span>
              ) : scenarioMode === 'MID_CASE_WARNING' ? (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-500/60 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Warning: +2.8°C Dev
                </span>
              ) : (
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/40">
                  100% In Range
                </span>
              )}
            </div>

            {/* Temperature Value */}
            <div className="text-center py-2">
              <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight transition-colors ${
                scenarioMode === 'WORST_CASE_CRITICAL' ? 'text-rose-400' :
                scenarioMode === 'MID_CASE_WARNING' ? 'text-amber-300' : 'text-cyan-300'
              }`}>
                {temperature}°C
              </span>
              <span className="text-xs text-slate-300 block mt-1">
                Target Range: 10.0°C - 14.0°C (Produce Optimal)
              </span>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-white/10">
              <div className="bg-white/5 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">Speed</span>
                <span className="font-bold text-white text-sm">{speed} km/h</span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">Humidity</span>
                <span className={`font-bold text-sm ${humidity > 90 ? 'text-amber-300' : 'text-white'}`}>
                  {humidity}% RH
                </span>
              </div>
              <div className="bg-white/5 p-2 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-medium">ETA</span>
                <span className="font-bold text-emerald-400 text-sm">~{etaMinutes} min</span>
              </div>
            </div>

            {/* Diagnostics and Health Footer */}
            <div className="pt-2 border-t border-white/10 text-[11px] space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Compressor Duty:</span>
                <strong className={scenarioMode === 'WORST_CASE_CRITICAL' ? 'text-rose-400' : scenarioMode === 'MID_CASE_WARNING' ? 'text-amber-300' : 'text-emerald-300'}>
                  {scenarioMode === 'WORST_CASE_CRITICAL' ? '0% (FAULT: E-402 Seized)' : scenarioMode === 'MID_CASE_WARNING' ? '96% (High Thermal Strain)' : '62% (Nominal Optimal)'}
                </strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Produce Spoilage Hazard:</span>
                <strong className={scenarioMode === 'WORST_CASE_CRITICAL' ? 'text-rose-400' : scenarioMode === 'MID_CASE_WARNING' ? 'text-amber-300' : 'text-emerald-300'}>
                  {scenarioMode === 'WORST_CASE_CRITICAL' ? 'HIGH (Imminent within 38m)' : scenarioMode === 'MID_CASE_WARNING' ? 'MODERATE (Monitor 2h)' : '0% (Fresh Condition)'}
                </strong>
              </div>
            </div>

            {/* Interactive Mitigation Panel based on Scenario */}
            {scenarioMode === 'MID_CASE_WARNING' && (
              <div className="pt-3 border-t border-amber-500/30 space-y-2">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs">
                  <strong>⚠️ Auxiliary Intervention Recommended:</strong> Ambient temperature reached 41°C. Auxiliary cooling unit available to prevent pod respiration heat.
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/60"
                  onClick={handleActivateAuxCooling}
                  leftIcon={<Zap className="w-4 h-4 text-amber-400" />}
                >
                  {isAuxCoolingActive ? '✓ Auxiliary Cooling Active (Temp Recovered)' : '⚡ Engage Sub-Cooling Boost'}
                </Button>
              </div>
            )}

            {scenarioMode === 'WORST_CASE_CRITICAL' && (
              <div className="pt-3 border-t border-rose-500/40 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/60 text-rose-200 text-xs animate-pulse">
                  <strong>🚨 CRITICAL EMERGENCY PROTOCOL:</strong> Reefer compressor failure detected. Temperature 25.4°C. Execute immediate diversion or emergency recovery!
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                    onClick={handleEmergencyReroute}
                    leftIcon={<Navigation className="w-4 h-4" />}
                  >
                    {isReroutedToColdHub ? '✓ Diverted (4.2 km)' : '🚨 Reroute Cold Hub'}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border-cyan-500/60 font-bold"
                    onClick={handleCryoInjection}
                    leftIcon={<Droplets className="w-4 h-4 text-cyan-400" />}
                  >
                    {isCryoInjected ? '✓ Cryo Boost Engaged' : '❄️ Inject Cryo-Shot'}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSosSent(true)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-rose-950 border border-rose-700/60 text-rose-300 text-[11px] font-bold hover:bg-rose-900 transition-colors"
                  >
                    {sosSent ? '✓ SOS Dispatched to Buyer & Driver' : '📢 Broadcast SOS Alert'}
                  </button>

                  <button
                    onClick={() => setInsuranceClaimFiled(true)}
                    className="py-1.5 px-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold hover:bg-slate-700 transition-colors"
                  >
                    {insuranceClaimFiled ? '✓ Claim #CLM-881 Filed' : '🛡️ Agri Insurance'}
                  </button>
                </div>
              </div>
            )}

          </Card>

          {/* Assigned Driver & Vehicle Details Card */}
          <Card className="p-5 border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Assigned Fleet Driver & Vehicle
            </span>
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 font-black flex items-center justify-center text-sm shadow-sm">
                {activeDelivery?.driverName?.split(' ').map(n => n[0]).join('') || 'KV'}
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-slate-900 block">
                  {activeDelivery?.driverName || 'Kishore Varma'}
                </span>
                <span className="text-xs text-slate-500">
                  {activeDelivery?.vehicleInfo || 'Reefer Mini Truck (AP 16 TX 4412)'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                  ✓ GPS Telematics Unit ID: IOT-TEL-9981 • Battery 94%
                </span>
              </div>
              <a
                href={`tel:${activeDelivery?.driverPhone || '+919700011223'}`}
                className="p-3 bg-emerald-100 text-emerald-800 rounded-xl hover:bg-emerald-200 transition-colors shadow-sm"
                title="Call Driver"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </Card>

        </div>

        {/* Right Column: Interactive Live GPS Route Map & Dispatch Operations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <Card className="p-6 border-slate-200 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-indigo-600" />
                  Live GPS Route Navigation & Waypoint Radar
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time cold chain transit path with active checkpoint telemetry
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isReroutedToColdHub ? (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-xl border border-rose-300 animate-pulse flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" /> Emergency Cold Hub: 4.2 km
                  </span>
                ) : (
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200">
                    {distanceRemaining} km Remaining
                  </span>
                )}
              </div>
            </div>

            {/* Real Interactive Leaflet Route Map Canvas */}
            <RealFleetRadarMap
              delivery={activeDelivery}
              scenarioMode={scenarioMode}
              temperature={temperature}
              speed={speed}
              humidity={humidity}
              isReroutedToColdHub={isReroutedToColdHub}
            />

            {/* Real-time Telemetry Status Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Cargo Compartment</span>
                <span className="font-bold text-slate-800 block mt-0.5">Hermetically Sealed</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Seal #LK-8891-OK</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Ambient Heat</span>
                <span className="font-bold text-slate-800 block mt-0.5">38.5°C Highway</span>
                <span className="text-[10px] text-amber-600 font-semibold">High Solar Exposure</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Reefer Power Unit</span>
                <span className="font-bold text-slate-800 block mt-0.5">ThermoKing T-880</span>
                <span className="text-[10px] text-indigo-600 font-semibold">Diesel + Battery Hybrid</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Commodity</span>
                <span className="font-bold text-slate-800 block mt-0.5">{activeDelivery?.cropName.split(' ')[0]}</span>
                <span className="text-[10px] text-slate-500 font-semibold">{activeDelivery?.quantity} kg Loaded</span>
              </div>
            </div>

            {/* Quick Status Advancement Action */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Current Dispatch Stage: <strong className="text-indigo-700">{activeDelivery?.status}</strong>
                </span>
                <span className="text-[11px] text-slate-500">
                  Carrier: {activeDelivery?.logisticsName}
                </span>
              </div>

              {activeDelivery?.status !== 'Delivered' && (
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => updateDeliveryStatus(activeDelivery.id, 'Delivered', 'Delivered to receiver yard. Proof of delivery confirmed.')}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Mark as Delivered & Confirm
                </Button>
              )}
            </div>

          </Card>
        </div>

      </div>

    </div>
  );
};
