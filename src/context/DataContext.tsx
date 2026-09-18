import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Crop,
  CropUpdate,
  BuyerRequirement,
  Order,
  Payment,
  Delivery,
  FundingAgreement,
  SupportRecord,
  AppNotification,
  OrderStatus,
  DeliveryStatus,
  PaymentMethod,
  UserProfile,
  AIMatchResult,
  SoilHealthCard,
  ProduceQualityInspection,
  ForwardContract,
  ContractApplication,
  GovernmentScheme,
  SmartEscrowAccount,
  WeatherAlert,
  VerificationRequest,
  VerificationAuditLog,
  RoleChangeRequest,
  CropBatch,
  CropBatchTimelineEvent,
  CropTransfer,
  FraudAlert,
  VerificationStatus,
  UserRole,
  DarkStore,
  DarkStoreInventoryItem,
  FulfillmentType
} from '../types';
import {
  SEED_CROPS,
  SEED_CROP_UPDATES,
  SEED_BUYER_REQUIREMENTS,
  SEED_ORDERS,
  SEED_PAYMENTS,
  SEED_DELIVERIES,
  SEED_FUNDING_AGREEMENTS,
  SEED_SUPPORT_RECORDS,
  SEED_NOTIFICATIONS,
  SEED_USERS,
  SEED_SOIL_CARDS,
  SEED_QUALITY_INSPECTIONS,
  SEED_FORWARD_CONTRACTS,
  SEED_CONTRACT_APPLICATIONS,
  SEED_GOV_SCHEMES,
  SEED_ESCROW_ACCOUNTS,
  SEED_WEATHER_ALERTS,
  SEED_VERIFICATION_REQUESTS,
  SEED_VERIFICATION_AUDIT_LOGS,
  SEED_ROLE_CHANGE_REQUESTS,
  SEED_CROP_BATCHES,
  SEED_CROP_TRANSFERS,
  SEED_FRAUD_ALERTS,
  SEED_DARK_STORES
} from '../data/seedData';
import { calculateAIMatch } from '../services/aiEngine';
import confetti from 'canvas-confetti';

interface DataContextType {
  crops: Crop[];
  cropUpdates: CropUpdate[];
  buyerRequirements: BuyerRequirement[];
  orders: Order[];
  payments: Payment[];
  deliveries: Delivery[];
  fundingAgreements: FundingAgreement[];
  supportRecords: SupportRecord[];
  notifications: AppNotification[];
  users: UserProfile[];
  soilCards: SoilHealthCard[];
  qualityInspections: ProduceQualityInspection[];
  forwardContracts: ForwardContract[];
  contractApplications: ContractApplication[];
  govSchemes: GovernmentScheme[];
  escrowAccounts: SmartEscrowAccount[];
  weatherAlerts: WeatherAlert[];
  
  // Verification, Batch Traceability & Anti-Fraud State
  verificationRequests: VerificationRequest[];
  verificationAuditLogs: VerificationAuditLog[];
  roleChangeRequests: RoleChangeRequest[];
  cropBatches: CropBatch[];
  cropTransfers: CropTransfer[];
  fraudAlerts: FraudAlert[];

  // Dark Stores Hyperlocal Express Network
  darkStores: DarkStore[];
  getNearestDarkStore: (userLocation?: string) => DarkStore;
  getDarkStoreById: (storeId: string) => DarkStore | undefined;
  updateDarkStoreInventory: (storeId: string, cropId: string, quantityKg: number) => void;
  updateDarkStoreItemStock: (storeId: string, cropId: string, newStockKg: number, pricePerKg?: number) => void;
  addDarkStoreInventoryItem: (storeId: string, item: DarkStoreInventoryItem) => void;
  removeDarkStoreInventoryItem: (storeId: string, cropId: string) => void;
  updateDarkStoreDetails: (storeId: string, updates: Partial<DarkStore>) => void;
  createDarkStoreExpressOrder: (payload: {
    buyerId: string;
    buyerName: string;
    buyerBusinessName?: string;
    buyerPhone?: string;
    darkStoreId: string;
    cropId: string;
    cropName: string;
    cropVariety: string;
    packSizeKg: number;
    unitPrice: number;
    deliveryLocation: string;
    batchId?: string;
    farmerId?: string;
    farmerName?: string;
    farmerPhone?: string;
  }) => Promise<Order>;

