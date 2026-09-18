import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

// Layout Wrappers
import { FarmerAppLayout } from './layouts/FarmerAppLayout';
import { BuyerAppLayout } from './layouts/BuyerAppLayout';
import { PortalAppLayout } from './layouts/PortalAppLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Agri-Tech & Smart Intelligence Pages
import { AgroWeatherPage } from './pages/farmer/AgroWeatherPage';
import { SoilHealthPage } from './pages/farmer/SoilHealthPage';
import { ProduceGradingPage } from './pages/common/ProduceGradingPage';
import { ContractFarmingPage } from './pages/common/ContractFarmingPage';
import { GovSchemesPage } from './pages/common/GovSchemesPage';
import { EscrowSettlementPage } from './pages/common/EscrowSettlementPage';
import { ColdChainTelemetryPage } from './pages/logistics/ColdChainTelemetryPage';
import { CropTraceabilityPage } from './pages/common/CropTraceabilityPage';

// Farmer Pages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { MyCropsPage } from './pages/farmer/MyCropsPage';
import { AddCropPage } from './pages/farmer/AddCropPage';
import { CropDetailPage } from './pages/farmer/CropDetailPage';
import { CropDoctorPage } from './pages/farmer/CropDoctorPage';
import { FarmerOrdersPage } from './pages/farmer/FarmerOrdersPage';
import { FarmerSupportPage } from './pages/farmer/FarmerSupportPage';
import { FarmerProfilePage } from './pages/farmer/FarmerProfilePage';
import { FarmerMatchesPage } from './pages/farmer/FarmerMatchesPage';

// Buyer & Market Pages
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { Marketplace } from './pages/buyer/Marketplace';
import { AIRecommendationsPage } from './pages/buyer/AIRecommendationsPage';
import { BuyerOrdersPage } from './pages/buyer/BuyerOrdersPage';
import { DemandAnalyticsPage } from './pages/buyer/DemandAnalyticsPage';
import { BuyerProfilePage } from './pages/buyer/BuyerProfilePage';
import { MandiLivePricesPage } from './pages/buyer/MandiLivePricesPage';
import { DarkStoresPage } from './pages/buyer/DarkStoresPage';
import { DarkStoreInventoryManagerPage } from './pages/darkstore/DarkStoreInventoryManagerPage';
import { DarkStoreRiderAppPage } from './pages/darkstore/DarkStoreRiderAppPage';

// Sponsor Pages
import { SponsorDashboard } from './pages/sponsor/SponsorDashboard';
import { FarmerProjectsPage } from './pages/sponsor/FarmerProjectsPage';
import { AgreementsListPage } from './pages/sponsor/AgreementsListPage';
import { SupportRecordsPage } from './pages/sponsor/SupportRecordsPage';

// Logistics Pages
import { LogisticsDashboard } from './pages/logistics/LogisticsDashboard';
import { DeliveriesPage } from './pages/logistics/DeliveriesPage';
import { LiveFleetRadarPage } from './pages/logistics/LiveFleetRadarPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserVerificationPage } from './pages/admin/UserVerificationPage';
import { CropManagementPage } from './pages/admin/CropManagementPage';
import { OrderManagementPage } from './pages/admin/OrderManagementPage';
import { FundingManagementPage } from './pages/admin/FundingManagementPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

