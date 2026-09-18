import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { ImageUploader } from '../../components/common/ImageUploader';
import { Crop } from '../../types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface AddCropUpdateModalProps {
  cropId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddCropUpdateModal: React.FC<AddCropUpdateModalProps> = ({ cropId, isOpen, onClose }) => {
  const { crops, addCropUpdate } = useData();
  const crop = crops.find(c => c.id === cropId);

  const [growthStage, setGrowthStage] = useState<Crop['growthStage']>(crop?.growthStage || 'Vegetative');
  const [irrigationStatus, setIrrigationStatus] = useState<any>('Drip Irrigation');
  const [pestObservations, setPestObservations] = useState('Clean canopy, no pest infestation observed.');
  const [notes, setNotes] = useState('Irrigation schedule normal. Foliar nutrition applied.');
  const [photoUrl, setPhotoUrl] = useState(crop?.imageUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await addCropUpdate({
      cropId,
      updateDate: new Date().toISOString().split('T')[0],
      photoUrl,
      growthStage,
      irrigationStatus,
      pestObservations,
      notes
    });

    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Crop Progress Update"
      subtitle={`Record growth observations for ${crop?.cropName || 'Crop'} (${crop?.cropVariety})`}
      maxWidth="lg"
    >
      {success ? (
        <div className="py-8 text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">Progress Logged Successfully!</h4>
          <p className="text-xs text-slate-500">AI Harvest forecast model has been refreshed.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Photo */}
          <ImageUploader
            value={photoUrl}
            onChange={setPhotoUrl}
            label="1. Crop Photo (Camera / Upload)"
            helperText="Capture current leaf, stem or fruit status"
          />

          {/* Growth Stage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              2. Current Growth Stage *
            </label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="Sowing">Sowing</option>
              <option value="Germination">Germination</option>
              <option value="Vegetative">Vegetative</option>
              <option value="Flowering">Flowering</option>
              <option value="Fruiting">Fruiting</option>
              <option value="Maturing">Maturing</option>
              <option value="Harvest Ready">Harvest Ready</option>
            </select>
          </div>

          {/* Irrigation Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              3. Irrigation & Water Status *
            </label>
            <select
              value={irrigationStatus}
              onChange={(e) => setIrrigationStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            >
              <option value="Drip Irrigation">Drip Irrigation (Automated/Scheduled)</option>
              <option value="Canal Water">Canal Water Flow</option>
              <option value="Rainfed">Rainfed / Adequate Moisture</option>
              <option value="Sprinkler">Sprinkler Irrigation</option>
              <option value="Needs Irrigation">Needs Irrigation in 24h</option>
            </select>
          </div>

          {/* Pest Observations */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              4. Pest & Health Observations
            </label>
            <input
              type="text"
              required
              value={pestObservations}
              onChange={(e) => setPestObservations(e.target.value)}
              placeholder="e.g. Clean foliage, minor whitefly sprayed with organic neem"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Farmer Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              5. Farmer Field Notes
            </label>
            <textarea
              rows={2}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write detailed field observations..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading} rightIcon={<Sparkles className="w-4 h-4" />}>
              Save & Recalculate AI Forecast
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
