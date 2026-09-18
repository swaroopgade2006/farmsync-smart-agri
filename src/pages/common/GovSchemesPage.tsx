import React, { useState } from 'react';
import { 
  Landmark, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  FileText, 
  DollarSign, 
  HelpCircle, 
  ChevronRight, 
  ShieldCheck, 
  Sun, 
  Tractor, 
  Leaf, 
  Award,
  Filter
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { GovernmentScheme } from '../../types';

export const GovSchemesPage: React.FC = () => {
  const { govSchemes } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // Quiz State
  const [landSize, setLandSize] = useState<'MARGINAL' | 'SMALL' | 'LARGE'>('SMALL');
  const [farmerCategory, setFarmerCategory] = useState<'GENERAL' | 'SC_ST' | 'WOMAN' | 'FPO'>('GENERAL');
  const [interestArea, setInterestArea] = useState<'SOLAR' | 'ORGANIC' | 'INSURANCE' | 'MACHINERY' | 'ALL'>('ALL');
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const categories = [
    'ALL',
    'Direct Financial Transfer',
    'Crop Insurance & Risk',
    'Solar & Irrigation',
    'Farm Mechanization',
    'Organic Farming',
    'Credit & Subsidies'
  ];

  const filteredSchemes = govSchemes.filter((s) => {
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.schemeCode.toLowerCase().includes(q) ||
      s.financialBenefit.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  const getCategoryIcon = (cat: GovernmentScheme['category']) => {
    switch (cat) {
      case 'Solar & Irrigation': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Farm Mechanization': return <Tractor className="w-5 h-5 text-blue-500" />;
      case 'Organic Farming': return <Leaf className="w-5 h-5 text-emerald-500" />;
      case 'Crop Insurance & Risk': return <ShieldCheck className="w-5 h-5 text-purple-500" />;
      default: return <Landmark className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> DBT & National Subsidy Intelligence Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Government Schemes & Subsidies
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Explore Central and State agricultural assistance programs, PM-KISAN direct cash transfers, solar pump capital grants, and drone subsidies with 1-click eligibility calculation.
            </p>
          </div>

          <Button
            size="lg"
            variant="primary"
            onClick={() => setShowQuiz(!showQuiz)}
            className="text-xs font-bold bg-emerald-500 hover:bg-emerald-600 shadow-lg text-slate-950"
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {showQuiz ? 'Close Eligibility Finder' : 'Check My Scheme Eligibility'}
          </Button>
        </div>
      </div>

      {/* Interactive AI Eligibility Finder Quiz */}
      {showQuiz && (
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-md animate-fade-in">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-black text-slate-900">
                AI Agricultural Subsidy Eligibility Calculator
              </h2>
              <p className="text-xs text-slate-600">
                Answer 3 quick questions to discover tailored government financial incentives for your farm.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              
              {/* Question 1 */}
              <div className="p-4 bg-white rounded-2xl border border-emerald-200 space-y-2">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">
                  1. Landholding Size
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'MARGINAL' as const, label: 'Marginal (< 2.5 Acres)' },
                    { id: 'SMALL' as const, label: 'Small (2.5 - 5 Acres)' },
                    { id: 'LARGE' as const, label: 'Medium / Large (> 5 Acres)' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLandSize(opt.id)}
                      className={`w-full p-2 rounded-xl text-left font-medium transition-all ${
                        landSize === opt.id ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-4 bg-white rounded-2xl border border-emerald-200 space-y-2">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">
                  2. Beneficiary Group
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'GENERAL' as const, label: 'General Individual Farmer' },
                    { id: 'WOMAN' as const, label: 'Woman Headed Farm (+10% Bonus)' },
                    { id: 'SC_ST' as const, label: 'SC / ST Category (Max Subsidy)' },
                    { id: 'FPO' as const, label: 'FPO / Primary Agri Cooperative' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFarmerCategory(opt.id)}
                      className={`w-full p-2 rounded-xl text-left font-medium transition-all ${
                        farmerCategory === opt.id ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="p-4 bg-white rounded-2xl border border-emerald-200 space-y-2">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">
                  3. Technology / Focus Area
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'ALL' as const, label: 'All General Agri Schemes' },
                    { id: 'SOLAR' as const, label: 'Solar Water Pump (PM-KUSUM)' },
                    { id: 'MACHINERY' as const, label: 'Drone & Tractor Subsidy' },
                    { id: 'ORGANIC' as const, label: 'Organic Cluster (PKVY)' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setInterestArea(opt.id)}
                      className={`w-full p-2 rounded-xl text-left font-medium transition-all ${
                        interestArea === opt.id ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Results Calculation Box */}
            <div className="p-5 bg-white rounded-2xl border border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-black text-slate-900">
                    Calculated Qualification Summary
                  </span>
                </div>
                <Badge variant="emerald" size="sm" className="font-bold">
                  Matched 5 National Schemes
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <span className="text-slate-500 block">Direct DBT Entitlement</span>
                  <span className="text-base font-black text-slate-900">₹6,000 / Year</span>
                  <span className="text-[10px] text-emerald-700 block">PM-KISAN Assured</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <span className="text-slate-500 block">Solar Pump Subsidy Potential</span>
                  <span className="text-base font-black text-emerald-700">Up to 60%</span>
                  <span className="text-[10px] text-emerald-700 block">Saves ~₹1.80 Lakh capital</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <span className="text-slate-500 block">Machinery / Drone Aid</span>
                  <span className="text-base font-black text-slate-900">50% Capital Grant</span>
                  <span className="text-[10px] text-emerald-700 block">SMAM Custom Hiring</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search scheme name, ministry, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card
            key={scheme.id}
            className="p-6 bg-white border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex-shrink-0">
                    {getCategoryIcon(scheme.category)}
                  </div>
                  <div>
                    <Badge variant="blue" size="sm" className="font-bold mb-1">
                      {scheme.schemeCode}
                    </Badge>
                    <h2 className="text-base font-black text-slate-900 leading-snug">
                      {scheme.title}
                    </h2>
                  </div>
                </div>
                <Badge variant={scheme.status === 'ACTIVE' ? 'emerald' : 'amber'} size="sm">
                  {scheme.status}
                </Badge>
              </div>

              {/* Ministry */}
              <p className="text-[11px] text-slate-400 font-medium">
                {scheme.ministry}
              </p>

              {/* Benefit Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                  Financial Benefit & Subsidy:
                </span>
                <p className="text-xs text-emerald-950 font-bold leading-relaxed">
                  {scheme.financialBenefit}
                </p>
              </div>

              {/* Eligibility Highlights */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Who Can Apply:
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {scheme.eligibilityCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Required Documents:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.requiredDocuments.map((doc, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 px-2.5 py-0.5 rounded-lg text-slate-700 font-medium">
                      📄 {doc}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Mode: {scheme.applicationMode}
              </span>
              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Official Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
