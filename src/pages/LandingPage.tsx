import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  ShoppingCart, 
  TrendingUp, 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Users, 
  Coins, 
  Clock, 
  Award,
  ChevronRight,
  Eye,
  CloudSun,
  FlaskConical,
  FileText
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const { switchRole } = useAuth();
  const { crops, buyerRequirements } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleRoleQuickStart = (role: 'farmer' | 'buyer' | 'investor') => {
    switchRole(role);
    if (role === 'farmer') navigate('/farmer');
    else if (role === 'buyer') navigate('/buyer/marketplace');
    else if (role === 'investor') navigate('/sponsor/projects');
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-800 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 hero-gradient">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-400/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* SIH Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Smart India Hackathon 2026 Prototype</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 font-medium">{t('hero.badge', 'Digital Agriculture Innovation')}</span>
            </div>

            {/* Main Title & Subtitle */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {t('brand.name', 'FarmSync AI')}
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-slate-700 mt-4">
              "{t('hero.title', 'Connect. Grow. Sell. Smarter.')}"
            </p>
            <p className="text-base sm:text-lg text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle', 'An AI-powered agricultural marketplace connecting farmers directly with buyers, sponsors, and logistics providers without exploitative middlemen.')}
            </p>

            {/* 2 Primary App Launch Hub */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              
              {/* Farmer App Launch Card */}
              <div
                onClick={() => handleRoleQuickStart('farmer')}
                className="p-5 rounded-2xl bg-white/95 hover:bg-emerald-50/80 border-2 border-emerald-500/80 hover:border-emerald-600 shadow-lg shadow-emerald-500/10 cursor-pointer transition-all text-left flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                  <Sprout className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                      🌾 Launch Farmer App
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                      KisanSetu
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    AI Crop Doctor, Soil NPK, Agro-Weather & Direct Farmgate Sales.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:underline">
                    <span>Enter Farmer Portal (Ravi Kumar)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Buyer App Launch Card */}
              <div
                onClick={() => handleRoleQuickStart('buyer')}
                className="p-5 rounded-2xl bg-white/95 hover:bg-blue-50/80 border-2 border-blue-500/80 hover:border-blue-600 shadow-lg shadow-blue-500/10 cursor-pointer transition-all text-left flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/30 group-hover:scale-110 transition-transform">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-slate-900 group-hover:text-blue-800 transition-colors">
                      🛒 Launch Buyer App
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase">
                      QuickMart & Bulk
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    15-min Hyperlocal Dark Stores, Wholesale Mandi & Smart Escrow.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:underline">
                    <span>Enter Buyer Portal (FreshMart)</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

            </div>

            {/* Ecosystem Secondary Quick Links */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-500">
              <span className="text-slate-400 font-normal">Also explore:</span>
              <button
                type="button"
                onClick={() => handleRoleQuickStart('investor')}
                className="text-amber-700 hover:text-amber-800 hover:underline font-bold flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                <span>Sponsor & Grants Portal</span>
              </button>
              <Link
                to="/dark-stores"
                className="text-indigo-700 hover:text-indigo-800 hover:underline font-bold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 transition-colors"
              >
                <span>⚡ 15-min Dark Store Network</span>
              </Link>
              <Link
                to="/trace"
                className="text-emerald-700 hover:text-emerald-800 hover:underline font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Batch Provenance Passport</span>
              </Link>
            </div>

            {/* Quick Live Stats Ticker */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl font-black text-emerald-700">{crops.length} Active</span>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  {t('stats.crops', 'Active Verified Listings')}
                </span>
              </div>
              <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl font-black text-blue-700">{buyerRequirements.length} Demands</span>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  {t('stats.demands', 'Live Buyer Inquiries')}
                </span>
              </div>
              <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl font-black text-amber-600">5-Factor</span>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  {t('stats.matching', 'Transparent AI Matching')}
                </span>
              </div>
              <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-2xl font-black text-slate-800">100% Free</span>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  {t('stats.support', 'CSR Grant Support Model')}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.5 TWO DEDICATED APPS SHOWCASE */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 mb-2">
              <span>Dual-App Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Two Dedicated Apps. One Shared Agricultural Engine.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Whether you are a grower in the field or an institutional buyer in the city, experience a tailored portal optimized for your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* APP 1: FARMER APP */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-emerald-500/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">App 01</span>
                      <h3 className="text-2xl font-black text-white">🌾 KisanSetu (Farmer App)</h3>
                    </div>
                  </div>
                  <Badge variant="emerald" size="sm">For Cultivators & FPOs</Badge>
                </div>

                <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mb-6">
                  Tailored specifically for growers and cooperatives. Manage crops, diagnose plant diseases via computer vision, compute soil fertilizer dosages, and secure advance capital.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { label: 'AI Crop Doctor', desc: 'Instant leaf pest diagnosis' },
                    { label: 'Soil NPK Calculator', desc: 'Custom fertilizer dosing' },
                    { label: 'Agro-Weather Radar', desc: '7-day satellite spray window' },
                    { label: 'SmartGrade AI', desc: 'CV quality certification' },
                    { label: 'Forward Contracts', desc: 'Guaranteed MSP+ off-take' },
                    { label: 'Direct Bank Settlement', desc: 'Instant UPI payout ledger' },
                  ].map((feat, i) => (
                    <div key={i} className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/20 text-xs">
                      <span className="font-bold text-emerald-300 block">{feat.label}</span>
                      <span className="text-[11px] text-slate-300 mt-0.5 block">{feat.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-800/60 flex items-center justify-between">
                <span className="text-xs text-emerald-300">Default Demo: <strong>Ravi Kumar (Verified)</strong></span>
                <button
                  onClick={() => handleRoleQuickStart('farmer')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <span>Launch Farmer App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* APP 2: BUYER APP */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-blue-500/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">App 02</span>
                      <h3 className="text-2xl font-black text-white">🛒 FarmSync Market (Buyer App)</h3>
                    </div>
                  </div>
                  <Badge variant="blue" size="sm">Consumers & Supermarkets</Badge>
                </div>

                <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed mb-6">
                  Tailored for household daily produce needs and institutional procurement. Features 15-minute Hyperlocal Dark Stores, bulk farmgate mandi lots, and escrow fund protection.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { label: '⚡ 15m QuickMart', desc: 'Hyperlocal Dark Store hubs' },
                    { label: 'Mandi Wholesale Lots', desc: 'Bulk commercial procurement' },
                    { label: 'Batch Traceability', desc: 'QR farm-to-fork passport' },
                    { label: 'Smart Escrow Gateway', desc: '100% fraud-proof settlement' },
                    { label: 'Live Delivery Radar', desc: 'GPS & IoT cold-chain tracking' },
                    { label: 'Demand Forecasting', desc: 'Price trend & supply analytics' },
                  ].map((feat, i) => (
                    <div key={i} className="p-3 rounded-xl bg-blue-900/40 border border-blue-500/20 text-xs">
                      <span className="font-bold text-blue-300 block">{feat.label}</span>
                      <span className="text-[11px] text-slate-300 mt-0.5 block">{feat.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-blue-800/60 flex items-center justify-between">
                <span className="text-xs text-blue-300">Default Demo: <strong>FreshMart (APMC)</strong></span>
                <button
                  onClick={() => handleRoleQuickStart('buyer')}
                  className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
                >
                  <span>Launch Buyer App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="emerald" size="md">{t('howItWorks.badge', 'Step-by-Step Ecosystem')}</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{t('howItWorks.title', 'How It Works')}</h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {t('howItWorks.subtitle', 'From pre-sowing soil health check to instant post-delivery payout')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: t('howItWorks.step1.title', 'Farmer Lists Crop'),
              desc: t('howItWorks.step1.desc', 'Farmer inputs crop variety, expected harvest date, geo-location, and soil health report.'),
              icon: Sprout,
              color: 'text-emerald-700',
              bg: 'bg-emerald-100/70'
            },
            {
              step: '02',
              title: t('howItWorks.step2.title', 'AI Match & Quality Grading'),
              desc: t('howItWorks.step2.desc', '5-factor AI ranking algorithm pairs listings with institutional buyers and produces digital quality certificates.'),
              icon: Sparkles,
              color: 'text-purple-600',
              bg: 'bg-purple-50'
            },
            {
              step: '03',
              title: t('howItWorks.step3.title', 'Smart Escrow Vault'),
              desc: t('howItWorks.step3.desc', 'Buyer funds are locked in RBI-compliant escrow vault before harvest dispatch to guarantee 100% payout security.'),
              icon: Coins,
              color: 'text-amber-600',
              bg: 'bg-amber-50'
            },
            {
              step: '04',
              title: t('howItWorks.step4.title', 'Dispatched & Settled'),
              desc: t('howItWorks.step4.desc', 'IoT cold-chain telemetry monitors transit and triggers instant automated UPI disbursement upon OTP verification.'),
              icon: Truck,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} hover className="p-6 relative group border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-200 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 2.25 KNOW WHERE YOUR CROP COMES FROM - PROVENANCE & TRACEABILITY */}
      <section className="py-16 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden border-y border-slate-800">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Digital Crop Provenance & Fair-Trade Trust Protocol
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Know Where Your Crop Comes From
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every crop lot is assigned an immutable digital batch identity. We separate authentic direct farmers, verified FPO cooperatives, and licensed vendors to eliminate counterfeiting and guarantee fair farmgate realization.
            </p>
          </div>

          {/* 6-Step Visual Provenance Diagram */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Farm-to-Fork Digital Chain of Custody
                </h3>
                <p className="text-xs text-slate-400">
                  Every step is cryptographically recorded with timestamps, geolocation, and verified stakeholder identities.
                </p>
              </div>
              <Link
                to="/trace/FS-TOM-2026-00124"
                className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                <span>Live Batch Explorer</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {[
                {
                  step: '01',
                  role: '✓ VERIFIED FARMER',
                  label: 'Land & ID Audit',
                  desc: 'Aadhaar masked & 7/12 Land Title verified.',
                  icon: Users,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10 border-emerald-500/30'
                },
                {
                  step: '02',
                  role: '🌱 FARM ORIGIN',
                  label: 'Field Cultivation',
                  desc: 'Geo-tagged coordinates & soil health report.',
                  icon: Sprout,
                  color: 'text-teal-400',
                  bg: 'bg-teal-500/10 border-teal-500/30'
                },
                {
                  step: '03',
                  role: '🏷️ CROP BATCH',
                  label: 'Lot ID Generation',
                  desc: 'Unique Batch ID (e.g., FS-TOM-2026-00124).',
                  icon: Award,
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/10 border-blue-500/30'
                },
                {
                  step: '04',
                  role: '📦 HARVEST & GRADE',
                  label: 'Smart AI Grading',
                  desc: 'Computer vision quality certificate Grade A/B.',
                  icon: CheckCircle2,
                  color: 'text-purple-400',
                  bg: 'bg-purple-500/10 border-purple-500/30'
                },
                {
                  step: '05',
                  role: '🚚 COLD LOGISTICS',
                  label: 'Transit Telemetry',
                  desc: 'GPS tracker & IoT reefer freshness monitoring.',
                  icon: Truck,
                  color: 'text-amber-400',
                  bg: 'bg-amber-500/10 border-amber-500/30'
                },
                {
                  step: '06',
                  role: '🛒 BUYER RECEIPT',
                  label: 'Fair Settlement',
                  desc: 'Instant UPI payout & price transparency breakdown.',
                  icon: Coins,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/10 border-emerald-500/30'
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className={`p-4 rounded-2xl border ${item.bg} flex flex-col justify-between space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{item.step}</span>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-300 block tracking-wider uppercase">
                        {item.role}
                      </span>
                      <h4 className="text-xs font-bold text-white mt-0.5">{item.label}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Batch ID Search Box */}
            <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                <span className="text-slate-200 font-semibold block">Have a FarmSync QR code or Batch ID?</span>
                <span>Enter it below to test our public digital verification passport.</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Link
                  to="/trace/FS-TOM-2026-00124"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg border border-slate-700 transition-colors"
                >
                  FS-TOM-2026-00124 (Farmer Direct)
                </Link>
                <Link
                  to="/trace/FS-MNG-2026-00033"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-mono rounded-lg border border-slate-700 transition-colors"
                >
                  FS-MNG-2026-00033 (FPO Collective)
                </Link>
                <Link
                  to="/trace/FS-TOM-2026-00199-RESALE"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono rounded-lg border border-slate-700 transition-colors"
                >
                  FS-TOM-2026-00199-RESALE (Vendor Resale)
                </Link>
              </div>
            </div>
          </div>

          {/* 3 Role Clarity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                ✓ VERIFIED FARMER DIRECT
              </div>
              <h4 className="text-base font-bold text-white">Genuine Land Cultivators</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Registered growers with verified land ownership records (7/12 Patta). 100% of the listed farmgate price flows straight into the grower's verified bank account.
              </p>
              <div className="pt-2 text-[11px] text-emerald-400 font-medium">
                Realization Rate: 84%–92% of Final Retail Price
              </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                ✓ VERIFIED FPO COLLECTIVE
              </div>
              <h4 className="text-base font-bold text-white">Cooperative Farmer Collectives</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Registered Farmer Producer Organizations pooling produce from 300+ smallholder cultivators for bulk commercial grading, cold storage, and export contracts.
              </p>
              <div className="pt-2 text-[11px] text-blue-400 font-medium">
                Bulk Volume Discounts + Standardized Grading
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                ✓ VERIFIED VENDOR (Resale Listing)
              </div>
              <h4 className="text-base font-bold text-white">Licensed Aggregators & Traders</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Traders with GSTIN and APMC licenses. Clearly labeled as "Resale Listing" with linked original grower provenance and visible value-addition margins.
              </p>
              <div className="pt-2 text-[11px] text-amber-400 font-medium">
                Full Price Transparency + Zero Disguised Middlemen
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2.5 SMART AGRI-TECH INTELLIGENCE SUITE */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> {t('modules.badge', 'Advanced Agri-Tech Capabilities')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {t('modules.title', 'Next-Gen Intelligent Agricultural Stack')}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              {t('modules.subtitle', 'Comprehensive cutting-edge toolset empowering farmers, buyers, and logistics operators.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: t('module.weather.title', 'Agro-Weather & Disaster Guard'),
                desc: t('module.weather.desc', '7-day satellite forecast with precision spraying windows, extreme flood/heatwave alerts, and crop protection advisories.'),
                path: '/weather',
                badge: 'IMD Connected',
                icon: CloudSun,
                color: 'from-amber-500/20 to-emerald-500/20 text-amber-300 border-amber-500/30'
              },
              {
                title: t('module.soil.title', 'AI Soil Health & Smart Fertilizer Dosage'),
                desc: t('module.soil.desc', 'NPK test analyzer and custom fertilizer calculator computing exact chemical vs organic bio-input dosages.'),
                path: '/farmer/soil-health',
                badge: 'Cost Optimizer',
                icon: FlaskConical,
                color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30'
              },
              {
                title: t('module.grading.title', 'SmartGrade AI - Produce Quality Grading'),
                desc: t('module.grading.desc', 'Computer vision scanner for crop sizing, color uniformity, defect detection, and cryptographic digital certificates.'),
                path: '/grading',
                badge: 'Computer Vision',
                icon: Award,
                color: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30'
              },
              {
                title: t('module.contract.title', 'Institutional Forward Contract Farming'),
                desc: t('module.contract.desc', 'Pre-harvest guaranteed buyback agreements with FMCG corporate buyers (ITC, PepsiCo) offering MSP+ bonuses.'),
                path: '/contract-farming',
                badge: 'Guaranteed Off-Take',
                icon: FileText,
                color: 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30'
              },
              {
                title: t('module.schemes.title', 'National Schemes & Subsidy Navigator'),
                desc: t('module.schemes.desc', 'Directory of PM-KISAN, PMFBY, AIF, and Solar Pump subsidies with instant 3-question eligibility finder quiz.'),
                path: '/schemes',
                badge: 'DBT Direct Aid',
                icon: ShieldCheck,
                color: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30'
              },
              {
                title: t('module.escrow.title', 'Smart Escrow & Milestone Gateway'),
                desc: t('module.escrow.desc', 'RBI-compliant fund lock-in with stage-by-stage payouts triggered by verified harvest, transit GPS, and delivery OTP.'),
                path: '/escrow',
                badge: 'Zero Fraud',
                icon: Coins,
                color: 'from-amber-500/20 to-rose-500/20 text-amber-300 border-amber-500/30'
              },
              {
                title: t('module.coldChain.title', 'Cold-Chain IoT & Perishable Freshness Radar'),
                desc: t('module.coldChain.desc', 'Real-time reefer sensors for temperature, humidity, and ethylene gas tracking with automated cooling boost.'),
                path: '/logistics/cold-chain',
                badge: 'IoT Sensors',
                icon: Truck,
                color: 'from-indigo-500/20 to-cyan-500/20 text-indigo-300 border-indigo-500/30'
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={i}
                  to={feature.path}
                  className="p-6 rounded-3xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.color} border`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="emerald" size="sm">{feature.badge}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                    <span>{t('action.launch', 'Launch Module')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FARMER TYPES (Self-Funded, Funded, Free-Support) */}
      <section id="farmer-types" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="emerald" size="md">{t('supportModels.badge', '3 Fair Pathways for Every Farmer')}</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {t('supportModels.title', 'Inclusive Agricultural Financing')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Self-Funded */}
          <Card hover className="p-6 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="slate" size="md">{t('supportModels.selfFunded.badge', 'Direct Open Market')}</Badge>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Sprout className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{t('supportModels.selfFunded.title', 'Self-Funded')}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                {t('supportModels.selfFunded.desc', 'Independent commercial growers sell directly to verified wholesale buyers at market-determined or forward locked prices.')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { switchRole('farmer'); navigate('/farmer/crops/new'); }}
              >
                {t('nav.myCrops', 'My Crops')}
              </Button>
            </div>
          </Card>

          {/* Card 2: Funded */}
          <Card hover className="p-6 border-emerald-300 ring-2 ring-emerald-500/20 shadow-md flex flex-col justify-between bg-gradient-to-b from-white to-emerald-50/20">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="emerald" size="md">{t('supportModels.funded.badge', 'Pre-Harvest Working Capital')}</Badge>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{t('supportModels.funded.title', 'Funded (Advance Capital)')}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                {t('supportModels.funded.desc', 'Verified agri-investors and institutional buyers provide low-interest working capital advances for seeds, fertilizers, and equipment.')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-100">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => { switchRole('investor'); navigate('/sponsor/projects'); }}
              >
                {t('action.apply', 'Apply / Explore')}
              </Button>
            </div>
          </Card>

          {/* Card 3: Free-Support */}
          <Card hover className="p-6 border-amber-300 ring-2 ring-amber-500/20 shadow-md flex flex-col justify-between bg-gradient-to-b from-white to-amber-50/20">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="amber" size="md">{t('supportModels.freeSupport.badge', 'Non-Repayable CSR Grant')}</Badge>
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{t('supportModels.freeSupport.title', 'Free-Support')}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                {t('supportModels.freeSupport.desc', 'Eligible smallholder and marginal farmers receive 100% non-repayable agricultural grants sponsored by CSR trusts and NGOs. Zero debt obligation.')}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-100">
              <Button
                variant="harvest"
                className="w-full"
                onClick={() => { switchRole('farmer'); navigate('/farmer/support'); }}
              >
                {t('action.apply', 'Apply for Support')}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              {t('cta.ready', 'Ready to transform agriculture?')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              {t('cta.title', 'Experience FarmSync AI Live')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
              {t('cta.desc', 'Join thousands of progressive farmers, wholesale buyers, and agribusinesses powering transparent, AI-driven agricultural commerce.')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link to="/buyer/marketplace">
              <Button variant="harvest" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {t('cta.exploreMarketplace', 'Explore Live Marketplace')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
