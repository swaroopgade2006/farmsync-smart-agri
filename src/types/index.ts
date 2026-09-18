export type UserRole = 'farmer' | 'fpo' | 'buyer' | 'vendor' | 'investor' | 'logistics' | 'admin';

export type VerificationStatus = 
  | 'NOT_VERIFIED' 
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'REVIEW_REQUIRED';

export type SourceType = 'FARMER' | 'FPO' | 'VENDOR';

export type FarmerType = 'Self-Funded' | 'Funded' | 'Free-Support';

export type OrderStatus = 
  | 'REQUESTED' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'HARVESTING' 
  | 'PICKUP' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type DeliveryStatus = 
  | 'Assigned' 
  | 'Pickup Scheduled' 
  | 'Picked Up' 
  | 'In Transit' 
  | 'Delivered';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export type PaymentMethod = 'UPI' | 'NetBanking' | 'Escrow' | 'Card' | 'Bank Transfer';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  name?: string;
  phone: string;
  avatarUrl?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationReason?: string;
  roleChangePending?: boolean;
  createdAt: string;
  // Masked privacy identifiers for verification badges
  maskedAadhaar?: string;
  maskedGst?: string;
  maskedPan?: string;
  maskedTradeLicense?: string;
  operatingLocation?: string;
  location?: string;
  vendorProfile?: VendorProfile;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  village: string;
  district: string;
  state: string;
  landSize: number; // in acres
  soilType: string;
  farmingExperience: number; // in years
  farmerType: FarmerType;
  upiId?: string;
  bankAccountLast4?: string;
  kisanCreditCardIdMasked?: string;
  pattaNumberMasked?: string;
  fpoMembershipId?: string;
  verificationStatus?: VerificationStatus;
}

export interface FPOProfile {
  id: string;
  userId: string;
  fpoName: string;
  registrationNumber: string; // e.g. ROC/FPO/2023/88921
  registrationNumberMasked?: string;
  registeredOffice: string;
  district: string;
  state: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  memberFarmersCount: number;
  coveredDistricts: string[];
  keyCrops: string[];
  bankAccountLast4?: string;
  verificationStatus: VerificationStatus;
}

export interface VendorProfile {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  businessAddress: string;
  operatingCity: string;
  operatingState: string;
  contactPhone: string;
  email: string;
  businessRegistrationType: 'APMC License' | 'GST Registered Trader' | 'FSSAI Wholesale' | 'Proprietorship';
  registrationNumberMasked: string; // e.g. 27AAPCU****1Z5
  mandiLicenseNumberMasked?: string; // e.g. APMC/VIJ/****998
  operatingMandis: string[];
  handledCommodities: string[];
  yearsInTrading: number;
  antiGougingAgreementSigned: boolean;
  verificationStatus: VerificationStatus;
}

export type BuyerCategory = 
  | 'DIRECT_CONSUMER' 
  | 'COMMERCIAL_WHOLESALER' 
  | 'APMC_TRADER' 
  | 'SUPERMARKET_CHAIN' 
  | 'FOOD_PROCESSOR' 
  | 'RESTAURANT_GROUP';

export type BuyerVerificationTier = 
  | 'UNVERIFIED' 
  | 'DIRECT_CONSUMER_VERIFIED' 
  | 'COMMERCIAL_APMC_VERIFIED' 
  | 'INSTITUTIONAL_VERIFIED' 
  | 'SUSPENDED_FOR_PRICE_GOUGING';

export type DeclaredEndUse = 
  | 'SELF_CONSUMPTION' 
  | 'RETAIL_DISTRIBUTION' 
  | 'FOOD_PROCESSING' 
  | 'COMMERCIAL_KITCHEN';

