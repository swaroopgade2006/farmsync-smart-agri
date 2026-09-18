import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Sparkles, 
  Search, 
  Building2, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface MandiPriceRecord {
  market: string;
  state: string;
  commodity: string;
  variety: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  dailyChange: number;
  arrivalTons: number;
}

const MANDI_DATA: MandiPriceRecord[] = [
  { market: 'Vijayawada Market Yard', state: 'Andhra Pradesh', commodity: 'Tomato', variety: 'Arka Rakshak', modalPrice: 29, minPrice: 24, maxPrice: 34, dailyChange: 2.8, arrivalTons: 140 },
  { market: 'Agra APMC Sub-Yard', state: 'Uttar Pradesh', commodity: 'Potato', variety: 'Kufri Jyoti / Bahar', modalPrice: 22, minPrice: 18, maxPrice: 26, dailyChange: 1.1, arrivalTons: 520 },
  { market: 'Lasalgaon APMC', state: 'Maharashtra', commodity: 'Red Onion', variety: 'Nashik Red Grade-1', modalPrice: 26, minPrice: 20, maxPrice: 30, dailyChange: -0.8, arrivalTons: 450 },
  { market: 'Guntur Chilli Market Yard', state: 'Andhra Pradesh', commodity: 'Green Chilli', variety: 'Guntur Teja Hybrid', modalPrice: 56, minPrice: 48, maxPrice: 62, dailyChange: -1.2, arrivalTons: 85 },
  { market: 'Azadpur APMC Hub', state: 'Delhi NCR', commodity: 'Capsicum', variety: 'Indra Green Hybrid', modalPrice: 48, minPrice: 40, maxPrice: 55, dailyChange: 3.2, arrivalTons: 95 },
  { market: 'Bowenpally APMC Market', state: 'Telangana', commodity: 'Brinjal / Eggplant', variety: 'Bhagyamati Purple', modalPrice: 24, minPrice: 19, maxPrice: 28, dailyChange: 0.5, arrivalTons: 110 },
  { market: 'Kolar APMC Mandi', state: 'Karnataka', commodity: 'Okra / Ladyfinger', variety: 'Pusa Sawani Tender', modalPrice: 32, minPrice: 26, maxPrice: 38, dailyChange: -2.1, arrivalTons: 75 },
  { market: 'Vashi APMC Navi Mumbai', state: 'Maharashtra', commodity: 'Cauliflower', variety: 'Pusa Snowball 16', modalPrice: 35, minPrice: 28, maxPrice: 42, dailyChange: 4.5, arrivalTons: 130 },
  { market: 'Indore Mandi Prangan', state: 'Madhya Pradesh', commodity: 'Cabbage', variety: 'Golden Acre Crisp', modalPrice: 18, minPrice: 14, maxPrice: 22, dailyChange: -0.5, arrivalTons: 190 },
  { market: 'Madanapalle APMC', state: 'Andhra Pradesh', commodity: 'Carrot', variety: 'Pusa Kesar Sweet', modalPrice: 38, minPrice: 30, maxPrice: 44, dailyChange: 1.8, arrivalTons: 65 },
  { market: 'Gudimalkapur Flower & Veg Market', state: 'Telangana', commodity: 'Spinach / Palak', variety: 'All Green Leafy', modalPrice: 22, minPrice: 16, maxPrice: 26, dailyChange: 0.0, arrivalTons: 40 },
  { market: 'Surat APMC Main Yard', state: 'Gujarat', commodity: 'Bitter Gourd / Karela', variety: 'Pusa Do Mausami', modalPrice: 36, minPrice: 30, maxPrice: 42, dailyChange: 2.3, arrivalTons: 55 },
  { market: 'Warangal Agricultural Market', state: 'Telangana', commodity: 'Bottle Gourd / Lauki', variety: 'Pusa Naveen Long', modalPrice: 16, minPrice: 12, maxPrice: 20, dailyChange: -1.0, arrivalTons: 80 },
  { market: 'Kochi Spices & Veg Board', state: 'Kerala', commodity: 'Ginger', variety: 'Rio de Janeiro Fresh', modalPrice: 85, minPrice: 75, maxPrice: 95, dailyChange: 5.0, arrivalTons: 35 },
  { market: 'Mandsaur APMC Yard', state: 'Madhya Pradesh', commodity: 'Garlic', variety: 'Yamuna Safed (G-1)', modalPrice: 130, minPrice: 115, maxPrice: 150, dailyChange: 6.2, arrivalTons: 90 },
  { market: 'Shimla APMC Sub-Centre', state: 'Himachal Pradesh', commodity: 'Green Peas', variety: 'Arkel Sweet Pods', modalPrice: 65, minPrice: 55, maxPrice: 75, dailyChange: 3.8, arrivalTons: 70 },
  { market: 'Eluru Fruit & Veg Yard', state: 'Andhra Pradesh', commodity: 'Cucumber', variety: 'Japanese Long Green', modalPrice: 20, minPrice: 15, maxPrice: 25, dailyChange: -0.4, arrivalTons: 105 },
  { market: 'Miryalaguda APMC', state: 'Telangana', commodity: 'Paddy / Rice', variety: 'BPT 5204 (Sona Masoori)', modalPrice: 43, minPrice: 39, maxPrice: 46, dailyChange: 1.5, arrivalTons: 320 },
  { market: 'Nuzvid Fruit Market Yard', state: 'Andhra Pradesh', commodity: 'Mango', variety: 'Banganapalli', modalPrice: 72, minPrice: 65, maxPrice: 80, dailyChange: 4.1, arrivalTons: 60 }
];

