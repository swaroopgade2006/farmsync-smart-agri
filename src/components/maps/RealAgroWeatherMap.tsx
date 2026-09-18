import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  MapPin, 
  Layers, 
  Maximize2,
  Sparkles,
  CloudRain
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface RealAgroWeatherMapProps {
  selectedLocation: string;
}

const REGION_COORDS: Record<string, { center: [number, number]; name: string; state: string; temp: number; rainChance: number; condition: string }> = {
  'Guntur / Krishna, AP': { center: [16.3067, 80.4365], name: 'Krishna-Godavari Agricultural Basin', state: 'Andhra Pradesh', temp: 33.4, rainChance: 15, condition: 'Favorable Spray Window' },
  'Nashik / Pune, MH': { center: [19.9975, 73.7898], name: 'Nashik Grape & Onion Belt', state: 'Maharashtra', temp: 28.6, rainChance: 40, condition: 'Scattered Showers' },
  'Ludhiana / Jalandhar, PB': { center: [30.9010, 75.8573], name: 'Punjab Granary Wheat-Paddy Zone', state: 'Punjab', temp: 31.2, rainChance: 10, condition: 'Clear Sky / High Solar' },
  'Surat / Anand, GJ': { center: [21.1702, 72.8311], name: 'Anand-Kheda Dairy & Cotton Valley', state: 'Gujarat', temp: 32.8, rainChance: 25, condition: 'Moderate Humidity' },
  'Varanasi / Mirzapur, UP': { center: [25.3176, 82.9739], name: 'Middle Gangetic Vegetable Cluster', state: 'Uttar Pradesh', temp: 34.1, rainChance: 20, condition: 'Warm & Dry' }
};

export const RealAgroWeatherMap: React.FC<RealAgroWeatherMapProps> = ({ selectedLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'precipitation' | 'clouds' | 'streets'>('satellite');

  const locData = REGION_COORDS[selectedLocation] || REGION_COORDS['Guntur / Krishna, AP'];

  const getTileUrl = (layer: string) => {
    switch (layer) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'precipitation':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'clouds':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      case 'streets':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: locData.center,
        zoom: 9,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const tileLayer = L.tileLayer(getTileUrl(activeLayer), { maxZoom: 18 }).addTo(map);
      tileLayerRef.current = tileLayer;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Layer change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(getTileUrl(activeLayer));
  }, [activeLayer]);

  // Handle Location change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo(locData.center, 9, { duration: 1.5 });

    // Clear previous markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Add Weather Radar Circle
    L.circle(locData.center, {
      radius: 35000,
      color: activeLayer === 'precipitation' ? '#3b82f6' : '#10b981',
      fillColor: activeLayer === 'precipitation' ? '#3b82f6' : '#10b981',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '5, 5'
    }).addTo(map);

    // Weather Marker
    const icon = L.divIcon({
      className: 'custom-weather-marker',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="absolute w-12 h-12 rounded-full bg-emerald-500/30 animate-ping"></div>
          <div class="w-10 h-10 rounded-2xl bg-emerald-600 border-2 border-white shadow-2xl flex items-center justify-center text-white text-base font-bold">
            ⛅
          </div>
          <div class="mt-1 px-2.5 py-0.5 bg-slate-950/90 text-white rounded-lg border border-emerald-500/50 shadow-xl text-[10px] font-bold whitespace-nowrap">
            ${locData.temp}°C • ${locData.rainChance}% Rain
          </div>
        </div>
      `,
      iconSize: [44, 48],
      iconAnchor: [22, 24]
    });

    L.marker(locData.center, { icon })
      .addTo(map)
      .bindPopup(`
        <div class="p-3 bg-slate-900 text-white min-w-[200px]">
          <span class="text-[10px] font-bold text-emerald-400 block uppercase">IMD SATELLITE RADAR</span>
          <h4 class="text-xs font-black text-white mt-0.5">${locData.name}</h4>
          <p class="text-[11px] text-slate-300 mt-1">Status: <strong class="text-emerald-300">${locData.condition}</strong></p>
          <div class="mt-2 grid grid-cols-2 gap-1 text-[10px] font-mono">
            <span class="bg-slate-800 p-1 rounded">Temp: ${locData.temp}°C</span>
            <span class="bg-slate-800 p-1 rounded">Precip: ${locData.rainChance}%</span>
          </div>
        </div>
      `)
      .openPopup();

  }, [selectedLocation, activeLayer, locData]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-video sm:aspect-[21/9]">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black text-white">
            🛰️ Live Agro-Satellite Radar: {locData.state}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl text-[11px] font-bold">
          <button
            onClick={() => setActiveLayer('satellite')}
            className={`px-2.5 py-1 rounded-xl transition-colors ${
              activeLayer === 'satellite' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌿 Satellite
          </button>
          <button
            onClick={() => setActiveLayer('precipitation')}
            className={`px-2.5 py-1 rounded-xl transition-colors ${
              activeLayer === 'precipitation' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌧️ Precipitation
          </button>
          <button
            onClick={() => setActiveLayer('clouds')}
            className={`px-2.5 py-1 rounded-xl transition-colors ${
              activeLayer === 'clouds' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ☁️ Cloud Radar
          </button>
        </div>

      </div>

      {/* Bottom Floating Banner */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shadow-xl text-xs font-bold text-slate-300 hidden sm:flex items-center gap-3">
        <span className="text-emerald-400">● Optimal Spray Window: 06:00 AM – 10:30 AM</span>
        <span className="text-slate-600">•</span>
        <span>Satellite Telemetry Active (35km Radius)</span>
      </div>

    </div>
  );
};
