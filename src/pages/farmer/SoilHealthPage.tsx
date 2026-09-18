import React, { useState } from 'react';
import { 
  FlaskConical, 
  Leaf, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Save, 
  Layers, 
  Award,
  HelpCircle
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { SoilHealthCard } from '../../types';

export const SoilHealthPage: React.FC = () => {
  const { soilCards, addSoilHealthCard } = useData();
  const { currentUser } = useAuth();

  const [selectedCardId, setSelectedCardId] = useState<string>(soilCards[0]?.id || '');
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [acreage, setAcreage] = useState<number>(2.5);
  const [targetYield, setTargetYield] = useState<number>(18); // tons/acre
  const [activeTab, setActiveTab] = useState<'CARD' | 'CALCULATOR' | 'NEW_TEST'>('CARD');

  // New Test Form State
  const [newFarmName, setNewFarmName] = useState('Green Valley - North Plot');
  const [newSoilType, setNewSoilType] = useState<SoilHealthCard['soilType']>('Red Sandy Loam');
  const [newPh, setNewPh] = useState(6.7);
  const [newEC, setNewEC] = useState(0.48);
  const [newOC, setNewOC] = useState(0.65);
  const [newN, setNewN] = useState(250);
  const [newP, setNewP] = useState(35);
  const [newK, setNewK] = useState(320);
  const [newZn, setNewZn] = useState(0.65);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCard = soilCards.find(c => c.id === selectedCardId) || soilCards[0];

  // Smart Fertilizer Calculation Logic based on Crop & Acreage & Soil Test
  const calculateFertilizerRecommendations = () => {
    let baseUreaPerAcre = 45;
    let baseDapPerAcre = 35;
    let baseMopPerAcre = 25;
    let baseZincPerAcre = 5;

    if (selectedCrop === 'Tomato') {
      baseUreaPerAcre = 60; baseDapPerAcre = 50; baseMopPerAcre = 40; baseZincPerAcre = 8;
    } else if (selectedCrop === 'Paddy / Rice') {
      baseUreaPerAcre = 55; baseDapPerAcre = 40; baseMopPerAcre = 30; baseZincPerAcre = 10;
    } else if (selectedCrop === 'Green Chilli') {
      baseUreaPerAcre = 65; baseDapPerAcre = 45; baseMopPerAcre = 45; baseZincPerAcre = 6;
    } else if (selectedCrop === 'Cotton') {
      baseUreaPerAcre = 50; baseDapPerAcre = 35; baseMopPerAcre = 30; baseZincPerAcre = 8;
    }

    // Adjust for NPK status from card
    const nFactor = activeCard?.nitrogen.status === 'Deficient' ? 1.25 : 1.0;
    const pFactor = activeCard?.phosphorus.status === 'Deficient' ? 1.2 : 0.9;
    const kFactor = activeCard?.potassium.status === 'Excess' ? 0.6 : 1.0;

    const totalUrea = Math.round(baseUreaPerAcre * acreage * nFactor);
    const totalDap = Math.round(baseDapPerAcre * acreage * pFactor);
    const totalMop = Math.round(baseMopPerAcre * acreage * kFactor);
    const totalZinc = Math.round(baseZincPerAcre * acreage);

    // Chemical Costs (Urea ₹6/kg subsidized, DAP ₹27/kg, MOP ₹34/kg, Zinc ₹90/kg)
    const chemicalCost = (totalUrea * 6) + (totalDap * 27) + (totalMop * 34) + (totalZinc * 90);

    // Organic Alternatives
    const vermicompostKg = Math.round(acreage * 1200);
    const neemCakeKg = Math.round(acreage * 100);
    const bioFertilizerL = Math.round(acreage * 2.5);
    const organicCost = (vermicompostKg * 4.5) + (neemCakeKg * 22) + (bioFertilizerL * 180);
    const carbonSaved = Math.round(acreage * 340); // kg CO2e offset

    return {
      totalUrea,
      totalDap,
      totalMop,
      totalZinc,
      chemicalCost,
      vermicompostKg,
      neemCakeKg,
      bioFertilizerL,
      organicCost,
      carbonSaved
    };
  };

  const fert = calculateFertilizerRecommendations();

  const handleSaveNewTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const overallScore = Math.min(98, Math.max(50, Math.round(
      (newOC * 40) + 
      (newPh >= 6.5 && newPh <= 7.5 ? 30 : 15) + 
      (newN > 240 ? 15 : 8) + 
      (newP > 20 ? 15 : 8)
    )));

    const newCard: Omit<SoilHealthCard, 'id'> = {
      farmerId: currentUser?.id || 'farmer_ravi',
      farmName: newFarmName,
      sampleDate: new Date().toISOString().split('T')[0],
      soilType: newSoilType,
      phLevel: newPh,
      electricalConductivity: newEC,
      organicCarbonPercentage: newOC,
      overallHealthScore: overallScore,
      nitrogen: { name: 'Available Nitrogen (N)', value: newN, unit: 'kg/ha', benchmarkLow: 280, benchmarkHigh: 560, status: newN < 280 ? 'Deficient' : 'Sufficient' },
      phosphorus: { name: 'Available Phosphorus (P)', value: newP, unit: 'kg/ha', benchmarkLow: 23, benchmarkHigh: 56, status: newP < 23 ? 'Deficient' : 'Sufficient' },
      potassium: { name: 'Available Potassium (K)', value: newK, unit: 'kg/ha', benchmarkLow: 145, benchmarkHigh: 340, status: newK > 340 ? 'Excess' : 'Sufficient' },
      sulphur: { name: 'Available Sulphur (S)', value: 16.0, unit: 'ppm', benchmarkLow: 10.0, benchmarkHigh: 25.0, status: 'Sufficient' },
      zinc: { name: 'Available Zinc (Zn)', value: newZn, unit: 'ppm', benchmarkLow: 0.60, benchmarkHigh: 1.50, status: newZn < 0.60 ? 'Deficient' : 'Sufficient' },
      boron: { name: 'Available Boron (B)', value: 0.68, unit: 'ppm', benchmarkLow: 0.50, benchmarkHigh: 1.20, status: 'Sufficient' },
      recommendations: [
        `Soil health benchmarked at ${overallScore}/100. Maintain regular organic carbon additions.`,
        newN < 280 ? 'Nitrogen deficiency detected; schedule split top-dressing of urea.' : 'Nitrogen is well balanced.',
        newZn < 0.60 ? 'Zinc is deficient; apply 5 kg/acre Zinc Sulphate at planting.' : 'Zinc level adequate.'
      ]
    };

    const saved = await addSoilHealthCard(newCard);
    setIsSubmitting(false);
    setSelectedCardId(saved.id);
    setActiveTab('CARD');
  };

  const getNutrientStatusColor = (status: 'Deficient' | 'Sufficient' | 'Excess') => {
    switch (status) {
      case 'Deficient': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Sufficient': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Excess': return 'text-purple-700 bg-purple-50 border-purple-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Soil Health Card & Bio-Nutrient Optimizer
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              AI Soil Intelligence & Fertilizer Dosage
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Laboratory-accurate N-P-K nutrient analysis, organic bio-input dosages, and custom crop fertigation calculators designed to maximize yield and cut chemical fertilizer waste.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('CARD')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CARD' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-200 hover:text-white'
              }`}
            >
              Soil Health Card
            </button>
            <button
              onClick={() => setActiveTab('CALCULATOR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CALCULATOR' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-200 hover:text-white'
              }`}
            >
              Dosage Calculator
            </button>
            <button
              onClick={() => setActiveTab('NEW_TEST')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'NEW_TEST' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-200 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Enter Test Data
            </button>
          </div>
        </div>
      </div>

      {/* View Mode: Soil Health Card */}
      {activeTab === 'CARD' && activeCard && (
        <div className="space-y-6">
          
          {/* Card Selector & Overview Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Selected Field Report:</span>
                <select
                  value={selectedCardId}
                  onChange={(e) => setSelectedCardId(e.target.value)}
                  className="text-sm font-black text-slate-900 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {soilCards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.farmName} ({c.soilType}) - Test Date: {c.sampleDate}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="emerald" size="sm" className="font-bold text-xs py-1 px-3">
                <Award className="w-3.5 h-3.5 mr-1" /> Health Score: {activeCard.overallHealthScore} / 100
              </Badge>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setActiveTab('CALCULATOR')}
                className="text-xs"
              >
                Calculate Fertilizer Dosage
              </Button>
            </div>
          </div>

          {/* Primary Soil Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 bg-white border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Soil Reaction (pH)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900">{activeCard.phLevel}</span>
                <Badge variant={activeCard.phLevel >= 6.5 && activeCard.phLevel <= 7.5 ? 'emerald' : 'amber'} size="sm">
                  {activeCard.phLevel < 6.5 ? 'Slightly Acidic' : activeCard.phLevel > 7.5 ? 'Slightly Alkaline' : 'Ideal Neutral'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Optimal range: 6.5 - 7.5 for horticulture</p>
            </Card>

            <Card className="p-5 bg-white border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Electrical Cond. (EC)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900">{activeCard.electricalConductivity}</span>
                <span className="text-xs font-bold text-slate-500">dS/m</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-2">Normal salinity (&lt; 1.0 dS/m)</p>
            </Card>

            <Card className="p-5 bg-white border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Organic Carbon (OC)
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-slate-900">{activeCard.organicCarbonPercentage}%</span>
                <Badge variant={activeCard.organicCarbonPercentage >= 0.75 ? 'emerald' : 'amber'} size="sm">
                  {activeCard.organicCarbonPercentage >= 0.75 ? 'High' : 'Medium'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Target benchmark: &gt; 0.80%</p>
            </Card>

            <Card className="p-5 bg-white border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Soil Classification
              </span>
              <div className="text-xl font-black text-slate-900 truncate">
                {activeCard.soilType}
              </div>
              <p className="text-[11px] text-slate-500 mt-3">Drainage: Moderate to High</p>
            </Card>
          </div>

          {/* Macro and Micro Nutrient Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Macronutrients */}
            <Card className="p-6 bg-white border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" /> Primary Macronutrients (N - P - K)
                </h3>
                <span className="text-xs font-bold text-slate-400">Available (kg/ha)</span>
              </div>

              <div className="space-y-4">
                {[activeCard.nitrogen, activeCard.phosphorus, activeCard.potassium].map((nut) => (
                  <div key={nut.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{nut.name}</p>
                        <span className="text-[10px] text-slate-400">Target Range: {nut.benchmarkLow} - {nut.benchmarkHigh} {nut.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">{nut.value} {nut.unit}</span>
                        <span className={`block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${getNutrientStatusColor(nut.status)}`}>
                          {nut.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          nut.status === 'Deficient' ? 'bg-amber-500' : nut.status === 'Excess' ? 'bg-purple-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (nut.value / nut.benchmarkHigh) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Micronutrients */}
            <Card className="p-6 bg-white border-slate-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-teal-600" /> Secondary & Micronutrients (S - Zn - B)
                </h3>
                <span className="text-xs font-bold text-slate-400">Parts Per Million (ppm)</span>
              </div>

              <div className="space-y-4">
                {[activeCard.sulphur, activeCard.zinc, activeCard.boron].map((nut) => (
                  <div key={nut.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{nut.name}</p>
                        <span className="text-[10px] text-slate-400">Target: &gt; {nut.benchmarkLow} {nut.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">{nut.value} {nut.unit}</span>
                        <span className={`block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 ${getNutrientStatusColor(nut.status)}`}>
                          {nut.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          nut.status === 'Deficient' ? 'bg-amber-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${Math.min(100, (nut.value / nut.benchmarkHigh) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* AI Agronomist Action Items */}
          <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Certified Soil Restoration Recommendations
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeCard.recommendations.map((rec, i) => (
                <div key={i} className="p-3 bg-white/90 rounded-xl border border-emerald-200/80 text-xs text-slate-800 font-medium flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* View Mode: Fertilizer & Bio-Input Dosage Calculator */}
      {activeTab === 'CALCULATOR' && (
        <div className="space-y-6">
          <Card className="p-6 bg-white border-slate-200 shadow-md">
            <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" /> Fertilizer & Bio-Input Calculator
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Calculates precise dosage requirements tailored to your crop, acreage, and Soil Health Card test values.
            </p>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Crop
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
                >
                  {['Tomato', 'Green Chilli', 'Paddy / Rice', 'Cotton', 'Potato', 'Onion', 'Wheat', 'Maize'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Field Area (Acres): <span className="text-emerald-700">{acreage}</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={acreage}
                  onChange={(e) => setAcreage(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 mt-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Yield (Tons/Acre): <span className="text-emerald-700">{targetYield}</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={targetYield}
                  onChange={(e) => setTargetYield(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            {/* Side by Side Comparison: Chemical vs Organic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chemical Option */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Custom Chemical Fertigation Plan</h4>
                    <p className="text-[11px] text-slate-500">Based on soil N-P-K deficit adjustment</p>
                  </div>
                  <Badge variant="blue" size="sm">Standard</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">Neem-Coated Urea</span>
                    <span className="text-base font-black text-slate-900">{fert.totalUrea} kg</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">DAP (Di-Ammonium Phos.)</span>
                    <span className="text-base font-black text-slate-900">{fert.totalDap} kg</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">MOP (Muriate of Potash)</span>
                    <span className="text-base font-black text-slate-900">{fert.totalMop} kg</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">Zinc Sulphate (21%)</span>
                    <span className="text-base font-black text-slate-900">{fert.totalZinc} kg</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-100 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Estimated Total Input Cost:</span>
                  <span className="text-lg font-black text-slate-900">₹{fert.chemicalCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Organic Sustainable Alternative */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-600" /> Bio-Organic Sustainable Blend
                    </h4>
                    <p className="text-[11px] text-emerald-800">100% Residue-Free & Carbon Credited</p>
                  </div>
                  <Badge variant="emerald" size="sm">Eco-Premium</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block">Enriched Vermicompost</span>
                    <span className="text-base font-black text-slate-900">{fert.vermicompostKg} kg</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block">Cold-Pressed Neem Cake</span>
                    <span className="text-base font-black text-slate-900">{fert.neemCakeKg} kg</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block">Azotobacter + PSB Culture</span>
                    <span className="text-base font-black text-slate-900">{fert.bioFertilizerL} Litres</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100">
                    <span className="text-slate-500 block">CO₂ Emissions Offset</span>
                    <span className="text-base font-black text-emerald-700">+{fert.carbonSaved} kg</span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-100/70 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Organic Investment Value:</span>
                  <span className="text-lg font-black text-emerald-900">₹{fert.organicCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            {/* Split Application Timeline */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Recommended 3-Stage Fertigation Schedule
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">Stage 1: Basal Application (Day 0)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Apply 100% DAP + 50% MOP + 100% Zinc Sulphate and incorporate with primary tillage.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">Stage 2: Vegetative Boost (Day 25-30)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Apply 50% Urea split top-dress alongside light drip fertigation before flowering.
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">Stage 3: Fruit Fill (Day 50-60)</span>
                  <p className="text-slate-600 leading-relaxed">
                    Apply remaining 50% Urea + 50% MOP to enhance fruit sizing and brix sweetness.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* View Mode: Enter New Soil Test */}
      {activeTab === 'NEW_TEST' && (
        <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-white border-slate-200 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <FlaskConical className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Record New Soil Lab Report</h3>
              <p className="text-xs text-slate-500">Enter parameters from your laboratory test certificate</p>
            </div>
          </div>

          <form onSubmit={handleSaveNewTest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Farm / Plot Name
              </label>
              <input
                type="text"
                required
                value={newFarmName}
                onChange={(e) => setNewFarmName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Soil Type
                </label>
                <select
                  value={newSoilType}
                  onChange={(e) => setNewSoilType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                >
                  <option value="Alluvial Soil">Alluvial Soil</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Red Sandy Loam">Red Sandy Loam</option>
                  <option value="Laterite Soil">Laterite Soil</option>
                  <option value="Clay Loam">Clay Loam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  pH Level
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newPh}
                  onChange={(e) => setNewPh(parseFloat(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Electrical Cond. (dS/m)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newEC}
                  onChange={(e) => setNewEC(parseFloat(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Organic Carbon (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newOC}
                  onChange={(e) => setNewOC(parseFloat(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nitrogen (kg/ha)
                </label>
                <input
                  type="number"
                  required
                  value={newN}
                  onChange={(e) => setNewN(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phosphorus (kg/ha)
                </label>
                <input
                  type="number"
                  required
                  value={newP}
                  onChange={(e) => setNewP(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Potassium (kg/ha)
                </label>
                <input
                  type="number"
                  required
                  value={newK}
                  onChange={(e) => setNewK(parseInt(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
              isLoading={isSubmitting}
              rightIcon={<Save className="w-4 h-4" />}
            >
              Analyze & Generate Soil Health Card
            </Button>
          </form>
        </Card>
      )}

    </div>
  );
};
