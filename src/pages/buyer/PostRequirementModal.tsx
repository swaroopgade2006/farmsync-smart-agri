import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { LocationDetector } from '../../components/common/LocationDetector';
import { CheckCircle2, Sparkles, MapPin, DollarSign, Calendar, ShoppingCart } from 'lucide-react';

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostRequirementModal: React.FC<PostRequirementModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, buyerProfile } = useAuth();
  const { addBuyerRequirement } = useData();

  const [cropType, setCropType] = useState('Tomato');
  const [requiredQuantity, setRequiredQuantity] = useState('2000');
  const [maxPricePerKg, setMaxPricePerKg] = useState('30');
  const [requiredByDate, setRequiredByDate] = useState('2026-10-20');
  const [deliveryLocation, setDeliveryLocation] = useState(buyerProfile?.deliveryAddress || 'Vijayawada Central Wholesale Yard, AP');
  const [deliveryState, setDeliveryState] = useState('Andhra Pradesh');
  const [deliveryDistrict, setDeliveryDistrict] = useState('Krishna');

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await addBuyerRequirement({
      buyerId: buyerProfile?.id || currentUser?.id || 'buyer_freshmart',
      buyerName: currentUser?.fullName || 'FreshMart Procurement',
      buyerBusinessName: buyerProfile?.businessName || 'FreshMart Wholesale Hub',
      buyerVerified: Boolean(currentUser?.isVerified),
      cropType,
      requiredQuantity: Number(requiredQuantity),
      maxPricePerKg: Number(maxPricePerKg),
      requiredByDate,
      deliveryLocation,
      deliveryState,
      deliveryDistrict
    });

    setIsLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Buyer Crop Requirement"
      subtitle="Publish your procurement volume and maximum budget to trigger real-time AI farmer matching"
      maxWidth="lg"
    >
      {success ? (
        <div className="py-8 text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">Requirement Published Successfully!</h4>
          <p className="text-xs text-slate-500">AI Engine is calculating matches with active farmer crops.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Crop Commodity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Crop Commodity Type *
            </label>
            <input
              type="text"
              required
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              placeholder="e.g. Tomato, Paddy / Rice, Green Chilli, Mango"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Quantity & Max Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Required Quantity (kg) *
              </label>
              <input
                type="number"
                required
                value={requiredQuantity}
                onChange={(e) => setRequiredQuantity(e.target.value)}
                placeholder="e.g. 2000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Maximum Price per kg (₹) *
              </label>
              <input
                type="number"
                required
                value={maxPricePerKg}
                onChange={(e) => setMaxPricePerKg(e.target.value)}
                placeholder="e.g. 30"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Required By Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Required Delivery Date *
            </label>
            <input
              type="date"
              required
              value={requiredByDate}
              onChange={(e) => setRequiredByDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Delivery Location */}
          <div className="space-y-3">
            <LocationDetector
              value={deliveryLocation}
              onChange={(address, details) => {
                setDeliveryLocation(address);
                if (details) {
                  setDeliveryDistrict(details.district || deliveryDistrict);
                  setDeliveryState(details.state || deliveryState);
                }
              }}
              label="Delivery Hub / Warehouse Address"
              placeholder="Enter receiving wholesale yard, city, or PIN code..."
              required
              showMapPreview={true}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Resolved District</label>
                <input
                  type="text"
                  placeholder="District (e.g. Krishna)"
                  value={deliveryDistrict}
                  onChange={(e) => setDeliveryDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Resolved State</label>
                <input
                  type="text"
                  placeholder="State (e.g. Andhra Pradesh)"
                  value={deliveryState}
                  onChange={(e) => setDeliveryState(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading} rightIcon={<Sparkles className="w-4 h-4" />}>
              Post & Run AI Matching
            </Button>
          </div>

        </form>
      )}
    </Modal>
  );
};
