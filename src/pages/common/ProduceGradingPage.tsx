import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  Eye, 
  Award, 
  QrCode, 
  Clock, 
  FileText, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ProduceQualityInspection } from '../../types';

export const ProduceGradingPage: React.FC = () => {
  const { qualityInspections, addQualityInspection } = useData();
  const { currentUser } = useAuth();

  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [selectedVariety, setSelectedVariety] = useState<string>('Arka Rakshak (High Lycopene)');
  const [batchNo, setBatchNo] = useState<string>('LOT-TOM-2026-092');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeCertificate, setActiveCertificate] = useState<ProduceQualityInspection | null>(
    qualityInspections[0] || null
  );

  const samplePresets = [
    {
      name: 'Tomato (Grade A Export)',
      crop: 'Tomato',
      variety: 'Arka Rakshak',
      batch: 'LOT-TOM-2026-092',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      grade: 'Grade A (Export / Premium)' as const,
      score: 95,
      shelfLife: 15,
      temp: '10°C - 12°C',
      diameter: 64.0,
      color: 97,
      moisture: 93.5,
      defects: [{ defectName: 'Minor Surface Speck', severityPercentage: 1.0, affectedAreaPercentage: 0.5, isAcceptable: true }]
    },
    {
      name: 'Green Chilli (Grade A Hot)',
      crop: 'Green Chilli',
      variety: 'Guntur Teja',
      batch: 'LOT-CHL-2026-041',
      image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
      grade: 'Grade A (Export / Premium)' as const,
      score: 93,
      shelfLife: 18,
      temp: '7°C - 9°C',
      diameter: 10.2,
      color: 95,
      moisture: 82.0,
      defects: [{ defectName: 'Stem dry edge', severityPercentage: 1.2, affectedAreaPercentage: 0.8, isAcceptable: true }]
    },
    {
      name: 'Red Onion (Grade B Standard)',
      crop: 'Red Onion',
      variety: 'Nashik N-53 Red',
      batch: 'LOT-ONN-2026-140',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
      grade: 'Grade B (Standard Wholesale)' as const,
      score: 84,
      shelfLife: 30,
      temp: 'Ambient / 20°C',
      diameter: 56.0,
      color: 88,
      moisture: 85.0,
      defects: [{ defectName: 'Dry husk detachment', severityPercentage: 3.8, affectedAreaPercentage: 2.5, isAcceptable: true }]
    }
  ];

  const [activePreset, setActivePreset] = useState(samplePresets[0]);

  const handleStartInspection = async () => {
    setIsAnalyzing(true);
    setTimeout(async () => {
      const newInsp: Omit<ProduceQualityInspection, 'id' | 'certificateHash'> = {
        cropName: activePreset.crop,
        variety: activePreset.variety,
        farmerId: currentUser?.id || 'farmer_ravi',
        farmerName: currentUser?.fullName || 'Ravi Kumar',
        batchNumber: `LOT-${activePreset.crop.substring(0,3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
        inspectionDate: new Date().toISOString().split('T')[0],
        grade: activePreset.grade,
        qualityScore: activePreset.score,
        sampleImageUrl: activePreset.image,
        metrics: {
          averageDiameterMm: activePreset.diameter,
          colorUniformityPercentage: activePreset.color,
          moistureContentPercentage: activePreset.moisture,
          brixSweetnessScore: activePreset.crop === 'Tomato' ? 5.6 : undefined,
          firmnessIndex: 9.0,
          surfaceBlemishesPercentage: 1.5
        },
        defectsDetected: activePreset.defects,
        estimatedShelfLifeDays: activePreset.shelfLife,
        recommendedStorageTempC: activePreset.temp,
        marketPriceMultiplier: activePreset.grade.includes('Grade A') ? 1.18 : 1.0
      };

      const result = await addQualityInspection(newInsp);
      setActiveCertificate(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 shadow-xl border border-indigo-800/40">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> SmartGrade AI Quality Grading & Certification
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Computer Vision Produce Quality Scanner
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Instant AI visual assessment of produce batches: grading size, color uniformity, defect index, and issuing verifiable cryptographic digital quality certificates.
          </p>
        </div>
      </div>

      {/* Main Interactive Scanner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Sample Upload / Selection & Live Scanner */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-white border-slate-200 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" /> Select Produce Sample
              </h2>
              <Badge variant="purple" size="sm">AI Vision V2.4</Badge>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Choose Inspection Sample
              </label>
              <div className="grid grid-cols-1 gap-2">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setActivePreset(preset);
                      setSelectedCrop(preset.crop);
                      setSelectedVariety(preset.variety);
                      setBatchNo(preset.batch);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      activePreset.name === preset.name
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <img src={preset.image} alt={preset.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div>
                        <span className="block font-bold">{preset.name}</span>
                        <span className="text-[10px] text-slate-400">{preset.variety}</span>
                      </div>
                    </div>
                    {activePreset.name === preset.name && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Viewport with Scanning Overlay */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-900 group">
              <img
                src={activePreset.image}
                alt="Produce Sample"
                className="w-full h-full object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 animate-pulse">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
                  <span className="text-xs font-bold tracking-wider uppercase">Running Computer Vision Model...</span>
                </div>
              )}
              {!isAnalyzing && (
                <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-emerald-300 font-bold border border-white/10">
                  Ready for Scanner
                </div>
              )}
            </div>

            <Button
              variant="primary"
              onClick={handleStartInspection}
              isLoading={isAnalyzing}
              className="w-full text-xs font-bold"
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Analyze Batch & Issue Certificate
            </Button>
          </Card>
        </div>

        {/* Right 7 Cols: Generated Certificate & Defect Analytics */}
        <div className="lg:col-span-7 space-y-6">
          {activeCertificate ? (
            <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-lg space-y-6 border-t-4 border-t-emerald-600">
              
              {/* Certificate Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      Official Quality Certificate
                    </span>
                    <Badge variant="emerald" size="sm">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> NABL Verified
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    {activeCertificate.cropName} ({activeCertificate.variety})
                  </h2>
                  <span className="text-xs text-slate-400">
                    Batch: {activeCertificate.batchNumber} • Inspected: {activeCertificate.inspectionDate}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-700">
                    {activeCertificate.qualityScore} <span className="text-sm text-slate-400">/ 100</span>
                  </div>
                  <Badge variant={activeCertificate.grade.includes('Grade A') ? 'emerald' : 'blue'} size="sm" className="font-bold">
                    {activeCertificate.grade}
                  </Badge>
                </div>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block">Average Sizing</span>
                  <span className="text-base font-black text-slate-900">{activeCertificate.metrics.averageDiameterMm} mm</span>
                  <span className="text-[10px] text-emerald-600 block">Optimal Uniformity</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block">Color Match</span>
                  <span className="text-base font-black text-slate-900">{activeCertificate.metrics.colorUniformityPercentage}%</span>
                  <span className="text-[10px] text-emerald-600 block">High Lycopene/Gloss</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block">Shelf Life</span>
                  <span className="text-base font-black text-slate-900">~{activeCertificate.estimatedShelfLifeDays} Days</span>
                  <span className="text-[10px] text-slate-500 block">At {activeCertificate.recommendedStorageTempC}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block">Value Premium</span>
                  <span className="text-base font-black text-emerald-700">+{Math.round((activeCertificate.marketPriceMultiplier - 1) * 100)}%</span>
                  <span className="text-[10px] text-emerald-600 block">Over Wholesale Base</span>
                </div>
              </div>

              {/* Defect Log */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Defect & Tolerance Analysis
                </span>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
                  {activeCertificate.defectsDetected.map((d, idx) => (
                    <div key={idx} className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {d.defectName}
                      </span>
                      <span className="font-bold text-slate-900">
                        {d.severityPercentage}% Severity ({d.affectedAreaPercentage}% Area) - <span className="text-emerald-600">Passed</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Hash & Verification Footer */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                    Digital Verification Hash
                  </span>
                  <code className="text-xs font-mono text-slate-300 break-all">
                    {activeCertificate.certificateHash}
                  </code>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-900">
                    <QrCode className="w-6 h-6" />
                  </div>
                </div>
              </div>

            </Card>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-2xl border border-dashed border-slate-300">
              Select a sample and run the AI scanner to generate quality inspection results.
            </div>
          )}
        </div>

      </div>

      {/* Historical Certificate Register */}
      <Card className="p-6 bg-white border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Issued Quality Certificates Archive</h2>
            <p className="text-xs text-slate-500">Search and download certified batch reports</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3">Batch Number</th>
                <th className="pb-3">Crop & Variety</th>
                <th className="pb-3">Farmer</th>
                <th className="pb-3">Inspection Date</th>
                <th className="pb-3">Grade</th>
                <th className="pb-3">Quality Score</th>
                <th className="pb-3 text-right">Certificate Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {qualityInspections.map((insp) => (
                <tr
                  key={insp.id}
                  onClick={() => setActiveCertificate(insp)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 font-bold text-slate-900">{insp.batchNumber}</td>
                  <td className="py-3 font-medium text-slate-700">{insp.cropName} ({insp.variety})</td>
                  <td className="py-3 text-slate-600">{insp.farmerName}</td>
                  <td className="py-3 text-slate-500">{insp.inspectionDate}</td>
                  <td className="py-3">
                    <Badge variant={insp.grade.includes('Grade A') ? 'emerald' : 'blue'} size="sm">
                      {insp.grade.split(' ')[0]} {insp.grade.split(' ')[1]}
                    </Badge>
                  </td>
                  <td className="py-3 font-black text-slate-900">{insp.qualityScore} / 100</td>
                  <td className="py-3 font-mono text-slate-400 text-right truncate max-w-[120px]">
                    {insp.certificateHash}
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
