import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Sprout, Search, CheckCircle2, Trash2, MapPin, DollarSign } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const CropManagementPage: React.FC = () => {
  const { crops, deleteCrop } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = crops.filter(c => 
    c.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Platform Crop Management & Listings
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            {crops.length} Total
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor all active and harvested agricultural commodities listed across districts
        </p>
      </div>

      <Card className="p-4 border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search crop name, producer, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
          />
        </div>
      </Card>

      <Card className="overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Crop Commodity</th>
                <th className="p-4">Farmer Producer</th>
                <th className="p-4">Available Qty</th>
                <th className="p-4">Price / kg</th>
                <th className="p-4">Harvest Date</th>
                <th className="p-4">Growth Stage</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((crop) => (
                <tr key={crop.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img src={crop.imageUrl} alt={crop.cropName} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 block">{crop.cropName}</span>
                        <span className="text-slate-400 text-[11px]">{crop.cropVariety}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{crop.farmerName}</span>
                    <span className="text-slate-400 text-[11px]">{crop.farmerDistrict}, {crop.farmerState}</span>
                  </td>

                  <td className="p-4 font-bold text-slate-800">{crop.availableQuantity.toLocaleString()} kg</td>
                  <td className="p-4 font-bold text-emerald-700">₹{crop.pricePerKg}</td>
                  <td className="p-4 text-slate-600">{crop.expectedHarvestDate}</td>
                  <td className="p-4">
                    <Badge variant="emerald" size="sm">{crop.growthStage}</Badge>
                  </td>

                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCrop(crop.id)}
                      className="text-rose-600 hover:bg-rose-50 border-rose-200 p-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
