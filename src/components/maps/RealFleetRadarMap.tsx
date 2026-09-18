import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Delivery } from '../../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Layers, 
  Maximize2, 
  Navigation, 
  Sparkles, 
  Building2, 
  MapPin, 
  Truck, 
  Thermometer, 
  Activity,
  ShieldCheck,
  Zap,
  Radio
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface RealFleetRadarMapProps {
  delivery: Delivery;
  scenarioMode: 'OPTIMAL' | 'MID_CASE_WARNING' | 'WORST_CASE_CRITICAL';
  temperature: number;
  speed: number;
  humidity: number;
  isReroutedToColdHub: boolean;
}

type TileLayerType = 'dark' | 'satellite' | 'streets' | 'light';

interface Waypoint {
  lat: number;
  lng: number;
  name: string;
  type: 'origin' | 'waypoint' | 'destination' | 'emergency_hub';
}

export const RealFleetRadarMap: React.FC<RealFleetRadarMapProps> = ({
  delivery,
  scenarioMode,
  temperature,
  speed,
  humidity,
  isReroutedToColdHub
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const reroutePolylineRef = useRef<L.Polyline | null>(null);

  const [activeTileType, setActiveTileType] = useState<TileLayerType>('dark');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0.45); // 0 to 1 along path
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Generate realistic route waypoints based on delivery ID
  const { waypoints, emergencyHub } = useMemo(() => {
    let pts: Waypoint[] = [];
    let emHub: Waypoint = {
      lat: 16.3300,
      lng: 80.4600,
      name: 'Guntur Industrial Reefer Hub (Cold Depot)',
      type: 'emergency_hub'
    };

    if (delivery.id === 'del_301' || delivery.pickupLocation.includes('Krishna') || delivery.pickupLocation.includes('Gudivada')) {
      pts = [
        { lat: 16.4410, lng: 80.9926, name: 'Gudivada Farm Origin', type: 'origin' },
        { lat: 16.4620, lng: 80.8850, name: 'Pamarru Toll Gate', type: 'waypoint' },
        { lat: 16.4880, lng: 80.7930, name: 'Kankipadu State Highway', type: 'waypoint' },
        { lat: 16.4950, lng: 80.7100, name: 'Poranki Outer Bypass', type: 'waypoint' },
        { lat: 16.5062, lng: 80.6480, name: 'Auto Nagar Terminal Yard (Vijayawada)', type: 'destination' }
      ];
      emHub = { lat: 16.3300, lng: 80.4600, name: 'Guntur Cold Depot (Reroute Hub)', type: 'emergency_hub' };
    } else if (delivery.id === 'del_302' || delivery.deliveryLocation.includes('Hyderabad')) {
      pts = [
        { lat: 16.3067, lng: 80.4365, name: 'Guntur Farm Cluster', type: 'origin' },
        { lat: 16.4323, lng: 80.5684, name: 'Mangalagiri Highway NH-16', type: 'waypoint' },
        { lat: 16.7800, lng: 80.2900, name: 'Nandigama NH-65 Checkpoint', type: 'waypoint' },
        { lat: 16.9950, lng: 79.9650, name: 'Kodad AP-TS Border Gate', type: 'waypoint' },
        { lat: 17.1400, lng: 79.6200, name: 'Suryapet Highway Food Hub', type: 'waypoint' },
        { lat: 17.1850, lng: 79.1950, name: 'Narketpally Junction', type: 'waypoint' },
        { lat: 17.4123, lng: 78.4354, name: 'Banjara Hills Logistics Terminal (Hyd)', type: 'destination' }
      ];
      emHub = { lat: 16.4323, lng: 80.5684, name: 'Mangalagiri Reefer Logistics Vault', type: 'emergency_hub' };
    } else {
      pts = [
        { lat: 18.0450, lng: 78.2600, name: 'Medak Rural Depot', type: 'origin' },
        { lat: 17.7400, lng: 78.2700, name: 'Narsapur Forest Road', type: 'waypoint' },
        { lat: 17.6250, lng: 78.4800, name: 'Medchal Industrial Corridor', type: 'waypoint' },
        { lat: 17.4720, lng: 78.4850, name: 'Bowenpally Wholesale APMC Yard', type: 'destination' }
      ];
      emHub = { lat: 17.6250, lng: 78.4800, name: 'Medchal Government Cold Storage Depot', type: 'emergency_hub' };
    }

    return { waypoints: pts, emergencyHub: emHub };
  }, [delivery.id, delivery.pickupLocation, delivery.deliveryLocation]);

  // Interpolate coordinates along the polyline path
  const currentPos = useMemo((): [number, number] => {
    if (waypoints.length < 2) return [16.4410, 80.9926];
    
    // If rerouted and progress > 0.5, interpolate toward emergency hub
    if (isReroutedToColdHub && progress >= 0.5) {
      const divertPt = waypoints[Math.floor(waypoints.length / 2)];
      const divertFactor = (progress - 0.5) / 0.5;
      const lat = divertPt.lat + (emergencyHub.lat - divertPt.lat) * divertFactor;
      const lng = divertPt.lng + (emergencyHub.lng - divertPt.lng) * divertFactor;
      return [lat, lng];
    }

    const totalSegments = waypoints.length - 1;
    const scaledProgress = progress * totalSegments;
    const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const segmentFraction = scaledProgress - segmentIndex;

    const p1 = waypoints[segmentIndex];
    const p2 = waypoints[segmentIndex + 1];

    const lat = p1.lat + (p2.lat - p1.lat) * segmentFraction;
    const lng = p1.lng + (p2.lng - p1.lng) * segmentFraction;
    return [lat, lng];
  }, [waypoints, emergencyHub, isReroutedToColdHub, progress]);

  // Tile layer URL helper
  const getTileUrl = (type: TileLayerType): { url: string; attribution: string } => {
    switch (type) {
      case 'dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &copy; Earthstar Geographics'
        };
      case 'streets':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        };
      case 'light':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
        };
    }
  };

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: currentPos,
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      // Add zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Tile layer
      const { url, attribution } = getTileUrl(activeTileType);
      const tileLayer = L.tileLayer(url, { maxZoom: 19, attribution }).addTo(map);
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

  // 2. Handle Tile Layer Switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const { url, attribution } = getTileUrl(activeTileType);
    tileLayerRef.current.setUrl(url);
  }, [activeTileType]);

  // 3. Render Markers, Polylines and Vehicle Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers & polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    const routeLatLngs = waypoints.map(w => [w.lat, w.lng] as [number, number]);

    // Draw Main Route Polyline
    const routePoly = L.polyline(routeLatLngs, {
      color: scenarioMode === 'WORST_CASE_CRITICAL' ? '#ef4444' : scenarioMode === 'MID_CASE_WARNING' ? '#f59e0b' : '#10b981',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8'
    }).addTo(map);
    routePolylineRef.current = routePoly;

    // Origin Marker
    const originPt = waypoints[0];
    const originIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-ping"></div>
          <div class="w-7 h-7 rounded-2xl bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black">
            🌱
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const originMarker = L.marker([originPt.lat, originPt.lng], { icon: originIcon }).addTo(map);
    originMarker.bindPopup(`
      <div class="p-3 bg-slate-900 text-white min-w-[200px]">
        <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
          <span>🌱 ORIGIN FARM DEPOT</span>
        </div>
        <p class="text-xs font-bold">${originPt.name}</p>
        <p class="text-[11px] text-slate-300 mt-1">Cargo: ${delivery.cropName}</p>
        <span class="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
          Qty: ${delivery.quantity} kg • Grade A
        </span>
      </div>
    `);

    // Destination Marker
    const destPt = waypoints[waypoints.length - 1];
    const destIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-7 h-7 rounded-2xl bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black">
            📍
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const destMarker = L.marker([destPt.lat, destPt.lng], { icon: destIcon }).addTo(map);
    destMarker.bindPopup(`
      <div class="p-3 bg-slate-900 text-white min-w-[200px]">
        <div class="flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-1">
          <span>📍 DESTINATION YARD</span>
        </div>
        <p class="text-xs font-bold">${destPt.name}</p>
        <p class="text-[11px] text-slate-300 mt-1">${delivery.deliveryLocation}</p>
        <span class="inline-block mt-2 px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-mono border border-blue-800">
          Scheduled OTP Payout Vault
        </span>
      </div>
    `);

    // If Rerouted, draw Emergency Cold Depot & Diversion Line
    if (isReroutedToColdHub) {
      const divertPt = waypoints[Math.floor(waypoints.length / 2)];
      const reroutePoly = L.polyline([
        [divertPt.lat, divertPt.lng],
        [emergencyHub.lat, emergencyHub.lng]
      ], {
        color: '#ef4444',
        weight: 6,
        dashArray: '6, 6',
        opacity: 0.95
      }).addTo(map);
      reroutePolylineRef.current = reroutePoly;

      const emIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-10 h-10 rounded-full bg-rose-500/40 animate-ping"></div>
            <div class="w-8 h-8 rounded-2xl bg-rose-600 border-2 border-white shadow-2xl flex items-center justify-center text-white text-sm font-black animate-bounce">
              🚨
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      const emMarker = L.marker([emergencyHub.lat, emergencyHub.lng], { icon: emIcon }).addTo(map);
      emMarker.bindPopup(`
        <div class="p-3 bg-slate-950 text-white min-w-[220px] border-l-4 border-rose-500">
          <div class="flex items-center gap-1.5 text-xs font-black text-rose-400 mb-1">
            <span>🚨 EMERGENCY REEFER HUB</span>
          </div>
          <p class="text-xs font-bold">${emergencyHub.name}</p>
          <p class="text-[11px] text-rose-200 mt-1">Automatic Coolant Backup & Nitrogen Purge active.</p>
          <span class="inline-block mt-2 px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-mono border border-rose-800">
            Storage Available: 45,000 kg • Temp: +2.0°C
          </span>
        </div>
      `);
    }

    // Moving Vehicle Marker
    const vehicleColorClass = scenarioMode === 'WORST_CASE_CRITICAL' ? 'bg-rose-600 ring-rose-400' :
      scenarioMode === 'MID_CASE_WARNING' ? 'bg-amber-600 ring-amber-400' : 'bg-indigo-600 ring-indigo-400';

    const vehicleIcon = L.divIcon({
      className: 'custom-vehicle-marker',
      html: `
        <div class="flex flex-col items-center group cursor-pointer">
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 rounded-full bg-indigo-500/30 radar-ping-ring pointer-events-none"></div>
            <div class="w-10 h-10 rounded-2xl ${vehicleColorClass} text-white border-2 border-white shadow-2xl ring-4 flex items-center justify-center font-bold text-lg">
              🚚
            </div>
          </div>
          <div class="mt-1 px-2 py-0.5 bg-slate-950/90 text-white rounded-md border border-slate-700 shadow-xl text-[10px] font-mono font-bold whitespace-nowrap flex items-center gap-1">
            <span>${speed} km/h</span>
            <span class="${temperature > 15 ? 'text-rose-400 font-black' : 'text-emerald-400'}">${temperature}°C</span>
          </div>
        </div>
      `,
      iconSize: [40, 48],
      iconAnchor: [20, 24]
    });

    const vehicleMarker = L.marker(currentPos, { icon: vehicleIcon }).addTo(map);
    vehicleMarkerRef.current = vehicleMarker;

    vehicleMarker.bindPopup(`
      <div class="p-3.5 bg-slate-900 text-white min-w-[240px]">
        <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
          <span class="text-xs font-black text-indigo-400">${delivery.vehiclePlate}</span>
          <span class="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
            GPS Live
          </span>
        </div>
        <p class="text-xs font-bold text-white">${delivery.vehicleType}</p>
        <p class="text-[11px] text-slate-300">Driver: <strong>${delivery.driverName}</strong> (${delivery.driverPhone})</p>
        
        <div class="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-slate-800 text-[10px] font-mono">
          <div class="bg-slate-800/80 p-1.5 rounded">
            <span class="text-slate-400 block">Reefer Temp:</span>
            <span class="text-emerald-300 font-bold text-xs">${temperature}°C</span>
          </div>
          <div class="bg-slate-800/80 p-1.5 rounded">
            <span class="text-slate-400 block">Speed:</span>
            <span class="text-indigo-300 font-bold text-xs">${speed} km/h</span>
          </div>
          <div class="bg-slate-800/80 p-1.5 rounded">
            <span class="text-slate-400 block">Humidity:</span>
            <span class="text-teal-300 font-bold text-xs">${humidity}%</span>
          </div>
          <div class="bg-slate-800/80 p-1.5 rounded">
            <span class="text-slate-400 block">Cargo:</span>
            <span class="text-white font-bold truncate block">${delivery.cropName.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    `);

    // Fit bounds on first load
    map.fitBounds(routePoly.getBounds(), { padding: [40, 40] });

  }, [waypoints, emergencyHub, isReroutedToColdHub, scenarioMode, activeTileType]);

  // 4. Update Vehicle Position smoothly
  useEffect(() => {
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.setLatLng(currentPos);
    }
  }, [currentPos]);

  // 5. Simulation Interval (Animates Truck along road)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.004 * simSpeed;
        if (next >= 1) return 0.05; // loop around
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const handleCenterOnVehicle = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(currentPos, 13, { duration: 1.2 });
    }
  };

  const handleFitEntireRoute = () => {
    if (mapInstanceRef.current && routePolylineRef.current) {
      mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [40, 40] });
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-3xl' : 'aspect-video sm:aspect-[21/10]'
    }`}>
      
      {/* Leaflet Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Floating Telemetry & Map Controls Header */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Active Live Signal Badge */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700 shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <div>
            <span className="text-xs font-black text-white flex items-center gap-1.5 leading-none">
              <span>Real Live GPS Radar</span>
              <Badge variant="emerald" size="sm" className="py-0 text-[9px]">
                Active Telemetry
              </Badge>
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {delivery.vehiclePlate} • Lat: {currentPos[0].toFixed(4)}, Lng: {currentPos[1].toFixed(4)}
            </span>
          </div>
        </div>

        {/* Right: Map View Toggles & Fullscreen */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl">
          
          {/* Tile Layer Selector */}
          <div className="flex items-center gap-1 border-r border-slate-700 pr-1.5 mr-0.5 text-[11px] font-bold">
            <button
              onClick={() => setActiveTileType('dark')}
              className={`px-2 py-1 rounded-xl transition-colors ${
                activeTileType === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Dark Telemetry Mode"
            >
              🌃 Dark
            </button>
            <button
              onClick={() => setActiveTileType('satellite')}
              className={`px-2 py-1 rounded-xl transition-colors ${
                activeTileType === 'satellite' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Agri Satellite Imagery"
            >
              🌿 Satellite
            </button>
            <button
              onClick={() => setActiveTileType('streets')}
              className={`px-2 py-1 rounded-xl transition-colors ${
                activeTileType === 'streets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="OpenStreetMap Streets"
            >
              🗺️ Streets
            </button>
          </div>

          {/* Center on Truck Button */}
          <button
            onClick={handleCenterOnVehicle}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Focus On Vehicle"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Fit Route Button */}
          <button
            onClick={handleFitEntireRoute}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Fit Entire Route"
          >
            <Radio className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Bottom Floating Playback & Simulation Bar */}
      <div className="absolute bottom-3 left-3 right-16 z-20 flex items-center justify-between gap-3 pointer-events-none">
        
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700 shadow-2xl">
          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            title={isPlaying ? 'Pause Transit Simulation' : 'Resume Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset Position */}
          <button
            onClick={() => setProgress(0.05)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title="Restart Route from Origin"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Multipliers */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 border-l border-slate-700 pl-2">
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-1.5 py-0.5 rounded-md transition-colors ${
                  simSpeed === s ? 'bg-emerald-500 text-slate-950 font-black' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Route Progress Slider */}
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-700 pl-3">
            <span className="text-[10px] font-mono text-slate-400">Progress:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={progress}
              onChange={(e) => setProgress(parseFloat(e.target.value))}
              className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

        {/* Live Speed & Sensor Mini HUD */}
        <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700 shadow-2xl text-xs font-bold text-white">
          <div className="flex items-center gap-1.5">
            <Thermometer className={`w-4 h-4 ${temperature > 15 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
            <span>{temperature}°C Reefer</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-indigo-300">
            <Activity className="w-4 h-4" />
            <span>{speed} km/h GPS</span>
          </div>
          {isReroutedToColdHub && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-rose-400 font-bold animate-pulse flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" /> Diverting to Cold Hub
              </span>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
