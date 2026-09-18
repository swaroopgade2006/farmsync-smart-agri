import React from 'react';
import { useData } from '../../context/DataContext';
import { calculateDemandAnalytics } from '../../services/aiEngine';
import { TrendingUp, BarChart3, PieChart as PieIcon, Sparkles } from 'lucide-react';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminAnalyticsPage: React.FC = () => {
  const { crops, buyerRequirements } = useData();
  const gapAnalytics = calculateDemandAnalytics(crops, buyerRequirements);

  const barData = gapAnalytics.map(i => ({
    name: i.cropName,
    Demand: i.demandKg,
    Supply: i.supplyKg,
    Gap: i.gapKg
  }));

  const pieData = [
    { name: 'Self-Funded Farmers', value: crops.filter(c => c.farmerType === 'Self-Funded').length, color: '#3b82f6' },
    { name: 'Funded Farmers', value: crops.filter(c => c.farmerType === 'Funded').length, color: '#10b981' },
    { name: 'Free-Support Farmers', value: crops.filter(c => c.farmerType === 'Free-Support').length, color: '#f59e0b' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          Platform-Wide Agricultural Macro Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          State-level supply gaps, commodity distribution, and farmer financial inclusivity metrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Demand vs Supply Gap */}
        <Card className="lg:col-span-2 p-6 border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Supply vs. Demand Discrepancy by Commodity (kg)
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 12 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 12 }} unit=" kg" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Demand" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Demand (kg)" />
                <Bar dataKey="Supply" fill="#10b981" radius={[4, 4, 0, 0]} name="Supply (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right 1 Col: Farmer Inclusion Pie Chart */}
        <Card className="p-6 border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-600" />
            Farmer Financial Models
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
            {pieData.map(item => (
              <div key={item.name} className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">{item.value} crops</span>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};
