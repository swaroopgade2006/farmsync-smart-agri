import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DarkStore } from '../../types';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Zap, 
  Thermometer, 
  Bike, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  Search,
  Navigation,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface RealDarkStoresMapProps {
  darkStores: DarkStore[];
  selectedStoreId?: string;
  onSelectStore?: (store: DarkStore) => void;
  heightClass?: string;
}

type TileLayerType = 'streets' | 'satellite' | 'dark' | 'light';

export const RealDarkStoresMap: React.FC<RealDarkStoresMapProps> = ({
  darkStores,
  selectedStoreId,
  onSelectStore,
  heightClass = 'aspect-video sm:aspect-[21/10]'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);

  const [activeTileType, setActiveTileType] = useState<TileLayerType>('streets');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const cities = ['ALL', ...Array.from(new Set(darkStores.map(ds => ds.city)))];

  const filteredStores = darkStores.filter(ds => {
    if (selectedCity !== 'ALL' && ds.city !== selectedCity) return false;
    return true;
  });

  const getTileUrl = (type: TileLayerType): { url: string; attribution: string } => {
    switch (type) {
      case 'streets':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri &copy; Earthstar Geographics'
        };
      case 'dark':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; CARTO &copy; OpenStreetMap'
        };
      case 'light':
        return {
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; CARTO &copy; OpenStreetMap'
        };
    }
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = darkStores[0] ? [darkStores[0].lat, darkStores[0].lng] : [16.4971, 80.6554];
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const { url, attribution } = getTileUrl(activeTileType);
      const tileLayer = L.tileLayer(url, { maxZoom: 19, attribution }).addTo(map);
      tileLayerRef.current = tileLayer;

      const featureGroup = L.featureGroup().addTo(map);
      markersGroupRef.current = featureGroup;

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

  // 3. Render Dark Stores & 15-min delivery radius circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    filteredStores.forEach((store) => {
      const isSelected = store.id === selectedStoreId;

      // 15-Min Delivery Radius Circle
      const radiusMeters = (store.deliveryRadiusKm || 4.5) * 1000;
      const circle = L.circle([store.lat, store.lng], {
        radius: radiusMeters,
        color: isSelected ? '#10b981' : '#f59e0b',
        fillColor: isSelected ? '#10b981' : '#f59e0b',
        fillOpacity: isSelected ? 0.18 : 0.08,
        weight: isSelected ? 2.5 : 1.5,
        dashArray: isSelected ? '4, 4' : '6, 6'
      });
      group.addLayer(circle);

      // Dark Store Hub Marker Icon
      const iconHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer">
          <div class="relative flex items-center justify-center">
            ${isSelected ? '<div class="absolute w-12 h-12 rounded-full bg-emerald-500/30 animate-ping"></div>' : ''}
            <div class="w-10 h-10 rounded-2xl ${isSelected ? 'bg-emerald-600 ring-4 ring-emerald-400' : 'bg-amber-500 ring-2 ring-amber-300'} text-white border-2 border-white shadow-2xl flex items-center justify-center font-bold">
              ⚡
            </div>
          </div>
          <div class="mt-1 px-2 py-0.5 ${isSelected ? 'bg-emerald-950 text-emerald-200 border-emerald-500' : 'bg-slate-900 text-amber-200 border-amber-500'} rounded-md border shadow-lg text-[10px] font-bold whitespace-nowrap">
            ${store.city} Hub (15m)
          </div>
        </div>
      `;

      const storeIcon = L.divIcon({
        className: 'custom-darkstore-marker',
        html: iconHtml,
        iconSize: [40, 48],
        iconAnchor: [20, 24]
      });

      const totalStock = store.inventory.reduce((sum, item) => sum + item.stockKg, 0);

      const marker = L.marker([store.lat, store.lng], { icon: storeIcon });

      const popupHtml = `
        <div class="p-4 bg-slate-950 text-white min-w-[260px] space-y-3">
          <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <span class="text-[10px] font-bold uppercase text-amber-400">⚡ 15-MIN DARK STORE</span>
              <h4 class="text-sm font-black text-white">${store.name}</h4>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
              Open Now
            </span>
          </div>

          <p class="text-xs text-slate-300">${store.address}</p>

          <div class="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span class="text-slate-400 block text-[10px]">Cold Vault:</span>
              <span class="text-emerald-400 font-bold">+${store.temperatureCelsius}°C</span>
            </div>
            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span class="text-slate-400 block text-[10px]">Fresh Stock:</span>
              <span class="text-white font-bold">${totalStock} kg</span>
            </div>
            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span class="text-slate-400 block text-[10px]">Active Riders:</span>
              <span class="text-amber-300 font-bold">${store.activeRidersCount} Bikes</span>
            </div>
            <div class="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span class="text-slate-400 block text-[10px]">Avg Delivery:</span>
              <span class="text-indigo-300 font-bold">${store.estimatedDeliveryMinutes} Mins</span>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-400 text-[10px]">Coverage: <strong>${store.deliveryRadiusKm} km</strong></span>
            <button 
              id="select-store-btn-${store.id}" 
              class="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1 cursor-pointer"
            >
              Select Hub ⚡
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`select-store-btn-${store.id}`);
        if (btn && onSelectStore) {
          btn.onclick = () => {
            onSelectStore(store);
            map.closePopup();
          };
        }
      });

      group.addLayer(marker);

      // Add a couple simulated moving rider markers in the vicinity
      const riderOffsets = [
        [0.008, 0.006],
        [-0.007, 0.009],
        [0.005, -0.008]
      ];

      riderOffsets.forEach(([dLat, dLng], idx) => {
        const riderIcon = L.divIcon({
          className: 'custom-rider-marker',
          html: `
            <div class="w-6 h-6 rounded-full bg-slate-900/90 border border-amber-400 shadow-md flex items-center justify-center text-xs text-amber-300 group hover:scale-125 transition-transform" title="Express Rider on route">
              🛵
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const riderMarker = L.marker([store.lat + dLat, store.lng + dLng], { icon: riderIcon });
        riderMarker.bindPopup(`
          <div class="p-2.5 bg-slate-900 text-white text-xs min-w-[160px]">
            <div class="flex items-center gap-1 text-amber-400 font-bold text-[10px] mb-1">
              <span>⚡ ACTIVE EXPRESS RIDER #${idx + 1}</span>
            </div>
            <p class="font-bold">Hub: ${store.name}</p>
            <p class="text-[11px] text-slate-300 mt-0.5">Dispatched: 6 mins ago</p>
            <span class="inline-block mt-1 text-[10px] text-emerald-400 font-bold">Estimated Arrival: 8 mins</span>
          </div>
        `);
        group.addLayer(riderMarker);
      });

    });

    if (filteredStores.length > 0) {
      if (filteredStores.length === 1) {
        map.setView([filteredStores[0].lat, filteredStores[0].lng], 13);
      } else {
        map.fitBounds(group.getBounds(), { padding: [40, 40] });
      }
    }

  }, [filteredStores, selectedStoreId, activeTileType]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 14, { duration: 1.5 });

          // Add User Marker
          const userIcon = L.divIcon({
            className: 'custom-user-marker',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="absolute w-8 h-8 rounded-full bg-blue-500/40 animate-ping"></div>
                <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs">
                  🏠
                </div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('<div class="p-2 text-xs font-bold">Your Location</div>')
            .openPopup();
        }
      },
      () => {
        // Fallback to first store
        if (darkStores[0] && mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([darkStores[0].lat, darkStores[0].lng], 13);
        }
      }
    );
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-4 z-50' : heightClass
    }`}>
      
      {/* Leaflet DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl overflow-x-auto max-w-full">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedCity === city
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {city === 'ALL' ? '🌐 All Cities' : city}
            </button>
          ))}
        </div>

        {/* Map Layers & Location Trigger */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl">
          
          <div className="flex items-center gap-1 border-r border-slate-700 pr-1.5 mr-0.5 text-[11px] font-bold">
            <button
              onClick={() => setActiveTileType('streets')}
              className={`px-2 py-1 rounded-xl transition-colors ${
                activeTileType === 'streets' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ Streets
            </button>
            <button
              onClick={() => setActiveTileType('satellite')}
              className={`px-2 py-1 rounded-xl transition-colors ${
                activeTileType === 'satellite' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌿 Satellite
            </button>
            <button
              onClick={() => setActiveTileType('dark')}
              className={`px-2 py-1 rounded-xl transition-colors ${
                activeTileType === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌃 Dark
            </button>
          </div>

          <button
            onClick={handleLocateMe}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold"
            title="Locate nearest dark store"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Near Me</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700 shadow-xl hidden sm:flex items-center gap-4 text-xs font-bold text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white" />
          <span>⚡ Dark Store Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
          <span>Selected Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🛵</span>
          <span>Active Rider</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400">
          <Clock className="w-3.5 h-3.5" />
          <span>15-min Guaranteed Delivery Zone</span>
        </div>
      </div>

    </div>
  );
};
