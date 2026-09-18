import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { diagnoseCropImage, DiseaseDiagnosticResult, SAMPLE_DISEASE_SCANS } from '../../services/diseaseDetection';
import { 
  Sparkles, 
  Camera, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  HeartHandshake, 
  Leaf, 
  Activity, 
  RotateCcw,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';

export const CropDoctorPage: React.FC = () => {
  const { crops, addCropUpdate } = useData();

  const [selectedSampleKey, setSelectedSampleKey] = useState<string>('tomato_blight');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [diagnosticResult, setDiagnosticResult] = useState<DiseaseDiagnosticResult | null>(null);
  const [selectedCropId, setSelectedCropId] = useState(crops[0]?.id || '');
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  const sampleLeaves = [
    { key: 'tomato_blight', name: 'Tomato Leaf (Dark Rings)', crop: 'Tomato', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
    { key: 'potato_blight', name: 'Potato Leaf (Water Lesions)', crop: 'Potato', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80' },
    { key: 'okra_yellow_vein', name: 'Okra Leaf (Yellow Veins)', crop: 'Okra', image: 'https://images.unsplash.com/photo-1629858349942-88229a43a055?auto=format&fit=crop&w=600&q=80' },
    { key: 'onion_purple_blotch', name: 'Onion Foliage (Purple Spots)', crop: 'Onion', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80' },
    { key: 'chilli_curl', name: 'Chilli Pod (Curled Leaf)', crop: 'Chilli', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80' },
    { key: 'rice_blast', name: 'Paddy Leaf (Spindle Spots)', crop: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { key: 'healthy_crop', name: 'Healthy Leaf (Clean Vigor)', crop: 'Capsicum', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setDiagnosticResult(null);
    setLoggedSuccess(false);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setDiagnosticResult(diagnoseCropImage(selectedSampleKey));
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleLogToTimeline = async () => {
    if (!diagnosticResult || !selectedCropId) return;

    await addCropUpdate({
      cropId: selectedCropId,
      updateDate: new Date().toISOString().split('T')[0],
      growthStage: 'Fruiting',
      irrigationStatus: 'Drip Irrigation',
      pestObservations: `AI Doctor Diagnosis: ${diagnosticResult.diseaseName} (${diagnosticResult.severity}). Treatment applied: ${diagnosticResult.organicRemedy.slice(0, 80)}...`,
      notes: `Automated diagnostic log with ${diagnosticResult.confidencePercentage}% neural confidence.`
    });

    setLoggedSuccess(true);
    setTimeout(() => setLoggedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Computer Vision & Bio-Security Protocol
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            AI Crop Doctor & Pest Diagnostic Scanner
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
            Instant neural detection of fungal, bacterial, and viral foliar pathogens with localized bio-pesticide remedies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Leaf Input & Scanner (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              1. Select or Capture Leaf Sample
            </h3>

            {/* Sample presets */}
            <div className="grid grid-cols-2 gap-2">
              {sampleLeaves.map((sample) => (
                <button
                  key={sample.key}
                  onClick={() => {
                    setSelectedSampleKey(sample.key);
                    setDiagnosticResult(null);
                  }}
                  className={`p-2 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    selectedSampleKey === sample.key
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm bg-emerald-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="aspect-video rounded-xl overflow-hidden mb-1.5 bg-slate-100">
                    <img src={sample.image} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block truncate">{sample.name}</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">{sample.crop}</span>
                </button>
              ))}
            </div>

            {/* Scanner Visualizer Box */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 flex items-center justify-center border-2 border-dashed border-emerald-500/40">
              <img
                src={sampleLeaves.find(s => s.key === selectedSampleKey)?.image}
                alt="Scanning sample"
                className={`w-full h-full object-cover ${isScanning ? 'opacity-40 filter blur-xs' : 'opacity-90'}`}
              />

              {/* Holographic scanning laser line */}
              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="w-full h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-bounce" />
                  <div className="mt-4 text-center">
                    <span className="text-xs font-mono font-bold text-emerald-300 tracking-widest block">
                      ANALYZING FOLIAR PATHOLOGY... {scanProgress}%
                    </span>
                    <div className="w-48 bg-slate-800 rounded-full h-2 mt-2 mx-auto overflow-hidden">
                      <div className="bg-emerald-400 h-full transition-all" style={{ width: `${scanProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isScanning}
              onClick={handleStartScan}
              leftIcon={<Sparkles className="w-5 h-5 text-amber-300" />}
            >
              {isScanning ? 'Neural Engine Scanning...' : 'Scan & Diagnose Plant Disease'}
            </Button>
          </Card>
        </div>

        {/* Right Column: AI Diagnostic Report & Prescription (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {diagnosticResult ? (
            <Card className="p-6 border-slate-200 space-y-6 animate-fade-in">
              
              {/* Top Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={diagnosticResult.severity === 'Healthy' ? 'emerald' : diagnosticResult.severity === 'Severe' ? 'rose' : 'amber'} size="md">
                      {diagnosticResult.severity} Severity
                    </Badge>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      {diagnosticResult.confidencePercentage}% Confidence
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-2">
                    {diagnosticResult.diseaseName}
                  </h2>
                  <p className="text-xs italic text-slate-500 font-mono mt-0.5">
                    Pathogen: {diagnosticResult.scientificName}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Urgency Level</span>
                  <span className={`text-sm font-black ${
                    diagnosticResult.urgency === 'Immediate Action' ? 'text-rose-600' : 'text-emerald-700'
                  }`}>
                    {diagnosticResult.urgency}
                  </span>
                </div>
              </div>

              {/* Identified Symptoms */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Identified Pathological Symptoms
                </h4>
                <ul className="space-y-1.5">
                  {diagnosticResult.symptoms.map((s, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bio-Remedy Prescription */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-emerald-950 uppercase flex items-center gap-1">
                    🌿 Organic Biocontrol Remedy
                  </span>
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    {diagnosticResult.organicRemedy}
                  </p>
                </div>

                {diagnosticResult.chemicalRemedy && (
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-blue-950 uppercase flex items-center gap-1">
                      🧪 Chemical Alternative (If Severe)
                    </span>
                    <p className="text-xs text-blue-900 leading-relaxed font-medium">
                      {diagnosticResult.chemicalRemedy}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions: Log to Timeline or Request Free CSR Kit */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                {loggedSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Prescription successfully logged to your crop timeline!</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Log to Crop:</span>
                    <select
                      value={selectedCropId}
                      onChange={(e) => setSelectedCropId(e.target.value)}
                      className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold border border-slate-200"
                    >
                      {crops.map(c => (
                        <option key={c.id} value={c.id}>{c.cropName} ({c.cropVariety})</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogToTimeline}
                      leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    >
                      Log in Crop Timeline
                    </Button>

                    <Link to="/farmer/support">
                      <Button
                        variant="harvest"
                        size="sm"
                        leftIcon={<HeartHandshake className="w-4 h-4 text-slate-900" />}
                      >
                        Request Free CSR Kit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 border-slate-200">
              <Leaf className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse-subtle" />
              <h3 className="text-base font-bold text-slate-700">Awaiting Leaf Scan</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select a sample above or take a leaf photo, then click "Scan & Diagnose Plant Disease".
              </p>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
};