export interface BuyerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string; // Wholesale, Supermarket Chain, Food Processing, Restaurant Group, Direct Consumer
  buyerCategory: BuyerCategory;
  verificationStatus: BuyerVerificationTier;
  gstNumber?: string;
  gstNumberMasked?: string;
  tradeLicense?: string;
  apmcLicenseNumber?: string;
  fssaiNumber?: string;
  panCardNumber?: string;
  panCardMasked?: string;
  aadhaarNumberLast4?: string;
  aadhaarVerified?: boolean;
  antiResalePledgeSigned?: boolean;
  antiResalePledgeSignedAt?: string;
  maxAllowedOrderKg: number; // 50 for direct consumers, 50,000+ for verified commercial
  resaleMarginCapPercent: number; // e.g., 20% max allowed retail markup
  operatingCity: string;
  deliveryAddress: string;
}

export interface InvestorProfile {
  id: string;
  userId: string;
  organizationName: string;
  investorType: string; // Agri Impact Fund, CSR Trust, Philanthropic Foundation, Angel Investor
  preferredSupportType: 'Funded' | 'Free-Support' | 'Both';
  allocatedBudget: number;
  registrationNumberMasked?: string;
  verificationStatus?: VerificationStatus;
}

export interface LogisticsProfile {
  id: string;
  userId: string;
  companyName: string;
  fleetSize: number;
  vehicleTypes: string[];
  operatingDistricts: string[];
  licenseNumber: string;
  licenseNumberMasked?: string;
  verificationStatus?: VerificationStatus;
}

export interface Farm {
  id: string;
  farmerId: string;
  farmName: string;
  locationName: string;
  totalArea: number;
  soilPh?: number;
  waterSource?: string;
}

// ==========================================
// Crop & Provenance Types
// ==========================================
export interface PriceBreakdown {
  originalFarmerPrice?: number; // ₹/kg from original producer
  handlingFee?: number; // Platform / aggregation / handling ₹/kg
  logisticsFee?: number; // Transport / cold-chain ₹/kg
  vendorMarkup?: number; // In case of resale ₹/kg
  platformFee?: number; // Base platform commission ₹/kg
  finalBuyerPrice?: number; // Total ₹/kg paid by buyer
  isDirectFarmer?: boolean;
  notes?: string;
  farmerPrice?: number;
  handlingCost?: number;
  logisticsCost?: number;
  vendorMargin?: number;
  taxAndCess?: number;
  farmerPercentage?: number;
}

