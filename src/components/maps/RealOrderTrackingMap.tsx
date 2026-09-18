import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  Zap, 
  Phone, 
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface RealOrderTrackingMapProps {
  originLocation: string;
  deliveryLocation: string;
  orderNumber: string;
  cropName: string;
  quantityKg: number;
  status: string;
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  isExpress?: boolean;
}

export const RealOrderTrackingMap: React.FC<RealOrderTrackingMapProps> = ({
  originLocation,
  deliveryLocation,
  orderNumber,
  cropName,
  quantityKg,
  status,
  driverName = 'Kishore Varma',
  driverPhone = '+91 97000 11223',
  vehiclePlate = 'AP 16 TX 4412',
  isExpress = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const [progress, setProgress] = useState(0.55);

  // Compute realistic coordinates based on location strings
  const { originCoords, destCoords, waypoints } = React.useMemo(() => {
    let org: [number, number] = [16.4410, 80.9926]; // Gudivada Farm
    let dst: [number, number] = [16.5062, 80.6480]; // Vijayawada Auto Nagar
    
    if (isExpress || originLocation.includes('Dark Store') || originLocation.includes('Benz Circle')) {
      org = [16.4971, 80.6554]; // Dark Store Benz Circle
      dst = [16.5120, 80.6380]; // Consumer Address (e.g., Labbipet)
    } else if (deliveryLocation.includes('Hyderabad')) {
      org = [16.3067, 80.4365]; // Guntur
      dst = [17.4123, 78.4354]; // Hyderabad Banjara Hills
    } else if (originLocation.includes('Guntur')) {
      org = [16.3067, 80.4365];
      dst = [16.5062, 80.6480];
    }

    // Generate 4 intermediate road points
    const wps: [number, number][] = [
      org,
      [org[0] + (dst[0] - org[0]) * 0.3 + 0.005, org[1] + (dst[1] - org[1]) * 0.3 - 0.004],
      [org[0] + (dst[0] - org[0]) * 0.65 - 0.003, org[1] + (dst[1] - org[1]) * 0.65 + 0.006],
      dst
    ];

    return { originCoords: org, destCoords: dst, waypoints: wps };
  }, [originLocation, deliveryLocation, isExpress]);

  // Compute current position along the waypoints
  const currentPos: [number, number] = React.useMemo(() => {
    const totalSegs = waypoints.length - 1;
    const scaled = progress * totalSegs;
    const segIdx = Math.min(Math.floor(scaled), totalSegs - 1);
    const frac = scaled - segIdx;
    const p1 = waypoints[segIdx];
    const p2 = waypoints[segIdx + 1];
    return [
      p1[0] + (p2[0] - p1[0]) * frac,
      p1[1] + (p2[1] - p1[1]) * frac
    ];
  }, [waypoints, progress]);

  // Animate transit vehicle
  useEffect(() => {
    if (status === 'DELIVERED' || status === 'COMPLETED') {
      setProgress(1);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.005;
        if (next >= 1) return 0.1;
        return next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: currentPos,
        zoom: isExpress ? 14 : 11,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Draw Route Polyline
      const poly = L.polyline(waypoints, {
        color: isExpress ? '#f59e0b' : '#3b82f6',
        weight: 5,
        opacity: 0.85,
        dashArray: '6, 6'
      }).addTo(map);

      // Origin Marker
      const orgIcon = L.divIcon({
        className: 'custom-org-marker',
        html: `
          <div class="w-7 h-7 rounded-2xl ${isExpress ? 'bg-amber-500' : 'bg-emerald-600'} border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
            ${isExpress ? '⚡' : '🌱'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker(originCoords, { icon: orgIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2.5 text-xs font-bold bg-slate-900 text-white rounded-lg">
            <span class="text-[10px] text-emerald-400 block">${isExpress ? 'DARK STORE HUB' : 'FARM ORIGIN'}</span>
            ${originLocation}
          </div>
        `);

      // Destination Marker
      const dstIcon = L.divIcon({
        className: 'custom-dst-marker',
        html: `
          <div class="w-7 h-7 rounded-2xl bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
            📍
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker(destCoords, { icon: dstIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2.5 text-xs font-bold bg-slate-900 text-white rounded-lg">
            <span class="text-[10px] text-blue-400 block">DELIVERY DESTINATION</span>
            ${deliveryLocation}
          </div>
        `);

      // Moving Vehicle Marker
      const vehIcon = L.divIcon({
        className: 'custom-veh-marker',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="absolute w-10 h-10 rounded-full ${isExpress ? 'bg-amber-500/30' : 'bg-blue-500/30'} animate-ping pointer-events-none"></div>
            <div class="w-9 h-9 rounded-2xl ${isExpress ? 'bg-amber-500' : 'bg-indigo-600'} text-white border-2 border-white shadow-2xl flex items-center justify-center font-bold text-sm">
              ${isExpress ? '🛵' : '🚚'}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
      const vehMarker = L.marker(currentPos, { icon: vehIcon }).addTo(map);
      vehicleMarkerRef.current = vehMarker;

      map.fitBounds(poly.getBounds(), { padding: [30, 30] });
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [waypoints, isExpress]);

  // Update vehicle position
  useEffect(() => {
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.setLatLng(currentPos);
    }
  }, [currentPos]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-lg aspect-video sm:aspect-[21/9]">
      
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating GPS HUD Banner */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200 shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="text-xs font-black text-slate-900 block leading-tight">
              {isExpress ? '⚡ 15-Min Live Delivery Radar' : '🚚 Cold-Chain GPS Tracking'}
            </span>
            <span className="text-[10px] text-slate-500">
              {orderNumber} • Driver: {driverName} ({vehiclePlate})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200 shadow-xl text-xs font-bold">
          <a
            href={`tel:${driverPhone}`}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call Driver</span>
          </a>
        </div>

      </div>

    </div>
  );
};
