import React, { useState } from 'react';
import { Camera, UploadCloud, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

const PRESET_IMAGES = [
  { name: 'Red Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { name: 'Potato (Kufri)', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80' },
  { name: 'Red Onion', url: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80' },
  { name: 'Green Chilli', url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Capsicum', url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80' },
  { name: 'Purple Brinjal', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80' },
  { name: 'Okra / Bhindi', url: 'https://images.unsplash.com/photo-1629858349942-88229a43a055?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cauliflower', url: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80' },
  { name: 'Crisp Cabbage', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80' },
  { name: 'Fresh Carrot', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tender Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bitter Gourd', url: 'https://images.unsplash.com/photo-1627483298235-f3bacdd56fbf?auto=format&fit=crop&w=800&q=80' },
  { name: 'Garlic Bulbs', url: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80' },
  { name: 'Green Peas', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
  { name: 'Paddy / Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Fresh Mango', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80' }
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Upload Photo',
  helperText = 'Supports PNG, JPG, WebP up to 5MB'
}) => {
  const [preview, setPreview] = useState<string>(value || '');
  const [showPresets, setShowPresets] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setPreview(url);
    onChange(url);
    setShowPresets(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {showPresets ? 'Hide Sample Photos' : 'Choose Sample Photo'}
        </button>
      </div>

      {showPresets && (
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl mb-3">
          <p className="text-xs text-emerald-800 font-medium mb-2">Select a high-resolution sample crop photo:</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.url)}
                className="group relative rounded-xl overflow-hidden aspect-video border border-emerald-300 hover:ring-2 hover:ring-emerald-500 focus:outline-none transition-all"
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute inset-0 bg-black/40 flex items-end p-1 text-[10px] text-white font-medium">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 transition-colors text-center bg-slate-50/60 group">
        {preview ? (
          <div className="relative rounded-xl overflow-hidden max-h-52 mx-auto aspect-video max-w-sm">
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <label className="cursor-pointer bg-white text-slate-800 text-xs px-3 py-1.5 rounded-lg font-medium shadow-md hover:bg-slate-100">
                Change Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <button
                type="button"
                onClick={() => { setPreview(''); onChange(''); }}
                className="bg-rose-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-md hover:bg-rose-700"
              >
                Remove
              </button>
            </div>
            <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="w-12 h-12 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-500 mt-1">{helperText}</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 shadow-sm">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                Browse Files
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm">
                <Camera className="w-3.5 h-3.5" />
                Take Photo
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