const HISTORICAL_AND_PREDICTIVE_PRICES = [
  { day: 'Sep 01', actualPrice: 24, aiForecast: 24 },
  { day: 'Sep 04', actualPrice: 25, aiForecast: 25 },
  { day: 'Sep 08', actualPrice: 27, aiForecast: 27 },
  { day: 'Sep 11', actualPrice: 28, aiForecast: 28 },
  { day: 'Sep 14 (Today)', actualPrice: 29, aiForecast: 29 },
  { day: 'Sep 18', actualPrice: null, aiForecast: 31, upperConfidence: 33, lowerConfidence: 29 },
  { day: 'Sep 22', actualPrice: null, aiForecast: 34, upperConfidence: 37, lowerConfidence: 31 },
  { day: 'Sep 26', actualPrice: null, aiForecast: 36, upperConfidence: 40, lowerConfidence: 33 },
  { day: 'Oct 02', actualPrice: null, aiForecast: 38, upperConfidence: 42, lowerConfidence: 34 },
];

export const MandiLivePricesPage: React.FC = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('Tomato');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MANDI_DATA.filter(m => 
    m.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Agmarknet & APMC Live Exchange Stream
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            National Mandi Prices & AI 14-Day Forward Forecast
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Live commodity price discovery across Indian wholesale market yards with machine learning harvest timing predictions
          </p>
        </div>
      </div>

      {/* 14-Day Price Forecast Chart */}
      <Card className="p-6 border-slate-200 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                14-Day AI Price Trajectory Forecast for {selectedCommodity} (₹/kg)
              </h3>
              <Badge variant="purple" size="sm">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> ML Forecast +31% Upward
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical actual prices (solid green) vs. forward neural network projections with 90% confidence bounds
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {['Tomato', 'Green Chilli', 'Paddy / Rice', 'Mango'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCommodity(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCommodity === c
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HISTORICAL_AND_PREDICTIVE_PRICES} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} unit=" ₹" domain={[15, 45]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px'
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="actualPrice" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Mandi Price (₹/kg)" connectNulls={false} />
              <Area type="monotone" dataKey="aiForecast" stroke="#7c3aed" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" name="AI Forecasted Price (₹/kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insight Box */}
        <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-purple-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div>
              <span className="font-bold block">AI Harvest Profit Timing Advisory:</span>
              <span>Wholesale market prices for {selectedCommodity} are forecasted to rise from ₹29 to ₹36-38/kg by late September due to inter-state festival demand.</span>
            </div>
          </div>
          <Badge variant="emerald" size="lg" className="whitespace-nowrap">
            Optimal Sell Window: Sep 24 - Oct 02
          </Badge>
        </div>
      </Card>

      {/* Live APMC Mandi Ticker Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Live Market Yard Rates (Today's Trades)
          </h3>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search market yard, commodity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, idx) => (
            <Card key={idx} hover className="p-5 border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{item.commodity}</span>
                  <span className="text-[11px] text-slate-500">{item.variety}</span>
                </div>
                <div className={`flex items-center text-xs font-bold ${item.dailyChange >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {item.dailyChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{item.dailyChange > 0 ? `+${item.dailyChange}` : item.dailyChange}%</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Modal Trade Price</span>
                  <span className="text-xl font-black text-slate-900">₹{item.modalPrice} <span className="text-xs font-normal text-slate-500">/ kg</span></span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span>Range: ₹{item.minPrice} - ₹{item.maxPrice}</span>
                  <span className="block text-slate-400">Daily Arrivals: {item.arrivalTons} Tons</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                <span>{item.market}</span>
                <Badge variant="slate" size="sm">{item.state}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};
