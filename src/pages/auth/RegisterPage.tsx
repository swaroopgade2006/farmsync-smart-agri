import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole, FarmerType } from '../../types';
import { 
  Sprout, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Building, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Wand2, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Building2,
  Store,
  ShoppingCart,
  TrendingUp,
  Truck
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LocationDetector } from '../../components/common/LocationDetector';

// Presets for each role to guarantee 100% pre-filled form out of the box
const ROLE_DEFAULTS: Record<UserRole, {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  farmerType?: FarmerType;
  village?: string;
  district?: string;
  state?: string;
  landSize?: string;
  soilType?: string;
  farmingExperience?: string;
  fpoRegNumber?: string;
  memberCount?: string;
  fpoFocusCrops?: string;
  vendorBusinessName?: string;
  vendorGstNumber?: string;
  mandiLicenseNumber?: string;
  vendorTradingHub?: string;
  businessName?: string;
  businessType?: string;
  operatingCity?: string;
  deliveryAddress?: string;
  organizationName?: string;
  investorType?: string;
  companyName?: string;
  fleetSize?: string;
}> = {
  farmer: {
    fullName: 'Ramesh Chandra Patel',
    email: 'ramesh.patel@kisan.in',
    phone: '+91 98480 22341',
    password: 'password123',
    farmerType: 'Self-Funded',
    village: 'Gudivada East',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    landSize: '3.5',
    soilType: 'Black Clay Loam',
    farmingExperience: '8',
  },
  fpo: {
    fullName: 'Sahyadri Agro Producer Co. Ltd',
    email: 'contact@sahyadrifpo.org',
    phone: '+91 98220 77412',
    password: 'password123',
    village: 'Niphad Taluka',
    district: 'Nashik',
    state: 'Maharashtra',
    fpoRegNumber: 'FPO-MH-2024-8891',
    memberCount: '450',
    fpoFocusCrops: 'Organic Grapes, Nashik Red Onions, Alphonso Mango, Soybeans',
  },
  buyer: {
    fullName: 'Aditya Sharma',
    email: 'procurement@freshmart.in',
    phone: '+91 91000 88214',
    password: 'password123',
    businessName: 'FreshMart Wholesale Hub Ltd',
    businessType: 'Supermarket Chain',
    operatingCity: 'Vijayawada',
    deliveryAddress: 'Plot 12, APMC Terminal Gate 3, Vijayawada Wholesale Market, Andhra Pradesh 520001',
  },
  vendor: {
    fullName: 'Venkata Satyanarayana',
    email: 'sales@venkatatraders.in',
    phone: '+91 94401 55678',
    password: 'password123',
    vendorBusinessName: 'Venkata Fresh Produce & Logistics',
    vendorGstNumber: '37AABCT3518Q1Z5',
    mandiLicenseNumber: 'APMC-VND-2024-789',
    vendorTradingHub: 'Vijayawada Wholesale APMC Terminal Yard',
  },
  investor: {
    fullName: 'Dr. Priya Nair',
    email: 'partners@agrifund.vc',
    phone: '+91 98110 33456',
    password: 'password123',
    organizationName: 'AgriFund Impact Capital & KisanMitra NGO',
    investorType: 'Agri Impact Fund',
  },
  logistics: {
    fullName: 'Harpreet Singh',
    email: 'dispatch@swiftagri.com',
    phone: '+91 97110 44567',
    password: 'password123',
    companyName: 'SwiftAgri Cold Chain Logistics Ltd',
    fleetSize: '28',
  },
  admin: {
    fullName: 'Dr. Rajesh Swaminathan',
    email: 'admin@farmsync.ai',
    phone: '+91 99000 11223',
    password: 'password123',
    organizationName: 'SIH 2026 Central Agricultural Authority',
  },
};

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryRole = searchParams.get('role') as UserRole;
  const initialRole: UserRole = queryRole && ROLE_DEFAULTS[queryRole] ? queryRole : 'farmer';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  // General fields
  const [fullName, setFullName] = useState(ROLE_DEFAULTS[initialRole].fullName);
  const [email, setEmail] = useState(ROLE_DEFAULTS[initialRole].email);
  const [phone, setPhone] = useState(ROLE_DEFAULTS[initialRole].phone);
  const [password, setPassword] = useState(ROLE_DEFAULTS[initialRole].password);

  // Farmer specific
  const [farmerType, setFarmerType] = useState<FarmerType>(ROLE_DEFAULTS.farmer.farmerType || 'Self-Funded');
  const [village, setVillage] = useState(ROLE_DEFAULTS.farmer.village || 'Gudivada East');
  const [district, setDistrict] = useState(ROLE_DEFAULTS.farmer.district || 'Krishna');
  const [stateName, setStateName] = useState(ROLE_DEFAULTS.farmer.state || 'Andhra Pradesh');
  const [landSize, setLandSize] = useState(ROLE_DEFAULTS.farmer.landSize || '3.5');
  const [soilType, setSoilType] = useState(ROLE_DEFAULTS.farmer.soilType || 'Black Clay Loam');
  const [farmingExperience, setFarmingExperience] = useState(ROLE_DEFAULTS.farmer.farmingExperience || '8');

  // FPO specific
  const [fpoRegNumber, setFpoRegNumber] = useState(ROLE_DEFAULTS.fpo.fpoRegNumber || 'FPO-MH-2024-8891');
  const [memberCount, setMemberCount] = useState(ROLE_DEFAULTS.fpo.memberCount || '450');
  const [fpoFocusCrops, setFpoFocusCrops] = useState(ROLE_DEFAULTS.fpo.fpoFocusCrops || 'Organic Grapes, Nashik Red Onions, Alphonso Mango');

  // Vendor specific
  const [vendorBusinessName, setVendorBusinessName] = useState(ROLE_DEFAULTS.vendor.vendorBusinessName || 'Venkata Fresh Produce & Logistics');
  const [vendorGstNumber, setVendorGstNumber] = useState(ROLE_DEFAULTS.vendor.vendorGstNumber || '37AABCT3518Q1Z5');
  const [mandiLicenseNumber, setMandiLicenseNumber] = useState(ROLE_DEFAULTS.vendor.mandiLicenseNumber || 'APMC-VND-2024-789');
  const [vendorTradingHub, setVendorTradingHub] = useState(ROLE_DEFAULTS.vendor.vendorTradingHub || 'Vijayawada Wholesale APMC Terminal Yard');

  // Buyer specific
  const [businessName, setBusinessName] = useState(ROLE_DEFAULTS.buyer.businessName || 'FreshMart Wholesale Hub Ltd');
  const [businessType, setBusinessType] = useState(ROLE_DEFAULTS.buyer.businessType || 'Supermarket Chain');
  const [operatingCity, setOperatingCity] = useState(ROLE_DEFAULTS.buyer.operatingCity || 'Vijayawada');
  const [deliveryAddress, setDeliveryAddress] = useState(ROLE_DEFAULTS.buyer.deliveryAddress || 'Plot 12, APMC Terminal Gate 3, Vijayawada, Andhra Pradesh 520001');

  // Sponsor specific
  const [organizationName, setOrganizationName] = useState(ROLE_DEFAULTS.investor.organizationName || 'AgriFund Impact Capital & KisanMitra NGO');
  const [investorType, setInvestorType] = useState(ROLE_DEFAULTS.investor.investorType || 'Agri Impact Fund');

  // Logistics specific
  const [companyName, setCompanyName] = useState(ROLE_DEFAULTS.logistics.companyName || 'SwiftAgri Cold Chain Logistics Ltd');
  const [fleetSize, setFleetSize] = useState(ROLE_DEFAULTS.logistics.fleetSize || '28');

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Synchronize form when role changes
  const applyRoleDefaults = (newRole: UserRole, forceRandomize = false) => {
    setRole(newRole);
    const defaults = ROLE_DEFAULTS[newRole] || ROLE_DEFAULTS.farmer;
    const rand = forceRandomize ? Math.floor(100 + Math.random() * 900) : '';

    setFullName(defaults.fullName + (rand ? ` ${rand}` : ''));
    setEmail(rand ? `${newRole}_${rand}@farmsync.ai` : defaults.email);
    setPhone(rand ? `+91 98480 ${rand}22` : defaults.phone);
    setPassword('password123');

    if (newRole === 'farmer') {
      setFarmerType(defaults.farmerType || 'Self-Funded');
      setVillage(defaults.village || 'Gudivada East');
      setDistrict(defaults.district || 'Krishna');
      setStateName(defaults.state || 'Andhra Pradesh');
      setLandSize(defaults.landSize || '3.5');
      setSoilType(defaults.soilType || 'Black Clay Loam');
      setFarmingExperience(defaults.farmingExperience || '8');
    } else if (newRole === 'fpo') {
      setVillage(defaults.village || 'Niphad Taluka');
      setDistrict(defaults.district || 'Nashik');
      setStateName(defaults.state || 'Maharashtra');
      setFpoRegNumber(rand ? `FPO-MH-2024-${rand}` : (defaults.fpoRegNumber || 'FPO-MH-2024-8891'));
      setMemberCount(defaults.memberCount || '450');
      setFpoFocusCrops(defaults.fpoFocusCrops || 'Organic Grapes, Nashik Red Onions, Alphonso Mango');
    } else if (newRole === 'vendor') {
      setVendorBusinessName(defaults.vendorBusinessName || 'Venkata Fresh Produce & Logistics');
      setVendorGstNumber(rand ? `37AABCT${rand}1Z5` : (defaults.vendorGstNumber || '37AABCT3518Q1Z5'));
      setMandiLicenseNumber(rand ? `APMC-VND-2024-${rand}` : (defaults.mandiLicenseNumber || 'APMC-VND-2024-789'));
      setVendorTradingHub(defaults.vendorTradingHub || 'Vijayawada Wholesale APMC Terminal Yard');
    } else if (newRole === 'buyer') {
      setBusinessName(defaults.businessName || 'FreshMart Wholesale Hub Ltd');
      setBusinessType(defaults.businessType || 'Supermarket Chain');
      setOperatingCity(defaults.operatingCity || 'Vijayawada');
      setDeliveryAddress(defaults.deliveryAddress || 'Plot 12, APMC Terminal Gate 3, Vijayawada, Andhra Pradesh 520001');
    } else if (newRole === 'investor') {
      setOrganizationName(defaults.organizationName || 'AgriFund Impact Capital & KisanMitra NGO');
      setInvestorType(defaults.investorType || 'Agri Impact Fund');
    } else if (newRole === 'logistics') {
      setCompanyName(defaults.companyName || 'SwiftAgri Cold Chain Logistics Ltd');
      setFleetSize(defaults.fleetSize || '28');
    }
  };

  useEffect(() => {
    if (queryRole && ROLE_DEFAULTS[queryRole]) {
      applyRoleDefaults(queryRole);
    }
  }, [queryRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      role,
      fullName: fullName || ROLE_DEFAULTS[role]?.fullName || 'Verified Member',
      email: email || `${role}_${Date.now()}@farmsync.ai`,
      phone: phone || '+91 98480 12345',
      farmerType,
      village: village || 'Gudivada East',
      district: district || 'Krishna',
      state: stateName || 'Andhra Pradesh',
      landSize: Number(landSize) || 3.5,
      soilType: soilType || 'Black Clay Loam',
      farmingExperience: Number(farmingExperience) || 8,
      businessName: role === 'vendor' ? (vendorBusinessName || fullName) : (businessName || fullName),
      businessType,
      operatingCity,
      deliveryAddress,
      organizationName,
      investorType,
      companyName,
      fleetSize: Number(fleetSize),
      fpoName: fullName,
      fpoRegistrationNumber: fpoRegNumber || 'FPO-MH-2024-8891',
      fpoMemberCount: Number(memberCount) || 450,
      fpoFocusCrops,
      vendorGstNumber: vendorGstNumber || '37AABCT3518Q1Z5',
      vendorMandiLicenseNumber: mandiLicenseNumber || 'APMC-VND-2024-789',
      vendorTradingHub: vendorTradingHub || 'Vijayawada Wholesale APMC Terminal Yard',
    };

    const res = await register(payload);
    setIsLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        if (role === 'farmer' || role === 'fpo') navigate('/farmer');
        else if (role === 'buyer' || role === 'vendor') navigate('/buyer/marketplace');
        else if (role === 'investor') navigate('/sponsor');
        else if (role === 'logistics') navigate('/logistics');
        else navigate('/admin/verification');
      }, 800);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl w-full space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-600/20 mb-3">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create your FarmSync AI Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Join India's verified agricultural trust network with transparent provenance and direct market linkages
          </p>
        </div>

        <Card className="p-6 sm:p-8 shadow-md border-slate-200">
          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Registration Successful!</h3>
              <p className="text-xs text-slate-600">Setting up your verified {role.toUpperCase()} portal and redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Account Role Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    1. Select Your Account Role
                  </label>
                  <button
                    type="button"
                    onClick={() => applyRoleDefaults(role, true)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-emerald-600" />
                    Re-populate Sample {role.toUpperCase()} Data
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'farmer', title: 'Farmer', desc: 'Direct Land Cultivator', icon: Sprout, badge: 'Direct Source' },
                    { id: 'fpo', title: 'FPO Collective', desc: 'Farmer Producer Org', icon: Building2, badge: 'Producer Co-op' },
                    { id: 'buyer', title: 'Buyer / Retailer', desc: 'Bulk Sourcing & Chains', icon: ShoppingCart, badge: 'Procurement' },
                    { id: 'vendor', title: 'Vendor / Trader', desc: 'Mandi Resale Aggregator', icon: Store, badge: 'Resale License' },
                    { id: 'investor', title: 'Sponsor / Investor', desc: 'Impact Fund & CSR', icon: TrendingUp, badge: 'Grants & ROI' },
                    { id: 'logistics', title: 'Logistics Provider', desc: 'Cold Chain & Fleet', icon: Truck, badge: 'Fleet Partner' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = role === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => applyRoleDefaults(item.id as UserRole)}
                        className={`p-3 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-emerald-200/70 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {item.badge}
                          </span>
                        </div>
                        <span className="block text-xs font-black text-slate-900">{item.title}</span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Contact and Account Credentials */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    2. Primary Contact & Login Credentials
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    ✓ Pre-filled Ready
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name / Entity Name *</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Chandra Patel"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. ramesh.patel@kisan.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number (WhatsApp Verified) *</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98480 22341"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Password *</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Role-Specific Details */}
              {role === 'farmer' && (
                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      3. Farm Holding & Cultivation Details
                    </label>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Farmer Direct Source
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Funding Model *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Self-Funded', 'Funded', 'Free-Support'] as FarmerType[]).map((ft) => (
                        <button
                          key={ft}
                          type="button"
                          onClick={() => setFarmerType(ft)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                            farmerType === ft
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-300'
                          }`}
                        >
                          {ft}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smart Location Detector */}
                  <div className="pt-1">
                    <LocationDetector
                      value={village ? `${village}, ${district}, ${stateName}` : ''}
                      onChange={(address, details) => {
                        if (details) {
                          setVillage(details.villageOrLocality || village);
                          setDistrict(details.district || district);
                          setStateName(details.state || stateName);
                          if (details.soilZone?.includes('Black')) setSoilType('Black Clay Loam');
                          else if (details.soilZone?.includes('Red')) setSoilType('Red Sandy Loam');
                          else if (details.soilZone?.includes('Alluvial')) setSoilType('Alluvial Soil');
                          else if (details.soilZone?.includes('Laterite')) setSoilType('Laterite Soil');
                        }
                      }}
                      label="Farm Gate Village & Geographical Location"
                      placeholder="Type village name, mandal, or 6-digit PIN code..."
                      helperText="Auto-resolves your District, State, and Soil Classification for Batch Passports."
                      showMapPreview={true}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Village / Mandal *</label>
                      <input
                        type="text"
                        placeholder="e.g. Gudivada East"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">District *</label>
                      <input
                        type="text"
                        placeholder="e.g. Krishna"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        placeholder="e.g. Andhra Pradesh"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Land Size (Acres) *</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="e.g. 3.5"
                        value={landSize}
                        onChange={(e) => setLandSize(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Soil Classification *</label>
                      <select
                        value={soilType}
                        onChange={(e) => setSoilType(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="Black Clay Loam">Black Clay Loam</option>
                        <option value="Red Sandy Loam">Red Sandy Loam</option>
                        <option value="Alluvial Soil">Alluvial Soil</option>
                        <option value="Laterite Soil">Laterite Soil</option>
                        <option value="Clayey Soil">Clayey Soil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Farming Experience (Yrs) *</label>
                      <input
                        type="number"
                        placeholder="e.g. 8"
                        value={farmingExperience}
                        onChange={(e) => setFarmingExperience(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FPO Specific Fields */}
              {role === 'fpo' && (
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                      3. FPO Cooperative & Collective Details
                    </label>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      FPO Collective
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">FPO Society Registration No *</label>
                      <input
                        type="text"
                        placeholder="e.g. FPO-MH-2024-8891"
                        value={fpoRegNumber}
                        onChange={(e) => setFpoRegNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Total Active Member Farmers *</label>
                      <input
                        type="number"
                        placeholder="e.g. 450"
                        value={memberCount}
                        onChange={(e) => setMemberCount(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Key Focus Crops & Produce</label>
                      <input
                        type="text"
                        placeholder="e.g. Organic Grapes, Nashik Red Onions, Alphonso Mango"
                        value={fpoFocusCrops}
                        onChange={(e) => setFpoFocusCrops(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Vendor / Mandi Trader Specific Fields */}
              {role === 'vendor' && (
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
                      3. Mandi Trader Firm & Resale License
                    </label>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Vendor Resale Source
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Trading Firm / Business Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Venkata Fresh Produce & Logistics"
                        value={vendorBusinessName}
                        onChange={(e) => setVendorBusinessName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">GSTIN Number (15 Digits) *</label>
                      <input
                        type="text"
                        placeholder="e.g. 37AABCT3518Q1Z5"
                        value={vendorGstNumber}
                        onChange={(e) => setVendorGstNumber(e.target.value.toUpperCase())}
                        maxLength={15}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">APMC / Mandi Trade License *</label>
                      <input
                        type="text"
                        placeholder="e.g. APMC-VND-2024-789"
                        value={mandiLicenseNumber}
                        onChange={(e) => setMandiLicenseNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Primary Mandi Yard / Operating Hub</label>
                      <input
                        type="text"
                        placeholder="e.g. Vijayawada Wholesale APMC Terminal Yard"
                        value={vendorTradingHub}
                        onChange={(e) => setVendorTradingHub(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Buyer Specific Fields */}
              {role === 'buyer' && (
                <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-sky-950 uppercase tracking-wider">
                      3. Buyer & Procurement Details
                    </label>
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                      Bulk Procurement
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Business / Company Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. FreshMart Wholesale Hub Ltd"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Business Category *</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="Supermarket Chain">Supermarket Chain / Retail</option>
                        <option value="Wholesale">Wholesale & Market Yard</option>
                        <option value="Restaurant Group">Restaurant / Culinary Network</option>
                        <option value="Food Processing">Food Processing Industry</option>
                        <option value="Exporter">Agri Exporter</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Receiving Warehouse / Delivery Address *</label>
                    <input
                      type="text"
                      placeholder="e.g. Plot 12, APMC Terminal Gate 3, Vijayawada, Andhra Pradesh 520001"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Sponsor Specific Fields */}
              {role === 'investor' && (
                <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider">
                      3. Sponsor & Impact Capital Details
                    </label>
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                      Fund / Grant Partner
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Organization / Trust Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. AgriFund Impact Capital & KisanMitra NGO"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Entity Type *</label>
                      <select
                        value={investorType}
                        onChange={(e) => setInvestorType(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="Agri Impact Fund">Agri Impact Fund (ROI Model)</option>
                        <option value="CSR Foundation">CSR Trust (Free-Support Grants)</option>
                        <option value="Agri NGO">Agri NGO / Philanthropy</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Logistics Specific Fields */}
              {role === 'logistics' && (
                <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      3. Cold-Chain & Fleet Operations
                    </label>
                    <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                      Logistics Partner
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Logistics Firm Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. SwiftAgri Cold Chain Logistics Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Active Fleet Count *</label>
                      <input
                        type="number"
                        value={fleetSize}
                        onChange={(e) => setFleetSize(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Complete {role.toUpperCase()} Registration
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered with FarmSync AI?{' '}
            <Link to={`/login?role=${role}`} className="font-bold text-emerald-600 hover:underline">
              Sign in to your account
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};
