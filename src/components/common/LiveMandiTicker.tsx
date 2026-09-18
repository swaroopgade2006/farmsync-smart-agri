import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Radio } from 'lucide-react';

export const LiveMandiTicker: React.FC = () => {
  const { t } = useLanguage();
  const tickerItems = [
    { commodity: 'Tomato (Arka Rakshak)', mandi: 'Vijayawada APMC', price: '₹29/kg', change: '+2.8%', up: true },
    { commodity: 'Green Chilli (Guntur Teja)', mandi: 'Guntur Market', price: '₹56/kg', change: '-1.2%', up: false },
    { commodity: 'Paddy (Sona Masoori)', mandi: 'Miryalaguda APMC', price: '₹43/kg', change: '+1.5%', up: true },
    { commodity: 'Banganapalli Mango', mandi: 'Nuzvid Yard', price: '₹72/kg', change: '+4.1%', up: true },
    { commodity: 'Capsicum (Green)', mandi: 'Azadpur APMC', price: '₹48/kg', change: '+3.2%', up: true },
    { commodity: 'Red Onion', mandi: 'Lasalgaon APMC', price: '₹24/kg', change: '-0.8%', up: false },
  ];

  return (
    <div className="bg-slate-900 text-slate-200 text-[11px] py-1.5 px-4 border-b border-slate-800 flex items-center overflow-hidden">
      <div className="flex items-center space-x-1.5 flex-shrink-0 mr-4 font-bold text-emerald-400">
        <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
        <span className="uppercase tracking-widest text-[10px]">
          {t('ticker.liveRates', 'APMC Live Mandi Ticker:')}
        </span>
      </div>

      <div className="flex items-center space-x-6 animate-fade-in overflow-x-auto whitespace-nowrap scrollbar-none">
        {tickerItems.map((item, idx) => (
          <Link
            key={idx}
            to="/mandi-prices"
            className="inline-flex items-center space-x-2 hover:text-white transition-colors flex-shrink-0"
          >
            <span className="font-semibold text-slate-300">{item.commodity}</span>
            <span className="text-slate-500 text-[10px]">({item.mandi})</span>
            <span className="font-bold text-white">{item.price}</span>
            <span className={`inline-flex items-center font-bold ${item.up ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {item.change}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
