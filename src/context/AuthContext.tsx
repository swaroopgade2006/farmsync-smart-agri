import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  FarmerProfile, 
  FPOProfile,
  VendorProfile,
  BuyerProfile, 
  InvestorProfile, 
  LogisticsProfile,
  FarmerType,
  VerificationStatus
} from '../types';
import { 
  SEED_USERS, 
  SEED_FARMERS, 
  SEED_FPOS,
  SEED_VENDORS,
  SEED_BUYERS, 
  SEED_INVESTORS, 
  SEED_LOGISTICS 
} from '../data/seedData';

interface AuthContextType {
  currentUser: UserProfile | null;
  user: UserProfile | null; // Alias for currentUser
  currentRole: UserRole | null;
  farmerProfile: FarmerProfile | null;
  fpoProfile: FPOProfile | null;
  vendorProfile: VendorProfile | null;
  buyerProfile: BuyerProfile | null;
  investorProfile: InvestorProfile | null;
  logisticsProfile: LogisticsProfile | null;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    email: string;
    fullName: string;
    phone: string;
    role: UserRole;
    farmerType?: FarmerType;
    village?: string;
    district?: string;
    state?: string;
    landSize?: number;
    soilType?: string;
    farmingExperience?: number;
    businessName?: string;
    businessType?: string;
    operatingCity?: string;
    deliveryAddress?: string;
    organizationName?: string;
    investorType?: string;
    companyName?: string;
    fleetSize?: number;
    fpoName?: string;
    registrationNumber?: string;
    memberFarmersCount?: number;
    mandiLicenseNumber?: string;
    handledCommodities?: string[];
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole, targetUserId?: string) => void;
  updateCurrentUserProfile: (profile: Partial<UserProfile>) => void;
  requestRoleChange: (requestedRole: UserRole, reason: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'farmsync_auth_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial user from storage or default to Farmer (Ravi Kumar)
  useEffect(() => {
    const savedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
    const usersInStorage = getLocalUsers();

    if (savedUserId) {
      const found = usersInStorage.find(u => u.id === savedUserId);
      if (found) {
        setCurrentUser(found);
      } else {
        setCurrentUser(SEED_USERS[0]); // Default to Ravi Kumar
      }
    } else {
      setCurrentUser(SEED_USERS[0]); // Default to Ravi Kumar
    }
    setIsLoading(false);
  }, []);

  const getLocalUsers = (): UserProfile[] => {
    const stored = localStorage.getItem('farmsync_users');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored users', e);
      }
    }
    return SEED_USERS;
  };

  const saveLocalUsers = (users: UserProfile[]) => {
    localStorage.setItem('farmsync_users', JSON.stringify(users));
  };

  const getLocalFarmers = (): FarmerProfile[] => {
    const stored = localStorage.getItem('farmsync_farmers');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored farmers', e);
      }
    }
    return SEED_FARMERS;
  };

  const getLocalFPOs = (): FPOProfile[] => {
    const stored = localStorage.getItem('farmsync_fpos');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored FPOs', e);
      }
    }
    return SEED_FPOS;
  };

  const getLocalVendors = (): VendorProfile[] => {
    const stored = localStorage.getItem('farmsync_vendors');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored Vendors', e);
      }
    }
    return SEED_VENDORS;
  };

  const getLocalBuyers = (): BuyerProfile[] => {
    const stored = localStorage.getItem('farmsync_buyers');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored buyers', e);
      }
    }
    return SEED_BUYERS;
  };

  const getLocalInvestors = (): InvestorProfile[] => {
    const stored = localStorage.getItem('farmsync_investors');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored investors', e);
      }
    }
    return SEED_INVESTORS;
  };

  const getLocalLogistics = (): LogisticsProfile[] => {
    const stored = localStorage.getItem('farmsync_logistics');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored logistics', e);
      }
    }
    return SEED_LOGISTICS;
  };

  // Get matching sub-profiles
  const farmerProfile: FarmerProfile | null = currentUser?.role === 'farmer'
    ? (getLocalFarmers().find(f => f.userId === currentUser.id) ||
       SEED_FARMERS.find(f => f.userId === currentUser.id) || {
        id: `farmer_${currentUser.id}`,
        userId: currentUser.id,
        village: 'Gudivada',
        district: 'Krishna',
        state: 'Andhra Pradesh',
        landSize: 3.5,
        soilType: 'Black Clay Loam',
        farmingExperience: 10,
        farmerType: 'Self-Funded',
        upiId: `${currentUser.fullName.toLowerCase().replace(/\s+/g, '')}@oksbi`,
        verificationStatus: currentUser.verificationStatus
      })
    : null;

  const fpoProfile: FPOProfile | null = currentUser?.role === 'fpo'
    ? (getLocalFPOs().find(f => f.userId === currentUser.id) ||
       SEED_FPOS.find(f => f.userId === currentUser.id) || {
        id: `fpo_${currentUser.id}`,
        userId: currentUser.id,
        fpoName: currentUser.fullName,
        registrationNumber: 'ROC/FPO/2026/001',
        registrationNumberMasked: 'ROC/FPO/****/001',
        registeredOffice: 'Agri Cooperative Yard, AP',
        district: 'East Godavari',
        state: 'Andhra Pradesh',
        contactPerson: currentUser.fullName,
        contactPhone: currentUser.phone,
        email: currentUser.email,
        memberFarmersCount: 250,
        coveredDistricts: ['East Godavari', 'West Godavari'],
        keyCrops: ['Mango', 'Paddy', 'Chilli'],
        verificationStatus: currentUser.verificationStatus
      })
    : null;

  const vendorProfile: VendorProfile | null = currentUser?.role === 'vendor'
    ? (getLocalVendors().find(v => v.userId === currentUser.id) ||
       SEED_VENDORS.find(v => v.userId === currentUser.id) || {
        id: `vendor_${currentUser.id}`,
        userId: currentUser.id,
        businessName: currentUser.fullName,
        ownerName: currentUser.fullName,
        businessAddress: 'APMC Market Yard Terminal',
        operatingCity: 'Vijayawada',
        operatingState: 'Andhra Pradesh',
        contactPhone: currentUser.phone,
        email: currentUser.email,
        businessRegistrationType: 'APMC License',
        registrationNumberMasked: '37AABCA****1Z9',
        mandiLicenseNumberMasked: 'APMC/VIJ/****998',
        operatingMandis: ['APMC Vijayawada Terminal'],
        handledCommodities: ['Tomato', 'Potato', 'Onion'],
        yearsInTrading: 5,
        antiGougingAgreementSigned: true,
        verificationStatus: currentUser.verificationStatus
      })
    : null;

  const buyerProfile: BuyerProfile | null = currentUser?.role === 'buyer'
    ? (getLocalBuyers().find(b => b.userId === currentUser.id) ||
       SEED_BUYERS.find(b => b.userId === currentUser.id) || {
        id: `buyer_${currentUser.id}`,
        userId: currentUser.id,
        businessName: currentUser.fullName,
        businessType: 'Wholesale & Supermarket Chain',
        buyerCategory: 'SUPERMARKET_CHAIN',
        verificationStatus: 'COMMERCIAL_APMC_VERIFIED',
        operatingCity: 'Vijayawada',
        deliveryAddress: 'Main Wholesale Market Yard, AP',
        maxAllowedOrderKg: 50000,
        resaleMarginCapPercent: 20
      })
    : null;

  const investorProfile: InvestorProfile | null = currentUser?.role === 'investor'
    ? (getLocalInvestors().find(i => i.userId === currentUser.id) ||
       SEED_INVESTORS.find(i => i.userId === currentUser.id) || {
        id: `investor_${currentUser.id}`,
        userId: currentUser.id,
        organizationName: currentUser.fullName,
        investorType: 'Agri Impact Fund & CSR',
        preferredSupportType: 'Both',
        allocatedBudget: 1500000,
        verificationStatus: currentUser.verificationStatus
      })
    : null;

  const logisticsProfile: LogisticsProfile | null = currentUser?.role === 'logistics'
    ? (getLocalLogistics().find(l => l.userId === currentUser.id) ||
       SEED_LOGISTICS.find(l => l.userId === currentUser.id) || {
        id: `logistics_${currentUser.id}`,
        userId: currentUser.id,
        companyName: currentUser.fullName,
        fleetSize: 12,
        vehicleTypes: ['Mini Truck (Tata Ace)', 'Reefer Truck (3 Ton)'],
        operatingDistricts: ['Krishna', 'Guntur', 'Hyderabad'],
        licenseNumber: 'LOG-AP-2026-1100',
        verificationStatus: currentUser.verificationStatus
      })
    : null;

  const login = async (email: string, requestedRole?: UserRole) => {
    setIsLoading(true);
    try {
      const users = getLocalUsers();
      let match = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!match && requestedRole) {
        match = users.find(u => u.role === requestedRole);
      }

      if (!match) {
        // Fallback or create user
        match = {
          id: `user_${Date.now()}`,
          email,
          role: requestedRole || 'farmer',
          fullName: email.split('@')[0],
          phone: '+91 98480 00000',
          isVerified: false,
          verificationStatus: 'PENDING',
          createdAt: new Date().toISOString()
        };
        const updated = [...users, match];
        saveLocalUsers(updated);
      }

      setCurrentUser(match);
      localStorage.setItem(AUTH_STORAGE_KEY, match.id);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const newUserId = `user_${Date.now()}`;
      const isVerified = false;
      const verificationStatus: VerificationStatus = 'PENDING';

      const newUser: UserProfile = {
        id: newUserId,
        email: data.email,
        role: data.role,
        fullName: data.fullName,
        phone: data.phone,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.fullName)}`,
        isVerified,
        verificationStatus,
        createdAt: new Date().toISOString(),
        maskedAadhaar: data.role === 'farmer' ? 'XXXX-XXXX-9901' : undefined,
        maskedGst: (data.role === 'vendor' || data.role === 'buyer' || data.role === 'fpo') ? '37AAACG****1Z2' : undefined,
        operatingLocation: data.village ? `${data.village}, ${data.district}, ${data.state}` : data.operatingCity || 'AP'
      };

      const existingUsers = getLocalUsers();
      const updatedUsers = [...existingUsers, newUser];
      saveLocalUsers(updatedUsers);

      // Store role-specific profiles
      if (data.role === 'farmer') {
        const newFarmer: FarmerProfile = {
          id: `farmer_${newUserId}`,
          userId: newUserId,
          village: data.village || 'Gudivada',
          district: data.district || 'Krishna',
          state: data.state || 'Andhra Pradesh',
          landSize: Number(data.landSize) || 2.0,
          soilType: data.soilType || 'Black Clay Loam',
          farmingExperience: Number(data.farmingExperience) || 5,
          farmerType: data.farmerType || 'Self-Funded',
          upiId: `${data.fullName.toLowerCase().replace(/\s+/g, '')}@oksbi`,
          verificationStatus: 'PENDING'
        };
        const currentFarmers = getLocalFarmers();
        localStorage.setItem('farmsync_farmers', JSON.stringify([...currentFarmers, newFarmer]));
      } else if (data.role === 'fpo') {
        const newFpo: FPOProfile = {
          id: `fpo_${newUserId}`,
          userId: newUserId,
          fpoName: data.fpoName || data.fullName,
          registrationNumber: data.registrationNumber || 'ROC/FPO/2026/889',
          registrationNumberMasked: 'ROC/FPO/****/889',
          registeredOffice: data.village ? `${data.village}, ${data.district}` : 'District Hub, AP',
          district: data.district || 'Krishna',
          state: data.state || 'Andhra Pradesh',
          contactPerson: data.fullName,
          contactPhone: data.phone,
          email: data.email,
          memberFarmersCount: Number(data.memberFarmersCount) || 120,
          coveredDistricts: [data.district || 'Krishna'],
          keyCrops: ['Paddy', 'Tomato', 'Chilli'],
          verificationStatus: 'PENDING'
        };
        const currentFpos = getLocalFPOs();
        localStorage.setItem('farmsync_fpos', JSON.stringify([...currentFpos, newFpo]));
      } else if (data.role === 'vendor') {
        const newVendor: VendorProfile = {
          id: `vendor_${newUserId}`,
          userId: newUserId,
          businessName: data.businessName || data.fullName,
          ownerName: data.fullName,
          businessAddress: data.deliveryAddress || 'APMC Market Yard Terminal',
          operatingCity: data.operatingCity || 'Vijayawada',
          operatingState: data.state || 'Andhra Pradesh',
          contactPhone: data.phone,
          email: data.email,
          businessRegistrationType: 'APMC License',
          registrationNumberMasked: '37AABCA****1Z9',
          mandiLicenseNumberMasked: data.mandiLicenseNumber ? `APMC/${data.mandiLicenseNumber.slice(-4)}` : 'APMC/VIJ/****881',
          operatingMandis: ['APMC Wholesale Yard'],
          handledCommodities: data.handledCommodities || ['Tomato', 'Potato', 'Onion'],
          yearsInTrading: 3,
          antiGougingAgreementSigned: true,
          verificationStatus: 'PENDING'
        };
        const currentVendors = getLocalVendors();
        localStorage.setItem('farmsync_vendors', JSON.stringify([...currentVendors, newVendor]));
      } else if (data.role === 'buyer') {
        const newBuyer: BuyerProfile = {
          id: `buyer_${newUserId}`,
          userId: newUserId,
          businessName: data.businessName || data.fullName,
          businessType: data.businessType || 'Wholesale',
          buyerCategory: 'SUPERMARKET_CHAIN',
          verificationStatus: 'UNVERIFIED',
          operatingCity: data.operatingCity || 'Vijayawada',
          deliveryAddress: data.deliveryAddress || 'Market Yard AP',
          maxAllowedOrderKg: 30000,
          resaleMarginCapPercent: 20
        };
        const currentBuyers = getLocalBuyers();
        localStorage.setItem('farmsync_buyers', JSON.stringify([...currentBuyers, newBuyer]));
      } else if (data.role === 'investor') {
        const newInvestor: InvestorProfile = {
          id: `investor_${newUserId}`,
          userId: newUserId,
          organizationName: data.organizationName || data.fullName,
          investorType: data.investorType || 'Agri Impact Fund',
          preferredSupportType: 'Both',
          allocatedBudget: 1000000,
          verificationStatus: 'PENDING'
        };
        const currentInvestors = getLocalInvestors();
        localStorage.setItem('farmsync_investors', JSON.stringify([...currentInvestors, newInvestor]));
      } else if (data.role === 'logistics') {
        const newLogistics: LogisticsProfile = {
          id: `logistics_${newUserId}`,
          userId: newUserId,
          companyName: data.companyName || data.fullName,
          fleetSize: Number(data.fleetSize) || 5,
          vehicleTypes: ['Mini Truck (Tata Ace)', 'Reefer Container'],
          operatingDistricts: ['Krishna', 'Guntur', 'Hyderabad'],
          licenseNumber: `LOG-AP-${Date.now().toString().slice(-4)}`,
          verificationStatus: 'PENDING'
        };
        const currentLogistics = getLocalLogistics();
        localStorage.setItem('farmsync_logistics', JSON.stringify([...currentLogistics, newLogistics]));
      }

      setCurrentUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, newUserId);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchRole = (role: UserRole, targetUserId?: string) => {
    const users = getLocalUsers();
    if (targetUserId) {
      const found = users.find(u => u.id === targetUserId);
      if (found) {
        setCurrentUser(found);
        localStorage.setItem(AUTH_STORAGE_KEY, found.id);
        return;
      }
    }
    const match = users.find(u => u.role === role) || SEED_USERS.find(u => u.role === role);
    if (match) {
      setCurrentUser(match);
      localStorage.setItem(AUTH_STORAGE_KEY, match.id);
    }
  };

  const updateCurrentUserProfile = (profileUpdate: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profileUpdate };
    setCurrentUser(updated);
    const users = getLocalUsers().map(u => u.id === updated.id ? updated : u);
    saveLocalUsers(users);
  };

  const requestRoleChange = async (requestedRole: UserRole, reason: string): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'Please login first' };
    
    // Mark roleChangePending on user
    updateCurrentUserProfile({ roleChangePending: true });

    return { 
      success: true, 
      message: `Role change request to "${requestedRole.toUpperCase()}" submitted to Admin Verification Center.` 
    };
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      user: currentUser,
      currentRole: currentUser?.role || null,
      farmerProfile,
      fpoProfile,
      vendorProfile,
      buyerProfile,
      investorProfile,
      logisticsProfile,
      isLoading,
      login,
      register,
      logout,
      switchRole,
      updateCurrentUserProfile,
      requestRoleChange
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
