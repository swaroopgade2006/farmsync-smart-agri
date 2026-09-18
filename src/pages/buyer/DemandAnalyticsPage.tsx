import React from 'react';
import { useData } from '../../context/DataContext';
import { calculateDemandAnalytics } from '../../services/aiEngine';
import { 
  TrendingUp, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  AlertCircle,
  PieChart as PieIcon,
  Layers
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export const DemandAnalyticsPage: React.FC = () => {
  const { crops, buyerRequirements } = useData();
  const gapAnalytics = calculateDemandAnalytics(crops, buyerRequirements);

  const chartData = gapAnalytics.map(item => ({
    name: item.cropName,
    Demand: item.demandKg,
    Supply: item.supplyKg,
    Gap: item.gapKg,
    AvgPrice: item.averagePrice
  }));

  const totalDemand = gapAnalytics.reduce((sum, item) => sum + item.demandKg, 0);
  const totalSupply = gapAnalytics.reduce((sum, item) => sum + item.supplyKg, 0);
  const totalGap = Math.max(0, totalDemand - totalSupply);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <TrendingUp className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Real-Time Market Intelligence
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Agricultural Supply & Demand Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Dynamic macro analysis of institutional buyer requirements vs farmer production supply
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-slate-200 bg-blue-50/40">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">Total Buyer Demand</span>
          <p className="text-3xl font-black text-blue-900 mt-1">{totalDemand.toLocaleString()} kg</p>
          <span className="text-xs text-blue-700 mt-1 block">Across all wholesale inquiries</span>
        </Card>

        <Card className="p-5 border-slate-200 bg-emerald-50/40">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">Available Farmer Supply</span>
          <p className="text-3xl font-black text-emerald-900 mt-1">{totalSupply.toLocaleString()} kg</p>
          <span className="text-xs text-emerald-700 mt-1 block">Active on-ground listings</span>
        </Card>

        <Card className="p-5 border-slate-200 bg-amber-50/40">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">Net Market Deficit / Gap</span>
          <p className="text-3xl font-black text-amber-900 mt-1">{totalGap.toLocaleString()} kg</p>
          <span className="text-xs text-amber-700 mt-1 block">Unmet commercial procurement</span>
        </Card>
      </div>

      {/* Main Chart Card */}
      <Card className="p-6 border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Commodity Demand vs. Supply Comparison (kg)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Visualizing harvest availability against institutional purchase contracts</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} unit=" kg" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Demand" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Buyer Demand (kg)" />
              <Bar dataKey="Supply" fill="#10b981" radius={[6, 6, 0, 0]} name="Farmer Supply (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gap Table */}
      <Card className="p-6 border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Detailed Commodity Supply-Demand Deficit Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Crop Commodity</th>
                <th className="p-3">Buyer Demand (kg)</th>
                <th className="p-3">Available Supply (kg)</th>
                <th className="p-3">Supply-Demand Gap</th>
                <th className="p-3">Avg Market Price</th>
                <th className="p-3">Market Pressure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {gapAnalytics.map((item) => (
                <tr key={item.cropName} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-slate-900">{item.cropName}</td>
                  <td className="p-3 text-blue-700 font-bold">{item.demandKg.toLocaleString()} kg</td>
                  <td className="p-3 text-emerald-700 font-bold">{item.supplyKg.toLocaleString()} kg</td>
                  <td className="p-3">
                    <span className={`font-black ${item.gapKg > 0 ? 'text-amber-700' : 'text-slate-600'}`}>
                      {item.gapKg > 0 ? `+${item.gapKg.toLocaleString()} kg Deficit` : `${Math.abs(item.gapKg).toLocaleString()} kg Surplus`}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-800">₹{item.averagePrice}/kg</td>
                  <td className="p-3">
                    <Badge variant={item.urgency === 'HIGH' ? 'rose' : item.urgency === 'MEDIUM' ? 'amber' : 'emerald'} size="sm">
                      {item.urgency}
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
