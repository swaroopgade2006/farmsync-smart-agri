import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Sprout, ArrowLeft, CheckCircle2, Sparkles, MapPin, DollarSign, Calendar, HelpCircle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ImageUploader } from '../../components/common/ImageUploader';
import { LocationDetector } from '../../components/common/LocationDetector';

export const AddCropPage: React.FC = () => {
  const { currentUser, farmerProfile } = useAuth();
  const { addCrop } = useData();
  const navigate = useNavigate();

  const [cropName, setCropName] = useState('Organic Capsicum');
  const [cropVariety, setCropVariety] = useState('Indra F1 Hybrid');
  const [landArea, setLandArea] = useState('1.5');
  const [sowingDate, setSowingDate] = useState('2026-08-01');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('2026-10-25');
  const [estimatedQuantity, setEstimatedQuantity] = useState('2500');
  const [pricePerKg, setPricePerKg] = useState('45');
  const [cultivationCost, setCultivationCost] = useState('28000');
  const [farmingMethod, setFarmingMethod] = useState('Natural / Drip Irrigated');
  const [location, setLocation] = useState(
    farmerProfile ? `${farmerProfile.village}, ${farmerProfile.district}, ${farmerProfile.state}` : 'Gudivada, Krishna, AP'
  );
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80');

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!cropName || !cropVariety || !landArea || !sowingDate || !expectedHarvestDate || !estimatedQuantity || !pricePerKg) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    setIsLoading(true);

    try {
      await addCrop({
        farmerId: farmerProfile?.id || currentUser?.id || 'farmer_ravi',
        farmerName: currentUser?.fullName || 'Ravi Kumar',
        farmerVillage: farmerProfile?.village || 'Gudivada',
        farmerDistrict: farmerProfile?.district || 'Krishna',
        farmerState: farmerProfile?.state || 'Andhra Pradesh',
        farmerVerified: Boolean(currentUser?.isVerified),
        farmerType: farmerProfile?.farmerType || 'Funded',
        cropName,
        cropVariety,
        landArea: Number(landArea),
        sowingDate,
        expectedHarvestDate,
        estimatedQuantity: Number(estimatedQuantity),
        pricePerKg: Number(pricePerKg),
        cultivationCost: Number(cultivationCost) || 0,
        farmingMethod,
        location,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
        growthStage: 'Vegetative',
        sourceType: 'FARMER',
        isFarmerDirect: true,
        status: 'ACTIVE'
      });

      setIsLoading(false);
      setSuccessMessage('Crop added successfully.');
      setTimeout(() => {
        navigate('/farmer/crops');
      }, 1200);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Failed to add crop. Please check inputs.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/farmer/crops"
            className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add New Crop Listing</h1>
            <p className="text-xs text-slate-500">Publish your crop for AI matching and institutional buyer discovery</p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm font-bold animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage} Redirecting to My Crops...</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-700 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <Card className="p-6 sm:p-8 border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Quick Preset Toolbar */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                1-Click Quick-Fill Vegetable Presets:
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Auto-populates standard varieties, yield & prices</span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Tomato', variety: 'Arka Rakshak', qty: '2800', price: '28', cost: '35000', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
                { name: 'Potato', variety: 'Kufri Jyoti (Grade A)', qty: '4800', price: '22', cost: '42000', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80' },
                { name: 'Red Onion', variety: 'Nashik Red Super', qty: '3600', price: '26', cost: '38000', img: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80' },
                { name: 'Green Chilli', variety: 'Guntur Teja Hybrid', qty: '1200', price: '55', cost: '22000', img: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80' },
                { name: 'Organic Capsicum', variety: 'Indra F1 Bell Pepper', qty: '2400', price: '48', cost: '32000', img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80' },
                { name: 'Brinjal / Eggplant', variety: 'Bhagyamati Purple', qty: '2200', price: '24', cost: '19000', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80' },
                { name: 'Okra / Ladyfinger', variety: 'Pusa Sawani Tender', qty: '1500', price: '32', cost: '16000', img: 'https://images.unsplash.com/photo-1629858349942-88229a43a055?auto=format&fit=crop&w=800&q=80' },
                { name: 'Cauliflower', variety: 'Pusa Snowball 16', qty: '2800', price: '35', cost: '29000', img: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80' },
                { name: 'Cabbage', variety: 'Golden Acre Crisp', qty: '3400', price: '18', cost: '24000', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80' },
                { name: 'Carrot', variety: 'Pusa Kesar Sweet', qty: '2600', price: '38', cost: '26000', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80' },
                { name: 'Spinach / Palak', variety: 'All Green Tender Leaf', qty: '1200', price: '22', cost: '11000', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80' },
                { name: 'Bitter Gourd', variety: 'Pusa Do Mausami', qty: '1400', price: '36', cost: '17000', img: 'https://images.unsplash.com/photo-1627483298235-f3bacdd56fbf?auto=format&fit=crop&w=800&q=80' },
                { name: 'Bottle Gourd', variety: 'Pusa Naveen Long', qty: '2800', price: '16', cost: '15000', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80' },
                { name: 'Ginger', variety: 'Rio de Janeiro High Oleoresin', qty: '1800', price: '85', cost: '45000', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80' },
                { name: 'Garlic', variety: 'Yamuna Safed (G-1)', qty: '1600', price: '130', cost: '38000', img: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80' },
                { name: 'Green Peas', variety: 'Arkel Early Sweet', qty: '1700', price: '65', cost: '21000', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80' },
                { name: 'Cucumber', variety: 'Japanese Long Green', qty: '3100', price: '20', cost: '18000', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80' }
              ].map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setCropName(preset.name);
                    setCropVariety(preset.variety);
                    setEstimatedQuantity(preset.qty);
                    setPricePerKg(preset.price);
                    setCultivationCost(preset.cost);
                    setImageUrl(preset.img);
                  }}
                  className="px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-500 rounded-lg text-[11px] font-bold text-emerald-900 transition-colors shadow-xs"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Crop Identity */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              1. Crop Identity & Variety
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomato, Paddy / Rice, Green Chilli"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Variety *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arka Rakshak, Sona Masoori, Guntur Teja"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cultivation & Timeline */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              2. Acreage & Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Land Area (Acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 2.5"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sowing Date *</label>
                <input
                  type="date"
                  required
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Harvest Date *</label>
                <input
                  type="date"
                  required
                  value={expectedHarvestDate}
                  onChange={(e) => setExpectedHarvestDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Yield & Economics */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-600" />
              3. Quantity & Pricing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Total Quantity (kg) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 3000"
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Price per kg (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 35"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cultivation Cost (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 40000"
                  value={cultivationCost}
                  onChange={(e) => setCultivationCost(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Farming Method & Farm Location */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Farming Method *</label>
              <select
                value={farmingMethod}
                onChange={(e) => setFarmingMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="Natural / Drip Irrigated">Natural / Drip Irrigated</option>
                <option value="Certified Organic">Certified Organic</option>
                <option value="Zero Budget Natural Farming (ZBNF)">Zero Budget Natural Farming (ZBNF)</option>
                <option value="Conventional Sustainable">Conventional Sustainable</option>
                <option value="Hydroponic / Protected">Hydroponic / Polyhouse Protected</option>
              </select>
            </div>

            {/* Smart Location Detector */}
            <div>
              <LocationDetector
                value={location}
                onChange={(address) => setLocation(address)}
                label="Farm Gate Location / Harvest Depot"
                placeholder="Enter village, farm gate address, APMC hub or PIN code..."
                required
                showMapPreview={true}
              />
            </div>
          </div>

          {/* Section 5: Photo Upload */}
          <div>
            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
              label="Crop Photo"
              helperText="Upload farm field picture or choose from sample presets"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link to="/farmer/crops">
              <Button type="button" variant="outline" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Add Crop
            </Button>
          </div>

        </form>
      </Card>

    </div>
  );
};
