import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Thermometer, 
  Droplets, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Battery, 
  DoorOpen, 
  Truck, 
  Sparkles,
  Zap,
  Radio
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SEED_COLD_CHAIN_SAMPLES } from '../../data/seedData';
import { ColdChainTelemetrySample } from '../../types';

export const ColdChainTelemetryPage: React.FC = () => {
  const [samples, setSamples] = useState<ColdChainTelemetrySample[]>(SEED_COLD_CHAIN_SAMPLES);
  const [currentTemp, setCurrentTemp] = useState<number>(11.8);
  const [currentHumidity, setCurrentHumidity] = useState<number>(84);
  const [currentEthylene, setCurrentEthylene] = useState<number>(0.16);
  const [doorOpen, setDoorOpen] = useState<boolean>(false);
  const [isCompressorBoosterOn, setIsCompressorBoosterOn] = useState<boolean>(false);
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);

  // Live IoT telemetry tick simulation
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      setCurrentTemp((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        const target = isCompressorBoosterOn ? 10.5 : 12.0;
        const next = Math.max(8.0, Math.min(22.0, prev + delta + (target > prev ? 0.1 : -0.1)));
        return parseFloat(next.toFixed(1));
      });

      setCurrentHumidity((prev) => {
        const delta = Math.floor((Math.random() - 0.5) * 2);
        return Math.max(75, Math.min(95, prev + delta));
      });

      setCurrentEthylene((prev) => {
        const delta = (Math.random() - 0.48) * 0.02;
        return parseFloat(Math.max(0.05, Math.min(0.85, prev + delta)).toFixed(2));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveSimulating, isCompressorBoosterOn]);

  const getRiskStatus = () => {
    if (currentTemp > 16.0 || currentEthylene > 0.45) return 'CRITICAL_RISK';
    if (currentTemp > 14.0 || currentEthylene > 0.25 || doorOpen) return 'MODERATE_RISK';
    return 'OPTIMAL';
  };

  const riskStatus = getRiskStatus();

  const handleSimulateHeatSpike = () => {
    setCurrentTemp(18.5);
    setCurrentEthylene(0.38);
  };

  const handleBoostCompressor = () => {
    setIsCompressorBoosterOn(true);
    setTimeout(() => {
      setCurrentTemp(11.2);
      setCurrentEthylene(0.14);
      setIsCompressorBoosterOn(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 text-white p-6 sm:p-10 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
              <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Live IoT Cold-Chain Radar
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Perishable Transit Telemetry
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Real-time refrigerated container monitoring: cargo core temperature, relative humidity, ethylene ripening biomarkers, and automated temperature correction triggers.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            <Badge variant={riskStatus === 'OPTIMAL' ? 'emerald' : riskStatus === 'MODERATE_RISK' ? 'amber' : 'rose'} size="sm" className="font-bold py-1 px-3">
              Telemetry State: {riskStatus}
            </Badge>
          </div>
        </div>
      </div>

      {/* Vehicle Info & Active Route */}
      <Card className="p-6 bg-white border-slate-200 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
              <Truck className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Monitoring Active Transit:</span>
              <h2 className="text-base font-black text-slate-900">
                Reefer Mini Truck (AP 16 TX 4412) • SwiftAgri Fleet
              </h2>
              <span className="text-xs text-slate-500">
                Driver: Kishore Varma (+91 97000 11223) • Route: Gudivada Farm Depot ➔ Vijayawada Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSimulateHeatSpike}
              className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
            >
              Simulate Heatwave Deviation
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleBoostCompressor}
              isLoading={isCompressorBoosterOn}
              className="text-xs bg-teal-600 hover:bg-teal-700"
              leftIcon={<Zap className="w-3.5 h-3.5" />}
            >
              Emergency Boost Compressor
            </Button>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center text-slate-500 text-xs mb-1">
              <Thermometer className="w-4 h-4 text-blue-500 mr-1.5" /> Cargo Core Temp
            </div>
            <p className="text-2xl font-black text-slate-900">{currentTemp}°C</p>
            <span className="text-[10px] text-slate-400">Target Range: 10.0°C - 12.5°C</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center text-slate-500 text-xs mb-1">
              <Droplets className="w-4 h-4 text-teal-500 mr-1.5" /> Humidity Level
            </div>
            <p className="text-2xl font-black text-slate-900">{currentHumidity}%</p>
            <span className="text-[10px] text-slate-400">Target: 80% - 90% RH</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center text-slate-500 text-xs mb-1">
              <Activity className="w-4 h-4 text-amber-500 mr-1.5" /> Ethylene Gas ppm
            </div>
            <p className="text-2xl font-black text-slate-900">{currentEthylene} ppm</p>
            <span className="text-[10px] text-slate-400">Ripening Index: Safe (&lt; 0.30)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center text-slate-500 text-xs mb-1">
              <Battery className="w-4 h-4 text-emerald-500 mr-1.5" /> IoT Sensor Battery
            </div>
            <p className="text-2xl font-black text-slate-900">94%</p>
            <span className="text-[10px] text-emerald-600 font-semibold">GPS Active & Locked</span>
          </div>

        </div>
      </Card>

      {/* Telemetry Timeline Feed */}
      <Card className="p-6 bg-white border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-900">IoT Sensor Log Stream (Every 15 mins)</h3>
          <span className="text-xs text-slate-400">GPS Coordinates: 16.5120° N, 80.6890° E</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Ambient Temp</th>
                <th className="pb-3">Cargo Core Temp</th>
                <th className="pb-3">Humidity %</th>
                <th className="pb-3">Ethylene ppm</th>
                <th className="pb-3">Vibration (G)</th>
                <th className="pb-3 text-right">Spoilage Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {samples.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{s.timestamp}</td>
                  <td className="py-3 text-slate-600">{s.ambientTempC}°C</td>
                  <td className="py-3 font-black text-slate-900">{s.cargoCoreTempC}°C</td>
                  <td className="py-3 text-slate-700">{s.relativeHumidityPercent}%</td>
                  <td className="py-3 text-slate-700">{s.ethylenePpm}</td>
                  <td className="py-3 text-slate-500">{s.vibrationG} G</td>
                  <td className="py-3 text-right">
                    <Badge variant={s.spoilageRiskIndex === 'OPTIMAL' ? 'emerald' : 'amber'} size="sm">
                      {s.spoilageRiskIndex}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