export interface Crop {
  id: string;
  batchId: string; // e.g. FS-TOM-2026-00124
  farmerId: string;
  farmerName: string;
  farmerVillage: string;
  farmerDistrict: string;
  farmerState: string;
  farmerVerified: boolean;
  farmerType: FarmerType;
  sourceType: SourceType; // 'FARMER' | 'FPO' | 'VENDOR'
  isFarmerDirect: boolean;
  isResale?: boolean;
  vendorName?: string;
  vendorId?: string;
  vendorMarkup?: number;
  originalFarmerPrice?: number;
  priceBreakdown?: PriceBreakdown;
  cropName: string;
  cropVariety: string;
  landArea: number; // acres
  sowingDate: string; // YYYY-MM-DD
  expectedHarvestDate: string; // YYYY-MM-DD
  actualHarvestDate?: string;
  estimatedQuantity: number; // kg
  availableQuantity: number; // kg
  pricePerKg: number; // INR
  cultivationCost: number; // INR
  farmingMethod: string; // Organic, Natural, Conventional, Zero-Budget
  location: string;
  imageUrl: string;
  growthStage: 'Sowing' | 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturing' | 'Harvest Ready';
  status: 'ACTIVE' | 'HARVESTING' | 'SOLD_OUT' | 'ARCHIVED';
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CropUpdate {
  id: string;
  cropId: string;
  updateDate: string;
  photoUrl?: string;
  growthStage: 'Sowing' | 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturing' | 'Harvest Ready';
  irrigationStatus: 'Drip Irrigation' | 'Canal Water' | 'Rainfed' | 'Sprinkler' | 'Needs Irrigation';
  pestObservations: string;
  notes: string;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerBusinessName: string;
  buyerVerified: boolean;
  cropType: string;
  requiredQuantity: number; // kg
  maxPricePerKg: number; // INR
  requiredByDate: string; // YYYY-MM-DD
  deliveryLocation: string;
  deliveryState: string;
  deliveryDistrict: string;
  status: 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
}

export interface AIMatchFactorBreakdown {
  cropScore: number; // Max 30
  quantityScore: number; // Max 20
  locationScore: number; // Max 15
  priceScore: number; // Max 15
  dateScore: number; // Max 20
  cropEvaluation: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
  quantityEvaluation: 'Excellent' | 'Good' | 'Moderate' | 'Shortfall';
  locationEvaluation: 'Excellent' | 'Good' | 'Moderate' | 'Far';
  priceEvaluation: 'Excellent' | 'Good' | 'Fair' | 'High';
  dateEvaluation: 'Excellent' | 'Good' | 'Tight' | 'Late';
  matchSummary: string;
}

export interface AIMatchResult {
  id: string;
  buyerRequirementId: string;
  cropId: string;
  crop: Crop;
  buyerRequirement: BuyerRequirement;
  overallScore: number; // 0 - 100
  factors: AIMatchFactorBreakdown;
  computedAt: string;
}

export interface AIHarvestEstimate {
  cropId: string;
  estimatedHarvestDate: string;
  daysRemaining: number;
  confidencePercentage: number;
  growthProgressPercentage: number;
  factorsUsed: {
    sowingDate: string;
    growthStage: string;
    irrigationStatus: string;
    pestRisk: string;
    weatherCondition: string;
    summary: string;
  };
}

export interface FundingAgreement {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerVillage: string;
  farmerDistrict: string;
  farmerState: string;
  investorId: string;
  investorName: string;
  organizationName: string;
  cropId?: string;
  cropName?: string;
  amount: number;
  agreementDate: string;
  terms: string;
  expectedReturnPercentage: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface SupportRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerVillage: string;
  sponsorId: string;
  sponsorName: string;
  organizationName: string;
  supportType: string; // Organic Fertilizers Kit, Solar Drip Setup, Hybrid Certified Seeds, Soil Health Card Testing
  supportValue: number; // INR monetary valuation
  description: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'DISBURSED' | 'UTILIZED';
}

export type FulfillmentType = 'DARK_STORE_EXPRESS' | 'FARM_BULK_STANDARD';

export interface DarkStoreInventoryItem {
  cropId: string;
  cropName: string;
  cropVariety: string;
  batchId: string;
  farmerName: string;
  farmerVillage: string;
  stockKg: number;
  packSizesAvailableKg: number[]; // e.g. [0.5, 1, 2, 5]
  pricePerKg: number;
  freshnessHarvestDate: string;
  qualityGrade: string;
  isOrganic?: boolean;
}

export interface CartItem {
  id: string; // unique item id e.g. `${cropId}_${packSizeKg}`
  cropId: string;
  cropName: string;
  cropVariety: string;
  imageUrl?: string;
  farmerName: string;
  farmerVillage?: string;
  batchId: string;
  packSizeKg: number; // weight of single pack e.g. 1
  quantity: number; // number of packs in cart
  pricePerKg: number;
  itemTotal: number; // quantity * packSizeKg * pricePerKg
  darkStoreId?: string;
  darkStoreName?: string;
}

export interface DarkStore {
  id: string;
  name: string;
  code: string; // e.g. DS-VIJ-01
  city: string;
  locality: string;
  pincode: string;
  address: string;
  lat: number;
  lng: number;
  operatingHours: string;
  deliveryRadiusKm: number;
  estimatedDeliveryMinutes: number; // e.g. 15-25 min
  isOpen: boolean;
  temperatureCelsius: number; // Cold vault temperature
  inventory: DarkStoreInventoryItem[];
  managerName: string;
  contactPhone: string;
  rating: number;
  activeRidersCount: number;
  coveredLocalities: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  batchId?: string;
  sourceType?: SourceType;
  isFarmerDirect?: boolean;
  sellerTypeTitle?: string; // e.g. "✓ Verified Farmer" or "✓ Verified Vendor"
  fulfillmentType?: FulfillmentType; // 'DARK_STORE_EXPRESS' | 'FARM_BULK_STANDARD'
  darkStoreId?: string;
  darkStoreName?: string;
  packSizeKg?: number;
  estimatedDeliveryMinutes?: number;
  riderName?: string;
  riderPhone?: string;
  buyerId: string;
  buyerName: string;
  buyerBusinessName: string;
  buyerPhone?: string;
  buyerVerificationTier?: BuyerVerificationTier;
  buyerApmcLicense?: string;
  buyerGstNumber?: string;
  buyerDeclaredEndUse?: DeclaredEndUse;
  antiGougingPledgeSigned?: boolean;
  maxPermissibleResalePricePerKg?: number; // MRP ceiling
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  vendorName?: string;
  vendorId?: string;
  cropId: string;
  cropName: string;
  cropVariety: string;
  quantity: number; // in kg
  unitPrice: number; // INR/kg
  totalAmount: number; // INR
  priceBreakdown?: PriceBreakdown;
  deliveryLocation: string;
  expectedDeliveryDate: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryOtp?: string; // 4-digit OTP for authenticated doorstep handover
  isOtpVerified?: boolean;
  otpVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  paymentId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentDate: string;
  paymentStatus: PaymentStatus;
}

export interface Delivery {
  id: string;
  deliveryId: string;
  orderId: string;
  orderNumber: string;
  fulfillmentType?: FulfillmentType;
  darkStoreId?: string;
  darkStoreName?: string;
  estimatedArrivalMins?: number;
  riderName?: string;
  riderPhone?: string;
  deliveryOtp?: string; // 4-digit OTP for authenticated doorstep handover
  isOtpVerified?: boolean;
  otpVerifiedAt?: string;
  logisticsId?: string;
  logisticsName?: string;
  pickupLocation: string;
  deliveryLocation: string;
  cropName: string;
  quantity: number;
  pickupDate?: string;
  deliveryDate?: string;
  status: DeliveryStatus;
  vehicleInfo?: string;
  vehiclePlate?: string;
  vehicleType?: string;
  driverName?: string;
  driverPhone?: string;
  trackingNotes?: string;
  telemetryState?: 'OPTIMAL' | 'MID_CASE_WARNING' | 'WORST_CASE_CRITICAL';
  initialTemperature?: number;
  humidity?: number;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'MATCH' | 'PAYMENT' | 'HARVEST' | 'FUNDING' | 'DELIVERY' | 'SYSTEM' | 'VERIFICATION';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface DemandSupplyGapData {
  cropName: string;
  demandKg: number;
  supplyKg: number;
  gapKg: number;
  averagePrice: number;
  urgency: 'HIGH' | 'MEDIUM' | 'BALANCED' | 'SURPLUS';
}

// ==========================================
// 1. Agro-Weather & AI Disaster Guard Types
// ==========================================
export interface DailyWeatherForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Thunderstorm' | 'Foggy' | 'Windy';
  icon: string;
  precipitationChance: number; // %
  rainfallMm: number;
  humidity: number; // %
  windSpeedKmh: number;
  solarRadiation: number; // MJ/m²
  uvIndex: number;
  farmingAdvisory: string;
  spraySuitability: 'Excellent' | 'Moderate' | 'Avoid - High Rain Risk' | 'Avoid - High Wind';
  irrigationRecommendation: 'Skip Irrigation' | 'Normal Irrigation' | 'Light Surface Irrigation' | 'Heavy Irrigation Needed';
}

export interface WeatherAlert {
  id: string;
  severity: 'WARNING' | 'ALERT' | 'INFO';
  title: string;
  description: string;
  affectedCrops: string[];
  actionableSteps: string[];
  validUntil: string;
}

// ==========================================
// 2. Soil Health & Fertilizer Calculator Types
// ==========================================
export interface SoilNutrientValue {
  name: string;
  value: number;
  unit: string;
  benchmarkLow: number;
  benchmarkHigh: number;
  status: 'Deficient' | 'Sufficient' | 'Excess';
}

export interface SoilHealthCard {
  id: string;
  farmerId: string;
  farmName: string;
  sampleDate: string;
  soilType: 'Alluvial Soil' | 'Black Cotton Soil' | 'Red Sandy Loam' | 'Laterite Soil' | 'Clay Loam';
  phLevel: number;
  electricalConductivity: number; // dS/m
  organicCarbonPercentage: number; // %
  overallHealthScore: number; // 0-100
  nitrogen: SoilNutrientValue;
  phosphorus: SoilNutrientValue;
  potassium: SoilNutrientValue;
  sulphur: SoilNutrientValue;
  zinc: SoilNutrientValue;
  boron: SoilNutrientValue;
  recommendations: string[];
}

export interface FertilizerCalculationResult {
  cropName: string;
  targetYieldTonsPerAcre: number;
  acreage: number;
  chemicalDosage: {
    ureaKg: number;
    dapKg: number;
    mopKg: number;
    zincSulphateKg: number;
    estimatedCost: number;
  };
  organicAlternative: {
    vermicompostKg: number;
    neemCakeKg: number;
    biofertilizersLitres: number;
    estimatedCost: number;
    carbonSavedKg: number;
  };
  schedule: {
    stage: string;
    dayRange: string;
    dosageInstructions: string;
  }[];
}

// ==========================================
// 3. SmartGrade AI - Quality Grading Types
// ==========================================
export interface QualityDefectMetric {
  defectName: string;
  severityPercentage: number;
  affectedAreaPercentage: number;
  isAcceptable: boolean;
}

export interface ProduceQualityInspection {
  id: string;
  cropName: string;
  variety: string;
  farmerId: string;
  farmerName: string;
  batchNumber: string;
  inspectionDate: string;
  grade: 'Grade A (Export / Premium)' | 'Grade B (Standard Wholesale)' | 'Grade C (Industrial / Pulping)';
  qualityScore: number; // 0-100
  sampleImageUrl: string;
  metrics: {
    averageDiameterMm: number;
    colorUniformityPercentage: number;
    moistureContentPercentage: number;
    brixSweetnessScore?: number;
    firmnessIndex: number;
    surfaceBlemishesPercentage: number;
  };
  defectsDetected: QualityDefectMetric[];
  estimatedShelfLifeDays: number;
  recommendedStorageTempC: string;
  certificateHash: string;
  marketPriceMultiplier: number;
}

// ==========================================
// 4. Forward Contract Farming Types
// ==========================================
export interface ForwardContract {
  id: string;
  contractNumber: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerLogoUrl?: string;
  cropName: string;
  varietyRequired: string;
  totalAcreageDemanded: number;
  committedAcreage: number;
  agreedPricePerKg: number; // INR
  mspBenchmarkPricePerKg: number; // INR
  bonusOverMspPercentage: number;
  deliveryWindowStart: string;
  deliveryWindowEnd: string;
  deliveryHubLocation: string;
  inputAssistanceProvided: string[]; // Seeds, Organic Fertilizers, Agronomist Visits
  advancePaymentPercentage: number;
  minQualityGrade: 'Grade A' | 'Grade B';
  status: 'OPEN' | 'FULLY_SUBSCRIBED' | 'IN_CULTIVATION' | 'FULFILLED';
  description: string;
  termsAndConditions: string[];
}

export interface ContractApplication {
  id: string;
  contractId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  proposedAcreage: number;
  estimatedOutputKg: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'ACTIVE' | 'HARVESTING' | 'COMPLETED' | 'REJECTED';
  advanceAmountPaid: number;
  contractAgreementDate?: string;
}

// ==========================================
// 5. Government Schemes & Subsidies Types
// ==========================================
export interface GovernmentScheme {
  id: string;
  schemeCode: string;
  title: string;
  ministry: string;
  category: 'Direct Financial Transfer' | 'Crop Insurance & Risk' | 'Farm Mechanization' | 'Solar & Irrigation' | 'Organic Farming' | 'Credit & Subsidies';
  financialBenefit: string;
  subsidyPercentage?: number;
  maxBenefitAmountInr?: number;
  targetBeneficiaries: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationMode: 'Online via FarmSync AI Portal' | 'State Agriculture Dept / CSC' | 'National DBT Portal';
  officialPortalUrl: string;
  status: 'ACTIVE' | 'ENROLLMENT_OPEN' | 'UPCOMING';
  isCentralScheme: boolean;
}

// ==========================================
// 6. Smart Escrow & Milestone Payment Types
// ==========================================
export interface EscrowMilestone {
  id: string;
  title: string;
  percentageOfTotal: number;
  amount: number;
  status: 'LOCKED' | 'READY_FOR_RELEASE' | 'RELEASED' | 'DISPUTED';
  releasedAt?: string;
  verificationEvidence?: string;
}

export interface SmartEscrowAccount {
  id: string;
  orderId: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  farmerName: string;
  totalAmount: number;
  lockedAmount: number;
  releasedAmount: number;
  status: 'INITIATED' | 'FUNDS_LOCKED' | 'INSPECTION_PASSED' | 'DISPATCH_CONFIRMED' | 'DELIVERED_SETTLED' | 'REFUNDED';
  disputeState?: 'NONE' | 'RAISED' | 'RESOLVED';
  milestones: EscrowMilestone[];
  createdAt: string;
  settledAt?: string;
}

// ==========================================
// 7. Cold Chain IoT Telemetry Types
// ==========================================
export interface ColdChainTelemetrySample {
  timestamp: string;
  ambientTempC: number;
  cargoCoreTempC: number;
  targetTempC: number;
  relativeHumidityPercent: number;
  targetHumidityPercent: number;
  ethylenePpm: number;
  vibrationG: number;
  batteryPercentage: number;
  doorOpenStatus: boolean;
  gpsLatitude: number;
  gpsLongitude: number;
  spoilageRiskIndex: 'OPTIMAL' | 'MODERATE_RISK' | 'CRITICAL_RISK';
}

// =========================================================================
// 8. FARMER, VENDOR & CROP VERIFICATION SYSTEM (NEW SPECIFICATION)
// =========================================================================

export type VerificationDocType = 
  | 'AADHAAR_CARD' 
  | 'LAND_PATTA_712' 
  | 'PM_KISAN_ID' 
  | 'FPO_REGISTRATION' 
  | 'APMC_LICENSE' 
  | 'GST_CERTIFICATE' 
  | 'PAN_CARD' 
  | 'TRADE_LICENSE' 
  | 'LOGISTICS_PERMIT' 
  | 'BANK_PASSBOOK';

export interface VerificationDocument {
  id: string;
  docType: VerificationDocType;
  type?: string; // alias
  title: string;
  maskedNumber: string; // e.g. XXXX-XXXX-4821 or 27AAPCU****1Z5
  documentNumberMasked?: string; // alias
  fileName: string;
  fileSize: string;
  uploadDate: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  userRole?: UserRole; // alias
  phone: string;
  email: string;
  location: string;
  village?: string;
  district?: string;
  state?: string;
  submittedAt: string;
  status: VerificationStatus;
  documents: VerificationDocument[];
  notes?: string;
  // Role-specific verification payload
  landDetails?: {
    acreage: number;
    surveyNumberMasked: string;
    soilType: string;
    waterSource: string;
  };
  vendorDetails?: {
    businessName: string;
    mandiLicense: string;
    gstinMasked: string;
    commodities: string[];
    operatingLocation: string;
  };
  fpoDetails?: {
    fpoName: string;
    regNumber: string;
    memberCount: number;
    headquarters: string;
  };
  buyerDetails?: {
    businessName: string;
    gstinMasked: string;
    apmcLicense: string;
    warehouseAddress: string;
  };
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface VerificationAuditLog {
  id: string;
  requestId?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  reviewerId: string;
  reviewerName: string;
  action: 'APPROVED' | 'REJECTED' | 'REQUESTED_INFO' | 'RESET' | 'ROLE_CHANGED' | 'FRAUD_FLAGGED';
  date: string;
  timestamp?: string; // alias
  previousStatus: VerificationStatus;
  newStatus: VerificationStatus;
  reason?: string;
  notes?: string; // alias
}

export interface RoleChangeRequest {
  id: string;
  userId: string;
  userName: string;
  currentRole: UserRole;
  requestedRole: UserRole;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  supportingDocuments?: any[];
}

export type BatchTimelineStage = 
  | 'FARM_SOWN' 
  | 'SOIL_TESTED'
  | 'AI_MONITORED' 
  | 'QUALITY_INSPECTED' 
  | 'HARVESTED' 
  | 'PACKAGED' 
  | 'PURCHASED_ESCROW'
  | 'LOGISTICS_PICKUP' 
  | 'COLD_CHAIN_TRANSIT' 
  | 'DELIVERED_BUYER';

export interface CropBatchTimelineEvent {
  id: string;
  stage: BatchTimelineStage;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  actorName: string;
  actorRole: UserRole | string;
  verified: boolean;
  status?: string;
  actor?: string;
  metadata?: Record<string, string | number>;
}

export interface CropBatch {
  id: string;
  batchId: string; // e.g. FS-TOM-2026-00124
  cropId: string;
  cropName: string;
  cropVariety: string;
  producerId: string;
  producerName: string;
  producerRole: 'farmer' | 'fpo' | 'vendor' | string;
  isFarmerDirect: boolean;
  farmLocation: string;
  village: string;
  district: string;
  state: string;
  sowingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string;
  initialQuantityKg: number;
  availableQuantityKg: number;
  currentPricePerKg: number;
  qualityGrade?: string; // e.g. Grade A (Export / Premium)
  currentStatus: 'CULTIVATION' | 'HARVESTED' | 'IN_TRANSIT' | 'DELIVERED' | 'SOLD_OUT';
  timeline: CropBatchTimelineEvent[];
  priceBreakdown: PriceBreakdown;
  qrCodeUrl: string;
  createdAt: string;
  updatedAt: string;
  // Aliases for component convenience
  farmerId?: string;
  farmerName?: string;
  variety?: string;
  quantity?: number;
  unit?: string;
  harvestDate?: string;
  farmerDirectPrice?: number;
  aiConfidence?: number;
  sourceType?: SourceType | string;
  isResale?: boolean;
}

export interface CropTransfer {
  id: string;
  batchId: string;
  cropName: string;
  fromEntityId: string;
  fromEntityName: string;
  fromRole: UserRole;
  toEntityId: string;
  toEntityName: string;
  toRole: UserRole;
  quantityKg: number;
  pricePerKg: number;
  transferDate: string;
  transferType: 'DIRECT_SALE' | 'VENDOR_PURCHASE' | 'VENDOR_RESALE' | 'RETAIL_DELIVERY';
  transactionReference: string;
}

export interface FraudAlert {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  ruleCode: string; // e.g. RULE_1_VENDOR_FALSE_FARMER_CLAIM
  ruleName: string;
  flagType?: string; // alias
  description: string;
  flaggedData: {
    key: string;
    value: string;
  }[];
  status: 'OPEN' | 'REVIEWED' | 'DISMISSED';
  flaggedAt: string;
  createdAt?: string; // alias
  reviewedAt?: string;
  reviewedBy?: string;
  actionTaken?: string;
}