// Intelligent App Layout Switcher
const AppLayoutSwitch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { currentRole } = useAuth();

  const isFarmerRoute = location.pathname.startsWith('/farmer');
  const isBuyerRoute = 
    location.pathname.startsWith('/buyer') || 
    location.pathname === '/marketplace' || 
    location.pathname.startsWith('/dark-store') ||
    location.pathname.startsWith('/dark-stores');

  if (isFarmerRoute) {
    return <FarmerAppLayout>{children}</FarmerAppLayout>;
  }

  if (isBuyerRoute) {
    return <BuyerAppLayout>{children}</BuyerAppLayout>;
  }

  // Adaptive Shared Agri-Tech Tools
  const isSharedAgriTech = 
    location.pathname.startsWith('/trace') || 
    location.pathname.startsWith('/weather') || 
    location.pathname.startsWith('/grading') || 
    location.pathname.startsWith('/contract-farming') || 
    location.pathname.startsWith('/schemes') || 
    location.pathname.startsWith('/escrow') ||
    location.pathname.startsWith('/mandi-prices');

  if (isSharedAgriTech) {
    if (currentRole === 'farmer' || currentRole === 'fpo') {
      return <FarmerAppLayout>{children}</FarmerAppLayout>;
    }
    if (currentRole === 'buyer' || currentRole === 'vendor') {
      return <BuyerAppLayout>{children}</BuyerAppLayout>;
    }
  }

  return <PortalAppLayout>{children}</PortalAppLayout>;
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <Router>
              <AppLayoutSwitch>
                <Routes>
                  {/* Public & Auth */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  {/* Market & Core Agri-Tech Intelligence */}
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/dark-stores" element={<DarkStoresPage />} />
                  <Route path="/dark-stores/manage" element={<DarkStoreInventoryManagerPage />} />
                  <Route path="/dark-store/manage" element={<DarkStoreInventoryManagerPage />} />
                  <Route path="/dark-store/inventory" element={<DarkStoreInventoryManagerPage />} />
                  <Route path="/rider" element={<DarkStoreRiderAppPage />} />
                  <Route path="/dark-stores/rider" element={<DarkStoreRiderAppPage />} />
                  <Route path="/dark-store/rider" element={<DarkStoreRiderAppPage />} />
                  <Route path="/trace" element={<CropTraceabilityPage />} />
                  <Route path="/trace/:batchId" element={<CropTraceabilityPage />} />
                  <Route path="/mandi-prices" element={<MandiLivePricesPage />} />
                  <Route path="/weather" element={<AgroWeatherPage />} />
                  <Route path="/grading" element={<ProduceGradingPage />} />
                  <Route path="/contract-farming" element={<ContractFarmingPage />} />
                  <Route path="/schemes" element={<GovSchemesPage />} />
                  <Route path="/escrow" element={<EscrowSettlementPage />} />

                  {/* Farmer App (KisanSetu) */}
                  <Route path="/farmer" element={<FarmerDashboard />} />
                  <Route path="/farmer/crops" element={<MyCropsPage />} />
                  <Route path="/farmer/crops/new" element={<AddCropPage />} />
                  <Route path="/farmer/crops/:id" element={<CropDetailPage />} />
                  <Route path="/farmer/doctor" element={<CropDoctorPage />} />
                  <Route path="/farmer/soil-health" element={<SoilHealthPage />} />
                  <Route path="/farmer/orders" element={<FarmerOrdersPage />} />
                  <Route path="/farmer/support" element={<FarmerSupportPage />} />
                  <Route path="/farmer/profile" element={<FarmerProfilePage />} />
                  <Route path="/farmer/matches" element={<FarmerMatchesPage />} />

                  {/* Buyer App (FarmSync Market & QuickMart) */}
                  <Route path="/buyer" element={<BuyerDashboard />} />
                  <Route path="/buyer/marketplace" element={<Marketplace />} />
                  <Route path="/buyer/dark-stores" element={<DarkStoresPage />} />
                  <Route path="/buyer/requirements" element={<BuyerDashboard />} />
                  <Route path="/buyer/ai-recommendations" element={<AIRecommendationsPage />} />
                  <Route path="/buyer/orders" element={<BuyerOrdersPage />} />
                  <Route path="/buyer/demand-analytics" element={<DemandAnalyticsPage />} />
                  <Route path="/buyer/profile" element={<BuyerProfilePage />} />

                  {/* Investor / Sponsor Portal */}
                  <Route path="/sponsor" element={<SponsorDashboard />} />
                  <Route path="/sponsor/projects" element={<FarmerProjectsPage />} />
                  <Route path="/sponsor/agreements" element={<AgreementsListPage />} />
                  <Route path="/sponsor/support-records" element={<SupportRecordsPage />} />
                  <Route path="/sponsor/profile" element={<BuyerProfilePage />} />

                  {/* Logistics Portal */}
                  <Route path="/logistics" element={<LogisticsDashboard />} />
                  <Route path="/logistics/deliveries" element={<DeliveriesPage />} />
                  <Route path="/logistics/fleet-radar" element={<LiveFleetRadarPage />} />
                  <Route path="/logistics/tracking" element={<LiveFleetRadarPage />} />
                  <Route path="/logistics/cold-chain" element={<ColdChainTelemetryPage />} />
                  <Route path="/logistics/profile" element={<BuyerProfilePage />} />

                  {/* Admin Portal */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/verifications" element={<UserVerificationPage />} />
                  <Route path="/admin/crops" element={<CropManagementPage />} />
                  <Route path="/admin/orders" element={<OrderManagementPage />} />
                  <Route path="/admin/funding" element={<FundingManagementPage />} />
                  <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />

                  {/* Catch-all fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayoutSwitch>
            </Router>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