  // Actions
  addCrop: (crop: Omit<Crop, 'id' | 'createdAt' | 'updatedAt' | 'availableQuantity' | 'batchId'> & { batchId?: string }) => Promise<Crop>;
  updateCrop: (id: string, update: Partial<Crop>) => void;
  deleteCrop: (id: string) => void;
  addCropUpdate: (update: Omit<CropUpdate, 'id'>) => Promise<CropUpdate>;
  addBuyerRequirement: (req: Omit<BuyerRequirement, 'id' | 'createdAt' | 'status'>) => Promise<BuyerRequirement>;
  createOrder: (order: {
    buyerId: string;
    buyerName: string;
    buyerBusinessName: string;
    buyerPhone?: string;
    farmerId: string;
    farmerName: string;
    farmerPhone?: string;
    cropId: string;
    cropName: string;
    cropVariety: string;
    quantity: number;
    unitPrice: number;
    deliveryLocation: string;
    expectedDeliveryDate: string;
    batchId?: string;
    sourceType?: 'FARMER' | 'FPO' | 'VENDOR';
    isFarmerDirect?: boolean;
    fulfillmentType?: FulfillmentType;
    darkStoreId?: string;
    darkStoreName?: string;
    packSizeKg?: number;
    estimatedDeliveryMinutes?: number;
    riderName?: string;
    riderPhone?: string;
    priceBreakdown?: any;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  processPayment: (orderId: string, method: PaymentMethod) => Promise<Payment>;
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus, notes?: string) => void;
  verifyDeliveryOtp: (orderIdOrDeliveryId: string, inputOtp: string) => Promise<{ success: boolean; message: string }>;
  createFundingAgreement: (agreement: Omit<FundingAgreement, 'id' | 'agreementDate' | 'status'>) => Promise<FundingAgreement>;
  createSupportRecord: (support: Omit<SupportRecord, 'id' | 'date' | 'status'>) => Promise<SupportRecord>;
  verifyUser: (userId: string, isVerified: boolean, status?: VerificationStatus, reason?: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  getMatchesForRequirement: (requirementId: string) => AIMatchResult[];
  getMatchesForCrop: (cropId: string) => AIMatchResult[];
  
  // Agri-Tech Actions
  addSoilHealthCard: (card: Omit<SoilHealthCard, 'id'>) => Promise<SoilHealthCard>;
  addQualityInspection: (insp: Omit<ProduceQualityInspection, 'id' | 'certificateHash'>) => Promise<ProduceQualityInspection>;
  applyForContract: (app: Omit<ContractApplication, 'id' | 'status' | 'advanceAmountPaid'>) => Promise<ContractApplication>;
  createForwardContract: (contract: Omit<ForwardContract, 'id' | 'contractNumber' | 'committedAcreage' | 'status'>) => Promise<ForwardContract>;
  advanceEscrowMilestone: (escrowId: string, milestoneId: string) => Promise<void>;

  // Verification & Traceability Actions
  submitVerificationRequest: (req: Omit<VerificationRequest, 'id' | 'submittedAt' | 'status'>) => Promise<VerificationRequest>;
  reviewVerificationRequest: (requestId: string, decision: 'APPROVED' | 'REJECTED' | 'REQUESTED_INFO', reason?: string, reviewerId?: string) => Promise<void>;
  submitRoleChangeRequest: (req: Omit<RoleChangeRequest, 'id' | 'submittedAt' | 'status'>) => Promise<RoleChangeRequest>;
  reviewRoleChangeRequest: (requestId: string, decision: 'APPROVED' | 'REJECTED', reason?: string) => Promise<void>;
  resolveFraudAlert: (alertId: string, action: 'REVIEWED' | 'DISMISSED', notes?: string) => Promise<void>;
  getCropBatchByBatchId: (batchId: string) => CropBatch | undefined;
  addBatchTimelineEvent: (batchId: string, event: Omit<CropBatchTimelineEvent, 'id' | 'timestamp'>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper for localStorage state persistence
function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crops, setCrops] = useStickyState<Crop[]>(SEED_CROPS, 'farmsync_v4_crops');
  const [cropUpdates, setCropUpdates] = useStickyState<CropUpdate[]>(SEED_CROP_UPDATES, 'farmsync_v4_crop_updates');
  const [buyerRequirements, setBuyerRequirements] = useStickyState<BuyerRequirement[]>(SEED_BUYER_REQUIREMENTS, 'farmsync_v4_requirements');
  const [orders, setOrders] = useStickyState<Order[]>(SEED_ORDERS, 'farmsync_v4_orders');
  const [payments, setPayments] = useStickyState<Payment[]>(SEED_PAYMENTS, 'farmsync_v4_payments');
  const [deliveries, setDeliveries] = useStickyState<Delivery[]>(SEED_DELIVERIES, 'farmsync_v4_deliveries');
  const [fundingAgreements, setFundingAgreements] = useStickyState<FundingAgreement[]>(SEED_FUNDING_AGREEMENTS, 'farmsync_v4_agreements');
  const [supportRecords, setSupportRecords] = useStickyState<SupportRecord[]>(SEED_SUPPORT_RECORDS, 'farmsync_v4_support');
  const [notifications, setNotifications] = useStickyState<AppNotification[]>(SEED_NOTIFICATIONS, 'farmsync_v4_notifications');
  const [users, setUsers] = useStickyState<UserProfile[]>(SEED_USERS, 'farmsync_v4_users');
  const [soilCards, setSoilCards] = useStickyState<SoilHealthCard[]>(SEED_SOIL_CARDS, 'farmsync_v4_soil_cards');
  const [qualityInspections, setQualityInspections] = useStickyState<ProduceQualityInspection[]>(SEED_QUALITY_INSPECTIONS, 'farmsync_v4_quality_inspections');
  const [forwardContracts, setForwardContracts] = useStickyState<ForwardContract[]>(SEED_FORWARD_CONTRACTS, 'farmsync_v4_forward_contracts');
  const [contractApplications, setContractApplications] = useStickyState<ContractApplication[]>(SEED_CONTRACT_APPLICATIONS, 'farmsync_v4_contract_apps');
  const [govSchemes] = useStickyState<GovernmentScheme[]>(SEED_GOV_SCHEMES, 'farmsync_v4_gov_schemes');
  const [escrowAccounts, setEscrowAccounts] = useStickyState<SmartEscrowAccount[]>(SEED_ESCROW_ACCOUNTS, 'farmsync_v4_escrow_accounts');
  const [weatherAlerts] = useStickyState<WeatherAlert[]>(SEED_WEATHER_ALERTS, 'farmsync_v4_weather_alerts');

  // Verification & Traceability State
  const [verificationRequests, setVerificationRequests] = useStickyState<VerificationRequest[]>(SEED_VERIFICATION_REQUESTS, 'farmsync_v4_ver_requests');
  const [verificationAuditLogs, setVerificationAuditLogs] = useStickyState<VerificationAuditLog[]>(SEED_VERIFICATION_AUDIT_LOGS, 'farmsync_v4_ver_audit_logs');
  const [roleChangeRequests, setRoleChangeRequests] = useStickyState<RoleChangeRequest[]>(SEED_ROLE_CHANGE_REQUESTS, 'farmsync_v4_role_changes');
  const [cropBatches, setCropBatches] = useStickyState<CropBatch[]>(SEED_CROP_BATCHES, 'farmsync_v4_batches');
  const [cropTransfers, setCropTransfers] = useStickyState<CropTransfer[]>(SEED_CROP_TRANSFERS, 'farmsync_v4_transfers');
  const [fraudAlerts, setFraudAlerts] = useStickyState<FraudAlert[]>(SEED_FRAUD_ALERTS, 'farmsync_v4_fraud_alerts');

  // Dark Stores Hyperlocal Express Network State
  const [darkStores, setDarkStores] = useStickyState<DarkStore[]>(SEED_DARK_STORES, 'farmsync_v4_dark_stores');

  // Notification helper
  const addNotification = (userId: string, title: string, message: string, type: AppNotification['type'], linkUrl?: string) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      linkUrl,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Add Crop (Auto creates unique batch ID and CropBatch record)
  const addCrop = async (cropData: Omit<Crop, 'id' | 'createdAt' | 'updatedAt' | 'availableQuantity' | 'batchId'> & { batchId?: string }): Promise<Crop> => {
    const cropPrefix = cropData.cropName.substring(0, 3).toUpperCase();
    const batchNumber = Math.floor(10000 + Math.random() * 90000);
    const batchId = cropData.batchId || `FS-${cropPrefix}-2026-${batchNumber}`;
    const newCropId = `crop_${Date.now()}`;

    const isFarmerDirect = cropData.sourceType !== 'VENDOR';
    const originalPrice = cropData.priceBreakdown?.originalFarmerPrice || cropData.pricePerKg;

    const newCrop: Crop = {
      ...cropData,
      id: newCropId,
      batchId,
      sourceType: cropData.sourceType || 'FARMER',
      isFarmerDirect,
      availableQuantity: cropData.estimatedQuantity,
      qrCodeUrl: `/trace/${batchId}`,
      priceBreakdown: cropData.priceBreakdown || {
        originalFarmerPrice: originalPrice,
        handlingFee: 0,
        logisticsFee: 0,
        platformFee: 0,
        finalBuyerPrice: cropData.pricePerKg,
        isDirectFarmer: isFarmerDirect
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCrops(prev => [newCrop, ...prev]);

    // Create corresponding digital batch
    const initialBatch: CropBatch = {
      id: `batch_${Date.now()}`,
      batchId,
      cropId: newCropId,
      cropName: newCrop.cropName,
      cropVariety: newCrop.cropVariety,
      producerId: newCrop.farmerId,
      producerName: newCrop.farmerName,
      producerRole: newCrop.sourceType === 'FPO' ? 'fpo' : newCrop.sourceType === 'VENDOR' ? 'vendor' : 'farmer',
      isFarmerDirect,
      farmLocation: newCrop.location,
      village: newCrop.farmerVillage,
      district: newCrop.farmerDistrict,
      state: newCrop.farmerState,
      sowingDate: newCrop.sowingDate,
      expectedHarvestDate: newCrop.expectedHarvestDate,
      initialQuantityKg: newCrop.estimatedQuantity,
      availableQuantityKg: newCrop.estimatedQuantity,
      currentPricePerKg: newCrop.pricePerKg,
      currentStatus: 'CULTIVATION',
      qrCodeUrl: `/trace/${batchId}`,
      priceBreakdown: newCrop.priceBreakdown!,
      timeline: [
        {
          id: `tl_${Date.now()}`,
          stage: 'FARM_SOWN',
          title: `Sowing Registered: ${newCrop.cropName} (${newCrop.cropVariety})`,
          description: `Cultivation initiated on ${newCrop.landArea} acres using ${newCrop.farmingMethod}. Batch ID ${batchId} assigned.`,
          timestamp: new Date().toISOString(),
          location: newCrop.location,
          actorName: newCrop.farmerName,
          actorRole: newCrop.sourceType === 'FPO' ? 'fpo' : newCrop.sourceType === 'VENDOR' ? 'vendor' : 'farmer',
          verified: newCrop.farmerVerified
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCropBatches(prev => [initialBatch, ...prev]);

    // Notify farmer
    addNotification(
      newCrop.farmerId.startsWith('user_') ? newCrop.farmerId : `user_${newCrop.farmerId}`,
      'Crop Batch Listed & Traceability Activated',
      `${newCrop.cropName} (${batchId}) listed on marketplace. Digital traceability QR generated.`,
      'HARVEST',
      `/farmer/crops/${newCrop.id}`
    );

    return newCrop;
  };

  const updateCrop = (id: string, update: Partial<Crop>) => {
    setCrops(prev => prev.map(c => c.id === id ? { ...c, ...update, updatedAt: new Date().toISOString() } : c));
  };

  const deleteCrop = (id: string) => {
    setCrops(prev => prev.filter(c => c.id !== id));
  };

  // Add Crop Update (Timeline entry & Batch sync)
  const addCropUpdate = async (updateData: Omit<CropUpdate, 'id'>): Promise<CropUpdate> => {
    const newUpdate: CropUpdate = {
      ...updateData,
      id: `update_${Date.now()}`
    };
    setCropUpdates(prev => [...prev, newUpdate]);

    // Also update crop's current stage
    updateCrop(updateData.cropId, { growthStage: updateData.growthStage });

    // Sync to CropBatch timeline
    const crop = crops.find(c => c.id === updateData.cropId);
    if (crop?.batchId) {
      addBatchTimelineEvent(crop.batchId, {
        stage: 'AI_MONITORED',
        title: `${updateData.growthStage} Progress Update`,
        description: `Irrigation: ${updateData.irrigationStatus}. Observations: ${updateData.pestObservations || updateData.notes || 'Normal growth'}`,
        location: crop.location,
        actorName: crop.farmerName,
        actorRole: crop.sourceType === 'FPO' ? 'fpo' : 'farmer',
        verified: crop.farmerVerified
      });
    }

    return newUpdate;
  };

  // Add Buyer Requirement
  const addBuyerRequirement = async (reqData: Omit<BuyerRequirement, 'id' | 'createdAt' | 'status'>): Promise<BuyerRequirement> => {
    const newReq: BuyerRequirement = {
      ...reqData,
      id: `req_${Date.now()}`,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
    setBuyerRequirements(prev => [newReq, ...prev]);
    return newReq;
  };

  // Dark Store Network Helpers
  const getNearestDarkStore = (userLocation?: string): DarkStore => {
    if (!userLocation) return darkStores[0] || SEED_DARK_STORES[0];
    const locLower = userLocation.toLowerCase();

    const matched = darkStores.find(ds => {
      if (ds.city.toLowerCase().includes(locLower) || locLower.includes(ds.city.toLowerCase())) return true;
      if (ds.locality.toLowerCase().includes(locLower) || locLower.includes(ds.locality.toLowerCase())) return true;
      return ds.coveredLocalities.some(c => locLower.includes(c.toLowerCase()) || c.toLowerCase().includes(locLower));
    });

    return matched || darkStores[0] || SEED_DARK_STORES[0];
  };

  const getDarkStoreById = (storeId: string): DarkStore | undefined => {
    return darkStores.find(ds => ds.id === storeId);
  };

  const updateDarkStoreInventory = (storeId: string, cropId: string, quantityKg: number) => {
    setDarkStores(prev => prev.map(store => {
      if (store.id !== storeId) return store;
      return {
        ...store,
        inventory: store.inventory.map(item => {
          if (item.cropId === cropId) {
            return {
              ...item,
              stockKg: Math.max(0, item.stockKg - quantityKg)
            };
          }
          return item;
        })
      };
    }));
  };

  const updateDarkStoreItemStock = (storeId: string, cropId: string, newStockKg: number, pricePerKg?: number) => {
    setDarkStores(prev => prev.map(store => {
      if (store.id !== storeId) return store;
      return {
        ...store,
        inventory: store.inventory.map(item => {
          if (item.cropId === cropId) {
            return {
              ...item,
              stockKg: Math.max(0, newStockKg),
              pricePerKg: pricePerKg !== undefined ? pricePerKg : item.pricePerKg
            };
          }
          return item;
        })
      };
    }));
  };

  const addDarkStoreInventoryItem = (storeId: string, newItem: DarkStoreInventoryItem) => {
    setDarkStores(prev => prev.map(store => {
      if (store.id !== storeId) return store;
      const existingIdx = store.inventory.findIndex(i => i.cropId === newItem.cropId);
      if (existingIdx >= 0) {
        const updatedInv = [...store.inventory];
        updatedInv[existingIdx] = {
          ...updatedInv[existingIdx],
          ...newItem,
          stockKg: updatedInv[existingIdx].stockKg + newItem.stockKg
        };
        return { ...store, inventory: updatedInv };
      }
      return {
        ...store,
        inventory: [newItem, ...store.inventory]
      };
    }));
  };

  const removeDarkStoreInventoryItem = (storeId: string, cropId: string) => {
    setDarkStores(prev => prev.map(store => {
      if (store.id !== storeId) return store;
      return {
        ...store,
        inventory: store.inventory.filter(i => i.cropId !== cropId)
      };
    }));
  };

  const updateDarkStoreDetails = (storeId: string, updates: Partial<DarkStore>) => {
    setDarkStores(prev => prev.map(store => {
      if (store.id !== storeId) return store;
      return {
        ...store,
        ...updates
      };
    }));
  };

  // Create Dark Store Express Order (15-30 min express delivery for home needs)
  const createDarkStoreExpressOrder = async (payload: {
    buyerId: string;
    buyerName: string;
    buyerBusinessName?: string;
    buyerPhone?: string;
    darkStoreId: string;
    cropId: string;
    cropName: string;
    cropVariety: string;
    packSizeKg: number;
    unitPrice: number;
    deliveryLocation: string;
    batchId?: string;
    farmerId?: string;
    farmerName?: string;
    farmerPhone?: string;
  }): Promise<Order> => {
    const store = getDarkStoreById(payload.darkStoreId) || darkStores[0];
    const item = store.inventory.find(i => i.cropId === payload.cropId);
    const orderNumber = `ORD-EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = Math.round(payload.packSizeKg * payload.unitPrice);
    const batchId = payload.batchId || item?.batchId || `FS-${payload.cropName.substring(0, 3).toUpperCase()}-2026-00124`;
    const farmerName = payload.farmerName || item?.farmerName || 'Verified Farm Producer';
    const riderName = `Rider #${Math.floor(1 + Math.random() * 12)} (${store.city} Fleet)`;
    const riderPhone = '+91 98480 ' + Math.floor(10000 + Math.random() * 90000);
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: Order = {
      id: `order_exp_${Date.now()}`,
      orderNumber,
      batchId,
      sourceType: 'FARMER',
      isFarmerDirect: true,
      sellerTypeTitle: `✓ Verified Dark Store (${store.name})`,
      fulfillmentType: 'DARK_STORE_EXPRESS',
      darkStoreId: store.id,
      darkStoreName: store.name,
      packSizeKg: payload.packSizeKg,
      estimatedDeliveryMinutes: store.estimatedDeliveryMinutes || 18,
      riderName,
      riderPhone,
      buyerId: payload.buyerId,
      buyerName: payload.buyerName,
      buyerBusinessName: payload.buyerBusinessName || 'Direct Consumer (Home Needs)',
      buyerPhone: payload.buyerPhone,
      farmerId: payload.farmerId || 'farmer_ravi',
      farmerName,
      farmerPhone: payload.farmerPhone,
      cropId: payload.cropId,
      cropName: payload.cropName,
      cropVariety: payload.cropVariety,
      quantity: payload.packSizeKg,
      unitPrice: payload.unitPrice,
      totalAmount,
      deliveryLocation: payload.deliveryLocation,
      expectedDeliveryDate: `Today (within ${store.estimatedDeliveryMinutes} mins)`,
      status: 'IN_TRANSIT',
      paymentStatus: 'Paid',
      deliveryOtp,
      isOtpVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Deduct stock from dark store
    updateDarkStoreInventory(store.id, payload.cropId, payload.packSizeKg);

    // Create immediate delivery record
    const newDelivery: Delivery = {
      id: `del_exp_${Date.now()}`,
      deliveryId: `DEL-EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      fulfillmentType: 'DARK_STORE_EXPRESS',
      darkStoreId: store.id,
      darkStoreName: store.name,
      estimatedArrivalMins: store.estimatedDeliveryMinutes,
      riderName,
      riderPhone,
      deliveryOtp,
      isOtpVerified: false,
      pickupLocation: store.address,
      deliveryLocation: payload.deliveryLocation,
      cropName: `${payload.cropName} (${payload.cropVariety} - ${payload.packSizeKg}kg Pack)`,
      quantity: payload.packSizeKg,
      pickupDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      status: 'In Transit',
      vehicleInfo: 'Fast EV Cargo Scooter',
      vehiclePlate: 'AP 16 EV 4902',
      vehicleType: 'EV 2-Wheeler Insulated Box',
      driverName: riderName,
      driverPhone: riderPhone,
      trackingNotes: `Dispatched from ${store.name} cold storage vault (${store.temperatureCelsius}°C). Doorstep delivery secured with 4-digit PIN handover.`,
      telemetryState: 'OPTIMAL',
      initialTemperature: store.temperatureCelsius,
      humidity: 85,
      updatedAt: new Date().toISOString()
    };

    setDeliveries(prev => [newDelivery, ...prev]);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    // Notifications
    addNotification(
      payload.buyerId.startsWith('user_') ? payload.buyerId : `user_${payload.buyerId}`,
      '⚡ Express Order Dispatched!',
      `Your home delivery order ${orderNumber} (${payload.cropName} ${payload.packSizeKg}kg) is dispatched from ${store.name}. Arriving in ~${store.estimatedDeliveryMinutes} mins!`,
      'DELIVERY',
      '/buyer/orders'
    );

    return newOrder;
  };

  // Create Order with Batch Traceability (Standard Vendor Bulk or Farm Direct)
  const createOrder = async (orderData: {
    buyerId: string;
    buyerName: string;
    buyerBusinessName: string;
    buyerPhone?: string;
    farmerId: string;
    farmerName: string;
    farmerPhone?: string;
    cropId: string;
    cropName: string;
    cropVariety: string;
    quantity: number;
    unitPrice: number;
    deliveryLocation: string;
    expectedDeliveryDate: string;
    batchId?: string;
    sourceType?: 'FARMER' | 'FPO' | 'VENDOR';
    isFarmerDirect?: boolean;
    fulfillmentType?: FulfillmentType;
    darkStoreId?: string;
    darkStoreName?: string;
    packSizeKg?: number;
    estimatedDeliveryMinutes?: number;
    riderName?: string;
    riderPhone?: string;
    priceBreakdown?: any;
  }): Promise<Order> => {
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = orderData.quantity * orderData.unitPrice;
    const crop = crops.find(c => c.id === orderData.cropId);
    const batchId = orderData.batchId || crop?.batchId || `FS-${orderData.cropName.substring(0, 3).toUpperCase()}-2026-00124`;
    const sourceType = orderData.sourceType || crop?.sourceType || 'FARMER';
    const isFarmerDirect = sourceType !== 'VENDOR';
    const fulfillmentType = orderData.fulfillmentType || 'FARM_BULK_STANDARD';
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      orderNumber,
      batchId,
      sourceType,
      isFarmerDirect,
      sellerTypeTitle: sourceType === 'FPO' ? '✓ Verified FPO' : sourceType === 'VENDOR' ? '✓ Verified Vendor' : '✓ Verified Farmer',
      fulfillmentType,
      darkStoreId: orderData.darkStoreId,
      darkStoreName: orderData.darkStoreName,
      packSizeKg: orderData.packSizeKg,
      estimatedDeliveryMinutes: orderData.estimatedDeliveryMinutes,
      riderName: orderData.riderName,
      riderPhone: orderData.riderPhone,
      buyerId: orderData.buyerId,
      buyerName: orderData.buyerName,
      buyerBusinessName: orderData.buyerBusinessName,
      buyerPhone: orderData.buyerPhone,
      farmerId: orderData.farmerId,
      farmerName: orderData.farmerName,
      farmerPhone: orderData.farmerPhone,
      cropId: orderData.cropId,
      cropName: orderData.cropName,
      cropVariety: orderData.cropVariety,
      quantity: orderData.quantity,
      unitPrice: orderData.unitPrice,
      totalAmount,
      priceBreakdown: orderData.priceBreakdown || crop?.priceBreakdown,
      deliveryLocation: orderData.deliveryLocation,
      expectedDeliveryDate: orderData.expectedDeliveryDate,
      status: 'REQUESTED',
      paymentStatus: 'Pending',
      deliveryOtp,
      isOtpVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // Reduce available quantity on crop
    setCrops(prev => prev.map(c => {
      if (c.id === orderData.cropId) {
        const remaining = Math.max(0, c.availableQuantity - orderData.quantity);
        return { 
          ...c, 
          availableQuantity: remaining,
          status: remaining === 0 ? 'SOLD_OUT' : c.status
        };
      }
      return c;
    }));

    // Add Timeline event to Batch
    addBatchTimelineEvent(batchId, {
      stage: 'PURCHASED_ESCROW',
      title: `Order Placed (${orderData.quantity} kg @ ₹${orderData.unitPrice}/kg)`,
      description: `${orderData.buyerBusinessName} submitted purchase request under Order ${orderNumber}. Escrow reservation initiated.`,
      location: orderData.deliveryLocation,
      actorName: orderData.buyerBusinessName,
      actorRole: 'buyer',
      verified: true
    });

    // Notify Farmer & Buyer
    addNotification(
      orderData.farmerId.startsWith('user_') ? orderData.farmerId : `user_${orderData.farmerId}`,
      'New Purchase Order Received',
      `${orderData.buyerBusinessName} has requested ${orderData.quantity} kg of ${orderData.cropName} (₹${totalAmount.toLocaleString('en-IN')}). Batch: ${batchId}.`,
      'ORDER',
      '/farmer/orders'
    );

    addNotification(
      orderData.buyerId.startsWith('user_') ? orderData.buyerId : `user_${orderData.buyerId}`,
      'Order Placed Successfully',
      `Order ${orderNumber} for ${orderData.cropName} placed (${isFarmerDirect ? 'Farmer Direct' : 'Vendor Resale'}). Awaiting acceptance.`,
      'ORDER',
      '/buyer/orders'
    );

    return newOrder;
  };

  // Update Order Status
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status, updatedAt: new Date().toISOString() };
        
        const buyerUid = o.buyerId.startsWith('user_') ? o.buyerId : `user_${o.buyerId}`;
        const farmerUid = o.farmerId.startsWith('user_') ? o.farmerId : `user_${o.farmerId}`;

        if (status === 'ACCEPTED') {
          addNotification(buyerUid, 'Order Accepted by Farmer', `Farmer ${o.farmerName} has accepted Order ${o.orderNumber}.`, 'ORDER', '/buyer/orders');
          if (o.batchId) {
            addBatchTimelineEvent(o.batchId, {
              stage: 'PACKAGED',
              title: `Order Accepted & Packing Scheduled`,
              description: `Farmer accepted Order ${o.orderNumber}. Preparing ${o.quantity} kg for dispatch.`,
              location: o.deliveryLocation,
              actorName: o.farmerName,
              actorRole: 'farmer',
              verified: true
            });
          }
        } else if (status === 'HARVESTING') {
          addNotification(buyerUid, 'Harvesting in Progress', `Harvesting commenced for ${o.cropName} (${o.orderNumber}).`, 'HARVEST', '/buyer/orders');
        } else if (status === 'PICKUP') {
          addNotification(buyerUid, 'Ready for Dispatch', `Order ${o.orderNumber} is packed and ready for logistics pickup.`, 'DELIVERY', '/buyer/orders');
          
          const delivNumber = `DEL-SWIFT-${Math.floor(1000 + Math.random() * 9000)}`;
          const assignedOtp = o.deliveryOtp || Math.floor(1000 + Math.random() * 9000).toString();
          const newDel: Delivery = {
            id: `del_${Date.now()}`,
            deliveryId: delivNumber,
            orderId: o.id,
            orderNumber: o.orderNumber,
            fulfillmentType: o.fulfillmentType || 'FARM_BULK_STANDARD',
            logisticsId: 'logistics_swift',
            logisticsName: 'SwiftAgri Logistics Network',
            pickupLocation: `${o.farmerName} Farm Depot`,
            deliveryLocation: o.deliveryLocation,
            cropName: `${o.cropName} (${o.cropVariety})`,
            quantity: o.quantity,
            pickupDate: new Date().toISOString().split('T')[0],
            deliveryDate: o.expectedDeliveryDate,
            status: 'Pickup Scheduled',
            deliveryOtp: assignedOtp,
            isOtpVerified: false,
            driverName: 'Kishore Varma',
            driverPhone: '+91 97000 11223',
            vehicleInfo: 'Reefer Mini Truck (AP 16 TX 4412)',
            trackingNotes: 'Scheduled pickup assigned. Handover will be authenticated with 4-digit buyer OTP.',
            updatedAt: new Date().toISOString()
          };
          setDeliveries(d => [newDel, ...d]);
        } else if (status === 'DELIVERED' || status === 'COMPLETED') {
          addNotification(buyerUid, 'Crops Delivered!', `Order ${o.orderNumber} has arrived at ${o.deliveryLocation}.`, 'DELIVERY', '/buyer/orders');
          addNotification(farmerUid, 'Delivery Completed', `Order ${o.orderNumber} delivered to ${o.buyerBusinessName}.`, 'DELIVERY', '/farmer/orders');
          
          // Sync matching delivery to Delivered
          setDeliveries(prevD => prevD.map(d => 
            (d.orderId === o.id || d.orderNumber === o.orderNumber) 
              ? { ...d, status: 'Delivered', isOtpVerified: true, otpVerifiedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } 
              : d
          ));

          if (o.batchId) {
            addBatchTimelineEvent(o.batchId, {
              stage: 'DELIVERED_BUYER',
              title: `Consignment Delivered to Buyer`,
              description: `Delivered ${o.quantity} kg to ${o.buyerBusinessName} at ${o.deliveryLocation}.`,
              location: o.deliveryLocation,
              actorName: o.fulfillmentType === 'DARK_STORE_EXPRESS' ? 'FarmSync Dark Store Express' : 'SwiftAgri Logistics Network',
              actorRole: 'logistics',
              verified: true
            });
          }
        }

        return updated;
      }
      return o;
    }));
  };

  // Process Payment
  const processPayment = async (orderId: string, method: PaymentMethod): Promise<Payment> => {
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const paymentId = `PAY-FS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const transactionId = `TXN-${method.toUpperCase()}-${Date.now().toString().slice(-8)}`;

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      paymentId,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      paymentMethod: method,
      transactionId,
      paymentDate: new Date().toISOString(),
      paymentStatus: 'Paid'
    };

    setPayments(prev => [newPayment, ...prev]);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: 'Paid' } : o));

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }

    const farmerUid = order.farmerId.startsWith('user_') ? order.farmerId : `user_${order.farmerId}`;
    const buyerUid = order.buyerId.startsWith('user_') ? order.buyerId : `user_${order.buyerId}`;

    addNotification(
      farmerUid,
      'Payment Received in Escrow',
      `₹${order.totalAmount.toLocaleString('en-IN')} received via ${method} for Order ${order.orderNumber}.`,
      'PAYMENT',
      '/farmer/orders'
    );

    addNotification(
      buyerUid,
      'Payment Successful',
      `Payment of ₹${order.totalAmount.toLocaleString('en-IN')} verified for ${order.cropName} (Txn: ${transactionId}).`,
      'PAYMENT',
      '/buyer/orders'
    );

    return newPayment;
  };

  // Update Delivery Status
  const updateDeliveryStatus = (deliveryId: string, status: DeliveryStatus, notes?: string) => {
    setDeliveries(prev => prev.map(d => {
      if (d.id === deliveryId) {
        const isDelivered = status === 'Delivered';
        const now = new Date().toISOString();
        const updated = {
          ...d,
          status,
          isOtpVerified: isDelivered ? true : d.isOtpVerified,
          otpVerifiedAt: isDelivered ? (d.otpVerifiedAt || now) : d.otpVerifiedAt,
          trackingNotes: notes || d.trackingNotes,
          updatedAt: now
        };

        let correspondingOrderStatus: OrderStatus | null = null;
        if (status === 'Picked Up' || status === 'In Transit') {
          correspondingOrderStatus = 'IN_TRANSIT';
        } else if (status === 'Delivered') {
          correspondingOrderStatus = 'DELIVERED';
        }

        if (correspondingOrderStatus) {
          setOrders(ordersList => ordersList.map(o => {
            if (o.id === d.orderId || o.orderNumber === d.orderNumber) {
              return { 
                ...o, 
                status: correspondingOrderStatus!,
                isOtpVerified: isDelivered ? true : o.isOtpVerified,
                otpVerifiedAt: isDelivered ? (o.otpVerifiedAt || now) : o.otpVerifiedAt,
                updatedAt: now 
              };
            }
            return o;
          }));
        }

        return updated;
      }
      return d;
    }));
  };

  // Verify Delivery Handover OTP
  const verifyDeliveryOtp = async (orderIdOrDeliveryId: string, inputOtp: string): Promise<{ success: boolean; message: string }> => {
    const matchedOrder = orders.find(o => o.id === orderIdOrDeliveryId || o.orderNumber === orderIdOrDeliveryId);
    const matchedDelivery = deliveries.find(d => 
      d.id === orderIdOrDeliveryId || 
      d.deliveryId === orderIdOrDeliveryId || 
      d.orderId === orderIdOrDeliveryId || 
      d.orderNumber === orderIdOrDeliveryId ||
      (matchedOrder && (d.orderId === matchedOrder.id || d.orderNumber === matchedOrder.orderNumber))
    );

    const expectedOtp = matchedOrder?.deliveryOtp || matchedDelivery?.deliveryOtp || '4829';

    if (inputOtp.trim() !== expectedOtp.trim()) {
      return {
        success: false,
        message: `Invalid OTP "${inputOtp}". Please enter the 4-digit handover PIN shown on the customer's order tracking screen.`
      };
    }

    const verifiedTimestamp = new Date().toISOString();

    // Update matching Order
    setOrders(prev => prev.map(o => {
      if (
        o.id === matchedOrder?.id || 
        o.orderNumber === matchedOrder?.orderNumber || 
        (matchedDelivery && (o.id === matchedDelivery.orderId || o.orderNumber === matchedDelivery.orderNumber))
      ) {
        return {
          ...o,
          status: 'DELIVERED',
          isOtpVerified: true,
          otpVerifiedAt: verifiedTimestamp,
          updatedAt: verifiedTimestamp
        };
      }
      return o;
    }));

    // Update matching Delivery
    setDeliveries(prev => prev.map(d => {
      if (
        d.id === matchedDelivery?.id || 
        d.deliveryId === matchedDelivery?.deliveryId || 
        (matchedOrder && (d.orderId === matchedOrder.id || d.orderNumber === matchedOrder.orderNumber))
      ) {
        return {
          ...d,
          status: 'Delivered',
          isOtpVerified: true,
          otpVerifiedAt: verifiedTimestamp,
          trackingNotes: `Doorstep delivery authenticated via 4-digit customer PIN handover (${expectedOtp}). Escrow release authorized.`,
          updatedAt: verifiedTimestamp
        };
      }
      return d;
    }));

    // Trigger confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const orderNumber = matchedOrder?.orderNumber || matchedDelivery?.orderNumber || 'Order';
    const buyerUid = matchedOrder?.buyerId?.startsWith('user_') 
      ? matchedOrder.buyerId 
      : `user_${matchedOrder?.buyerId || 'buyer_freshmart'}`;

    addNotification(
      buyerUid,
      '🎉 Handover OTP Verified & Delivery Confirmed!',
      `Doorstep handover for ${orderNumber} has been authenticated with your secret OTP. Produce inspection confirmed.`,
      'DELIVERY',
      '/buyer/orders'
    );

    return {
      success: true,
      message: 'OTP verified successfully! Doorstep delivery authenticated.'
    };
  };

  // Create Funding Agreement
  const createFundingAgreement = async (agreementData: Omit<FundingAgreement, 'id' | 'agreementDate' | 'status'>): Promise<FundingAgreement> => {
    const newAgreement: FundingAgreement = {
      ...agreementData,
      id: `fund_agr_${Date.now()}`,
      agreementDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    setFundingAgreements(prev => [newAgreement, ...prev]);

    const farmerUid = agreementData.farmerId.startsWith('user_') ? agreementData.farmerId : `user_${agreementData.farmerId}`;
    addNotification(
      farmerUid,
      'Funding Agreement Activated',
      `${agreementData.organizationName} committed ₹${agreementData.amount.toLocaleString('en-IN')} for your ${agreementData.cropName || 'crop cultivation'}.`,
      'FUNDING',
      '/farmer/support'
    );

    return newAgreement;
  };

  // Create Support Record
  const createSupportRecord = async (supportData: Omit<SupportRecord, 'id' | 'date' | 'status'>): Promise<SupportRecord> => {
    const newRecord: SupportRecord = {
      ...supportData,
      id: `sup_rec_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'DISBURSED'
    };
    setSupportRecords(prev => [newRecord, ...prev]);

    const farmerUid = supportData.farmerId.startsWith('user_') ? supportData.farmerId : `user_${supportData.farmerId}`;
    addNotification(
      farmerUid,
      'Free CSR Agricultural Grant Disbursed',
      `${supportData.organizationName} has granted "${supportData.supportType}" (Valued at ₹${supportData.supportValue.toLocaleString('en-IN')}).`,
      'FUNDING',
      '/farmer/support'
    );

    return newRecord;
  };

  // =========================================================================
  // VERIFICATION & AUDIT LOG ACTIONS
  // =========================================================================

  const verifyUser = (userId: string, isVerified: boolean, status: VerificationStatus = isVerified ? 'VERIFIED' : 'NOT_VERIFIED', reason?: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          isVerified,
          verificationStatus: status,
          verificationReason: reason,
          verifiedAt: isVerified ? new Date().toISOString() : undefined,
          verifiedBy: isVerified ? 'SIH Admin Officer' : undefined
        };
      }
      return u;
    }));

    setCrops(prev => prev.map(c => {
      if (c.farmerId === userId || `user_${c.farmerId}` === userId) {
        return { ...c, farmerVerified: isVerified };
      }
      return c;
    }));
  };

  const submitVerificationRequest = async (reqData: Omit<VerificationRequest, 'id' | 'submittedAt' | 'status'>): Promise<VerificationRequest> => {
    const newReq: VerificationRequest = {
      ...reqData,
      id: `ver_req_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'PENDING'
    };

    setVerificationRequests(prev => [newReq, ...prev]);

    // Update user status
    verifyUser(reqData.userId, false, 'PENDING');

    addNotification(
      reqData.userId.startsWith('user_') ? reqData.userId : `user_${reqData.userId}`,
      'Verification Application Submitted',
      'Your documents have been submitted to the Admin Verification Center for review.',
      'VERIFICATION',
      '/farmer/profile'
    );

    return newReq;
  };

  const reviewVerificationRequest = async (
    requestId: string,
    decision: 'APPROVED' | 'REJECTED' | 'REQUESTED_INFO',
    reason?: string,
    reviewerId: string = 'user_admin'
  ): Promise<void> => {
    const req = verificationRequests.find(r => r.id === requestId);
    if (!req) return;

    const previousStatus = req.status;
    const newStatus: VerificationStatus = 
      decision === 'APPROVED' ? 'VERIFIED' : 
      decision === 'REJECTED' ? 'REJECTED' : 'UNDER_REVIEW';

    // 1. Update Request
    setVerificationRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: newStatus,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'SIH Platform Administrator',
          rejectionReason: decision === 'REJECTED' ? reason : undefined,
          adminNotes: reason
        };
      }
      return r;
    }));

    // 2. Update User Profile & Crops
    verifyUser(req.userId, decision === 'APPROVED', newStatus, reason);

    // 3. Write Audit Log
    const auditLog: VerificationAuditLog = {
      id: `audit_log_${Date.now()}`,
      requestId,
      userId: req.userId,
      userName: req.userName,
      userRole: req.role,
      reviewerId,
      reviewerName: 'SIH Platform Administrator',
      action: decision,
      date: new Date().toISOString(),
      previousStatus,
      newStatus,
      reason: reason || (decision === 'APPROVED' ? 'Credentials verified against official databases.' : 'Information review complete.')
    };
    setVerificationAuditLogs(prev => [auditLog, ...prev]);

    // 4. Notify User
    const userUid = req.userId.startsWith('user_') ? req.userId : `user_${req.userId}`;
    if (decision === 'APPROVED') {
      addNotification(
        userUid,
        'Congratulations! Account Verified ✓',
        `Your ${req.role.toUpperCase()} account has been verified. Verified badges have been attached to all your listings.`,
        'VERIFICATION',
        '/farmer/profile'
      );
    } else if (decision === 'REJECTED') {
      addNotification(
        userUid,
        'Verification Application Requires Attention',
        `Your verification was not approved: ${reason || 'Document mismatch'}. Please resubmit corrected documents.`,
        'VERIFICATION',
        '/farmer/profile'
      );
    } else {
      addNotification(
        userUid,
        'Additional Information Requested',
        `Admin has requested more details: ${reason}. Please update your verification submission.`,
        'VERIFICATION',
        '/farmer/profile'
      );
    }
  };

  const submitRoleChangeRequest = async (reqData: Omit<RoleChangeRequest, 'id' | 'submittedAt' | 'status'>): Promise<RoleChangeRequest> => {
    const newReq: RoleChangeRequest = {
      ...reqData,
      id: `role_req_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'PENDING'
    };

    setRoleChangeRequests(prev => [newReq, ...prev]);

    setUsers(prev => prev.map(u => u.id === reqData.userId ? { ...u, roleChangePending: true } : u));

    addNotification(
      'user_admin',
      'New Role Change Request',
      `${reqData.userName} (${reqData.currentRole}) requested switch to ${reqData.requestedRole.toUpperCase()}.`,
      'SYSTEM',
      '/admin/verifications'
    );

    return newReq;
  };

  const reviewRoleChangeRequest = async (
    requestId: string,
    decision: 'APPROVED' | 'REJECTED',
    reason?: string
  ): Promise<void> => {
    const req = roleChangeRequests.find(r => r.id === requestId);
    if (!req) return;

    setRoleChangeRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: decision,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'SIH Platform Administrator',
          rejectionReason: decision === 'REJECTED' ? reason : undefined
        };
      }
      return r;
    }));

    if (decision === 'APPROVED') {
      setUsers(prev => prev.map(u => {
        if (u.id === req.userId) {
          return {
            ...u,
            role: req.requestedRole,
            roleChangePending: false,
            verificationStatus: 'UNDER_REVIEW' // Require verification for new role
          };
        }
        return u;
      }));

      // Log to audit
      const auditLog: VerificationAuditLog = {
        id: `audit_log_${Date.now()}`,
        userId: req.userId,
        userName: req.userName,
        userRole: req.requestedRole,
        reviewerId: 'user_admin',
        reviewerName: 'SIH Platform Administrator',
        action: 'ROLE_CHANGED',
        date: new Date().toISOString(),
        previousStatus: 'VERIFIED',
        newStatus: 'UNDER_REVIEW',
        reason: `Role changed from ${req.currentRole} to ${req.requestedRole}: ${req.reason}`
      };
      setVerificationAuditLogs(prev => [auditLog, ...prev]);
    } else {
      setUsers(prev => prev.map(u => u.id === req.userId ? { ...u, roleChangePending: false } : u));
    }

    addNotification(
      req.userId.startsWith('user_') ? req.userId : `user_${req.userId}`,
      decision === 'APPROVED' ? 'Role Change Approved' : 'Role Change Declined',
      decision === 'APPROVED' 
        ? `Your account role has been updated to ${req.requestedRole.toUpperCase()}. Please submit verification documents.` 
        : `Role change request declined: ${reason || 'Incomplete criteria'}`,
      'VERIFICATION'
    );
  };

  const resolveFraudAlert = async (alertId: string, action: 'REVIEWED' | 'DISMISSED', notes?: string) => {
    setFraudAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: action,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'SIH Platform Administrator',
          actionTaken: notes || `Marked as ${action}`
        };
      }
      return a;
    }));
  };

  const getCropBatchByBatchId = (batchId: string): CropBatch | undefined => {
    return cropBatches.find(b => b.batchId.toLowerCase() === batchId.toLowerCase());
  };

  const addBatchTimelineEvent = async (batchId: string, event: Omit<CropBatchTimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: CropBatchTimelineEvent = {
      ...event,
      id: `tl_ev_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setCropBatches(prev => prev.map(b => {
      if (b.batchId === batchId) {
        return {
          ...b,
          timeline: [...b.timeline, newEvent],
          updatedAt: new Date().toISOString()
        };
      }
      return b;
    }));
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = (userId: string) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, isRead: true } : n));
  };

  // AI Matching Helpers
  const getMatchesForRequirement = (requirementId: string): AIMatchResult[] => {
    const req = buyerRequirements.find(r => r.id === requirementId);
    if (!req) return [];

    return crops
      .filter(c => c.status === 'ACTIVE' && c.availableQuantity > 0)
      .map(crop => calculateAIMatch(crop, req))
      .sort((a, b) => b.overallScore - a.overallScore);
  };

  const getMatchesForCrop = (cropId: string): AIMatchResult[] => {
    const crop = crops.find(c => c.id === cropId);
    if (!crop) return [];

    return buyerRequirements
      .filter(r => r.status === 'OPEN')
      .map(req => calculateAIMatch(crop, req))
      .sort((a, b) => b.overallScore - a.overallScore);
  };

  // Agro-Tech Actions
  const addSoilHealthCard = async (cardData: Omit<SoilHealthCard, 'id'>): Promise<SoilHealthCard> => {
    const newCard: SoilHealthCard = {
      ...cardData,
      id: `soil_card_${Date.now()}`
    };
    setSoilCards(prev => [newCard, ...prev]);

    const farmerUid = cardData.farmerId.startsWith('user_') ? cardData.farmerId : `user_${cardData.farmerId}`;
    addNotification(
      farmerUid,
      'Soil Health Card Generated',
      `Health Score: ${newCard.overallHealthScore}/100. Fertilizer recommendations generated for ${newCard.farmName}.`,
      'SYSTEM',
      '/farmer/soil-health'
    );
    return newCard;
  };

  const addQualityInspection = async (inspData: Omit<ProduceQualityInspection, 'id' | 'certificateHash'>): Promise<ProduceQualityInspection> => {
    const certHash = `0x${Math.random().toString(16).substr(2, 8)}${Math.random().toString(16).substr(2, 8)}`;
    const newInsp: ProduceQualityInspection = {
      ...inspData,
      id: `grade_insp_${Date.now()}`,
      certificateHash: certHash
    };
    setQualityInspections(prev => [newInsp, ...prev]);

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }

    const farmerUid = inspData.farmerId.startsWith('user_') ? inspData.farmerId : `user_${inspData.farmerId}`;
    addNotification(
      farmerUid,
      'AI Quality Certificate Issued',
      `${inspData.cropName} (${inspData.batchNumber}) verified as ${inspData.grade} (${inspData.qualityScore}/100 score).`,
      'HARVEST',
      '/grading'
    );
    return newInsp;
  };

  const applyForContract = async (appData: Omit<ContractApplication, 'id' | 'status' | 'advanceAmountPaid'>): Promise<ContractApplication> => {
    const contract = forwardContracts.find(c => c.id === appData.contractId);
    const advanceAmount = contract ? (appData.proposedAcreage * 12000 * (contract.advancePaymentPercentage / 100)) : 15000;

    const newApp: ContractApplication = {
      ...appData,
      id: `app_fwd_${Date.now()}`,
      status: 'APPROVED',
      advanceAmountPaid: Math.round(advanceAmount),
      contractAgreementDate: new Date().toISOString().split('T')[0]
    };

    setContractApplications(prev => [newApp, ...prev]);

    setForwardContracts(prev => prev.map(c => {
      if (c.id === appData.contractId) {
        const newCommitted = Math.min(c.totalAcreageDemanded, c.committedAcreage + appData.proposedAcreage);
        const status = newCommitted >= c.totalAcreageDemanded ? 'FULLY_SUBSCRIBED' : c.status;
        return { ...c, committedAcreage: newCommitted, status };
      }
      return c;
    }));

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }

    const farmerUid = appData.farmerId.startsWith('user_') ? appData.farmerId : `user_${appData.farmerId}`;
    addNotification(
      farmerUid,
      'Forward Contract Agreement Approved!',
      `You have secured ${appData.proposedAcreage} acres under ${contract?.buyerCompany || 'Institutional Buyer'}. Mobilization advance of ₹${Math.round(advanceAmount).toLocaleString('en-IN')} approved.`,
      'FUNDING',
      '/contract-farming'
    );

    return newApp;
  };

  const createForwardContract = async (contractData: Omit<ForwardContract, 'id' | 'contractNumber' | 'committedAcreage' | 'status'>): Promise<ForwardContract> => {
    const contractNumber = `CTR-${contractData.buyerName.substring(0, 4).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newContract: ForwardContract = {
      ...contractData,
      id: `fwd_contract_${Date.now()}`,
      contractNumber,
      committedAcreage: 0,
      status: 'OPEN'
    };
    setForwardContracts(prev => [newContract, ...prev]);
    return newContract;
  };

  const advanceEscrowMilestone = async (escrowId: string, milestoneId: string): Promise<void> => {
    setEscrowAccounts(prev => prev.map(acc => {
      if (acc.id === escrowId) {
        let releasedIncrement = 0;
        const updatedMilestones = acc.milestones.map(m => {
          if (m.id === milestoneId && m.status !== 'RELEASED') {
            releasedIncrement = m.amount;
            return { ...m, status: 'RELEASED' as const, releasedAt: new Date().toISOString() };
          }
          return m;
        });

        const newReleased = acc.releasedAmount + releasedIncrement;
        const newLocked = Math.max(0, acc.totalAmount - newReleased);
        const allReleased = updatedMilestones.every(m => m.status === 'RELEASED');
        const newStatus = allReleased ? 'DELIVERED_SETTLED' as const : acc.status;

        const farmerUid = acc.farmerId.startsWith('user_') ? acc.farmerId : `user_${acc.farmerId}`;
        const buyerUid = acc.buyerId.startsWith('user_') ? acc.buyerId : `user_${acc.buyerId}`;

        addNotification(
          farmerUid,
          'Escrow Milestone Payment Released',
          `₹${releasedIncrement.toLocaleString('en-IN')} credited to your registered bank account for Order ${acc.orderNumber}.`,
          'PAYMENT',
          '/escrow'
        );

        addNotification(
          buyerUid,
          'Milestone Verified & Disbursed',
          `Milestone release of ₹${releasedIncrement.toLocaleString('en-IN')} authorized for Order ${acc.orderNumber}.`,
          'PAYMENT',
          '/escrow'
        );

        return {
          ...acc,
          milestones: updatedMilestones,
          releasedAmount: newReleased,
          lockedAmount: newLocked,
          status: newStatus,
          settledAt: allReleased ? new Date().toISOString() : acc.settledAt
        };
      }
      return acc;
    }));
  };

  return (
    <DataContext.Provider value={{
      crops,
      cropUpdates,
      buyerRequirements,
      orders,
      payments,
      deliveries,
      fundingAgreements,
      supportRecords,
      notifications,
      users,
      soilCards,
      qualityInspections,
      forwardContracts,
      contractApplications,
      govSchemes,
      escrowAccounts,
      weatherAlerts,
      verificationRequests,
      verificationAuditLogs,
      roleChangeRequests,
      cropBatches,
      cropTransfers,
      fraudAlerts,
      darkStores,
      getNearestDarkStore,
      getDarkStoreById,
      updateDarkStoreInventory,
      updateDarkStoreItemStock,
      addDarkStoreInventoryItem,
      removeDarkStoreInventoryItem,
      updateDarkStoreDetails,
      createDarkStoreExpressOrder,
      addCrop,
      updateCrop,
      deleteCrop,
      addCropUpdate,
      addBuyerRequirement,
      createOrder,
      updateOrderStatus,
      processPayment,
      updateDeliveryStatus,
      verifyDeliveryOtp,
      createFundingAgreement,
      createSupportRecord,
      verifyUser,
      markNotificationRead,
      markAllNotificationsRead,
      getMatchesForRequirement,
      getMatchesForCrop,
      addSoilHealthCard,
      addQualityInspection,
      applyForContract,
      createForwardContract,
      advanceEscrowMilestone,
      submitVerificationRequest,
      reviewVerificationRequest,
      submitRoleChangeRequest,
      reviewRoleChangeRequest,
      resolveFraudAlert,
      getCropBatchByBatchId,
      addBatchTimelineEvent
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
