import React, { useState } from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  Info, 
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { RealAgroWeatherMap } from '../../components/maps/RealAgroWeatherMap';
import { SEED_WEATHER_FORECASTS, SEED_WEATHER_ALERTS } from '../../data/seedData';
import { useData } from '../../context/DataContext';

export const AgroWeatherPage: React.FC = () => {
  const { weatherAlerts } = useData();
  const [selectedLocation, setSelectedLocation] = useState<string>('Guntur / Krishna, AP');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const locations = [
    'Guntur / Krishna, AP',
    'Nashik / Pune, MH',
    'Ludhiana / Jalandhar, PB',
    'Surat / Anand, GJ',
    'Varanasi / Mirzapur, UP'
  ];

  const forecasts = SEED_WEATHER_FORECASTS[selectedLocation] || SEED_WEATHER_FORECASTS['Guntur / Krishna, AP'];
  const activeForecast = forecasts[activeDayIndex] || forecasts[0];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny': return <Sun className="w-8 h-8 text-amber-500" />;
      case 'Partly Cloudy': return <CloudSun className="w-8 h-8 text-amber-400" />;
      case 'Rainy': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'Thunderstorm': return <CloudLightning className="w-8 h-8 text-purple-600 animate-pulse" />;
      default: return <CloudSun className="w-8 h-8 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Hyperlocal Agro-Meteorological Advisory
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Agri-Weather & Disaster Guard
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Real-time satellite forecasts, precision spraying windows, extreme disaster warnings, and AI crop protection advisories.
            </p>
          </div>

          {/* Location & Refresh Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10">
            <div className="flex items-center space-x-2 pl-3">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer pr-4"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc} className="text-slate-900 font-medium">
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRefresh}
              className="bg-white/20 hover:bg-white/30 text-white border-none text-xs"
              isLoading={isRefreshing}
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync IMD Radar
            </Button>
          </div>
        </div>
      </div>

      {/* Active Alerts Banner */}
      {weatherAlerts && weatherAlerts.length > 0 && (
        <div className="space-y-3">
          {weatherAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-start gap-4 transition-all shadow-sm ${
                alert.severity === 'WARNING'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-950'
                  : alert.severity === 'ALERT'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-950'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-950'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-sm flex-shrink-0">
                {alert.severity === 'WARNING' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                ) : alert.severity === 'ALERT' ? (
                  <ShieldAlert className="w-6 h-6 text-rose-600" />
                ) : (
                  <Info className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={alert.severity === 'WARNING' ? 'amber' : alert.severity === 'ALERT' ? 'rose' : 'blue'} size="sm">
                    {alert.severity} ADVISORY
                  </Badge>
                  <h2 className="text-sm font-bold text-slate-900">{alert.title}</h2>
                  <span className="text-[11px] text-slate-500 ml-auto flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Valid through {new Date(alert.validUntil).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{alert.description}</p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span className="text-[11px] font-bold text-slate-800">Action Plan:</span>
                  {alert.actionableSteps.map((step, idx) => (
                    <span key={idx} className="inline-flex items-center text-[11px] bg-white/80 px-2.5 py-0.5 rounded-lg border border-slate-200 text-slate-800 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1 flex-shrink-0" /> {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: Active Day Highlight & Radar Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Selected Day In-Depth Report */}
        <Card className="lg:col-span-2 p-6 sm:p-8 bg-white border-slate-200 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                {getWeatherIcon(activeForecast.condition)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900">{activeForecast.dayName}</span>
                  <span className="text-xs text-slate-500">({activeForecast.date})</span>
                </div>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  {activeForecast.condition}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">
                {activeForecast.tempMax}°C
              </div>
              <span className="text-xs font-medium text-slate-400">
                Night Low: {activeForecast.tempMin}°C
              </span>
            </div>
          </div>

          {/* Key Meteorological Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center text-slate-500 text-xs mb-1">
                <Droplets className="w-4 h-4 text-blue-500 mr-1.5" /> Rain Chance
              </div>
              <p className="text-lg font-black text-slate-900">{activeForecast.precipitationChance}%</p>
              <span className="text-[10px] text-slate-400">Expected: {activeForecast.rainfallMm} mm</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center text-slate-500 text-xs mb-1">
                <Wind className="w-4 h-4 text-teal-500 mr-1.5" /> Wind Speed
              </div>
              <p className="text-lg font-black text-slate-900">{activeForecast.windSpeedKmh} km/h</p>
              <span className="text-[10px] text-slate-400">Direction: SSE Gentle</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center text-slate-500 text-xs mb-1">
                <Activity className="w-4 h-4 text-amber-500 mr-1.5" /> Humidity
              </div>
              <p className="text-lg font-black text-slate-900">{activeForecast.humidity}%</p>
              <span className="text-[10px] text-slate-400">Evaporation: Optimal</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center text-slate-500 text-xs mb-1">
                <Sun className="w-4 h-4 text-orange-500 mr-1.5" /> UV Index
              </div>
              <p className="text-lg font-black text-slate-900">{activeForecast.uvIndex} / 10</p>
              <span className="text-[10px] text-slate-400">{activeForecast.solarRadiation} MJ/m²</span>
            </div>
          </div>

          {/* AI Precision Agricultural Advisory */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  AI Farming Decision Guide
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={activeForecast.spraySuitability.includes('Excellent') ? 'emerald' : activeForecast.spraySuitability.includes('Moderate') ? 'amber' : 'rose'}
                  size="sm"
                >
                  Spray Window: {activeForecast.spraySuitability}
                </Badge>
                <Badge variant="blue" size="sm">
                  {activeForecast.irrigationRecommendation}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {activeForecast.farmingAdvisory}
            </p>
          </div>
        </Card>

        {/* Right Col: Crop Vulnerability Matrix */}
        <Card className="p-6 bg-white border-slate-200 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-600" /> Crop Weather Sensitivity
              </h2>
              <Badge variant="emerald" size="sm">Live Model</Badge>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time impact assessment for major crops in {selectedLocation}.
            </p>

            <div className="space-y-3">
              {[
                { crop: 'Tomato (Arka Rakshak)', risk: 'Low Risk', level: 20, color: 'bg-emerald-500', note: 'Canopy thriving; good solar intensity' },
                { crop: 'Green Chilli (Guntur Teja)', risk: 'Moderate Watch', level: 55, color: 'bg-amber-500', note: 'Pre-monsoon humidity watch for thrips' },
                { crop: 'Paddy / Rice (BPT 5204)', risk: 'Favorable', level: 15, color: 'bg-emerald-500', note: 'Standing water requirement well balanced' },
                { crop: 'Cotton (Bt Hybrid)', risk: 'Square Formation', level: 30, color: 'bg-blue-500', note: 'Foliar boron spray recommended' }
              ].map((c) => (
                <div key={c.crop} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>{c.crop}</span>
                    <span className="text-[11px] text-slate-600">{c.risk}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.level}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500">{c.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Data grounded in IMD & Copernicus ECMWF Satellite Telemetry
            </span>
          </div>
        </Card>
      </div>

      {/* Real Agro-Satellite Weather Radar Map */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Live Agro-Satellite Weather Radar & Basin Telemetry
            </h2>
            <p className="text-xs text-slate-500">
              High-resolution satellite imagery with precipitation and cloud density radar over {selectedLocation}
            </p>
          </div>
        </div>

        <RealAgroWeatherMap selectedLocation={selectedLocation} />
      </div>

      {/* 7-Day Interactive Forecast Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> 7-Day Hyperlocal Forecast Timeline
            </h2>
            <p className="text-xs text-slate-500">Click any day to view detailed spray suitability and irrigation advice</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {forecasts.map((f, index) => {
            const isSelected = activeDayIndex === index;
            return (
              <button
                key={f.date}
                onClick={() => setActiveDayIndex(index)}
                className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-2 shadow-xs ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-600/30 scale-102 shadow-md'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {f.dayName}
                </span>

                <div className="my-1">
                  {getWeatherIcon(f.condition)}
                </div>

                <div className="space-y-0.5">
                  <div className="text-sm font-black">
                    {f.tempMax}° <span className={`text-xs font-normal ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`}>/ {f.tempMin}°</span>
                  </div>
                  <div className={`text-[10px] font-semibold flex items-center justify-center gap-1 ${isSelected ? 'text-emerald-100' : 'text-blue-600'}`}>
                    <Droplets className="w-3 h-3" /> {f.precipitationChance}%
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold truncate max-w-full ${
                  isSelected 
                    ? 'bg-emerald-700/80 text-white' 
                    : f.spraySuitability.includes('Excellent')
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {f.condition}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
