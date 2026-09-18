import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Sprout, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle2, 
  Sparkles, 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  TrendingUp, 
  Truck, 
  ShieldCheck, 
  Package, 
  HeartHandshake, 
  Stethoscope, 
  Activity, 
  Navigation,
  Zap,
  Building2,
  Bike,
  LucideIcon 
} from 'lucide-react';
import { Badge } from './Badge';

interface NavLinkItem {
  name: string;
  path: string;
  icon?: LucideIcon;
  highlight?: boolean;
}

export const Navbar: React.FC = () => {
  const { currentUser, currentRole, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const { t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userNotifications = notifications.filter(
    n => n.userId === currentUser?.id || n.userId === `user_${currentUser?.id}`
  );
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = (): NavLinkItem[] => {
    if (!currentUser) {
      return [
        { name: t('nav.marketplace', 'Marketplace'), path: '/buyer/marketplace' },
        { name: '⚡ Dark Stores (15m)', path: '/dark-stores', icon: Zap, highlight: true },
        { name: 'Digital Traceability', path: '/trace', icon: ShieldCheck },
        { name: t('nav.weather', 'Agro-Weather'), path: '/weather' },
        { name: t('nav.grading', 'SmartGrade AI'), path: '/grading' },
        { name: t('nav.contractFarming', 'Forward Contracts'), path: '/contract-farming' },
        { name: t('nav.schemes', 'Gov Schemes'), path: '/schemes' },
        { name: t('nav.mandiPrices', 'Mandi Live Rates'), path: '/mandi-prices' },
        { name: t('nav.escrow', 'Smart Escrow'), path: '/escrow' },
      ];
    }

    switch (currentRole) {
      case 'farmer':
        return [
          { name: t('nav.dashboard', 'Dashboard'), path: '/farmer', icon: LayoutDashboard },
          { name: t('nav.myCrops', 'My Crops'), path: '/farmer/crops', icon: Sprout },
          { name: t('nav.soilHealth', 'Soil & Fertilizer'), path: '/farmer/soil-health', icon: Activity, highlight: true },
          { name: t('nav.weather', 'Agro-Weather'), path: '/weather', icon: TrendingUp },
          { name: t('nav.grading', 'SmartGrade AI'), path: '/grading', icon: Sparkles },
          { name: t('nav.contractFarming', 'Forward Contracts'), path: '/contract-farming', icon: FileText },
          { name: t('nav.cropDoctor', 'Crop Doctor'), path: '/farmer/doctor', icon: Stethoscope },
          { name: t('nav.aiMatches', 'AI Matches'), path: '/farmer/matches', icon: Sparkles },
          { name: t('nav.orders', 'Orders & Ledger'), path: '/farmer/orders', icon: Package },
          { name: 'Traceability', path: '/trace', icon: ShieldCheck },
          { name: t('nav.schemes', 'Gov Schemes'), path: '/schemes', icon: ShieldCheck },
          { name: t('nav.support', 'Funding & Grants'), path: '/farmer/support', icon: HeartHandshake },
        ];
      case 'fpo':
        return [
          { name: 'Collective Hub', path: '/farmer', icon: LayoutDashboard },
          { name: 'Member Lots', path: '/farmer/crops', icon: Sprout },
          { name: 'Traceability', path: '/trace', icon: ShieldCheck, highlight: true },
          { name: 'SmartGrade AI', path: '/grading', icon: Sparkles },
          { name: 'Forward Contracts', path: '/contract-farming', icon: FileText },
          { name: 'Pooled Orders', path: '/farmer/orders', icon: Package },
          { name: 'Agro-Weather', path: '/weather', icon: TrendingUp },
        ];
      case 'vendor':
        return [
          { name: 'Marketplace', path: '/buyer/marketplace', icon: ShoppingBag },
          { name: 'Resale Lots', path: '/buyer/orders', icon: Package },
          { name: 'Lot Traceability', path: '/trace', icon: ShieldCheck, highlight: true },
          { name: 'Forward Contracts', path: '/contract-farming', icon: FileText },
          { name: 'Smart Escrow', path: '/escrow', icon: ShieldCheck },
          { name: 'Mandi Rates', path: '/mandi-prices', icon: TrendingUp },
        ];
      case 'buyer':
        return [
          { name: t('nav.dashboard', 'Dashboard'), path: '/buyer', icon: LayoutDashboard },
          { name: t('nav.marketplace', 'Marketplace'), path: '/buyer/marketplace', icon: ShoppingBag },
          { name: '⚡ Dark Stores (15m)', path: '/buyer/dark-stores', icon: Zap, highlight: true },
          { name: '🛵 Rider App', path: '/rider', icon: Bike, highlight: true },
          { name: 'Digital Traceability', path: '/trace', icon: ShieldCheck },
          { name: t('nav.contractFarming', 'Forward Contracts'), path: '/contract-farming', icon: FileText },
          { name: t('nav.grading', 'SmartGrade AI'), path: '/grading', icon: Sparkles },
          { name: t('nav.escrow', 'Escrow Gateway'), path: '/escrow', icon: ShieldCheck },
          { name: t('nav.aiMatches', 'AI Matches'), path: '/buyer/ai-recommendations', icon: Sparkles },
          { name: t('nav.orders', 'Orders & Tracking'), path: '/buyer/orders', icon: Package },
          { name: t('nav.mandiPrices', 'Mandi Forecast'), path: '/mandi-prices', icon: TrendingUp },
          { name: t('nav.fleetRadar', 'Fleet Radar'), path: '/logistics/fleet-radar', icon: Navigation },
        ];
      case 'investor':
        return [
          { name: t('nav.dashboard', 'Dashboard'), path: '/sponsor', icon: LayoutDashboard },
          { name: t('nav.farmerProjects', 'Farmer Projects'), path: '/sponsor/projects', icon: Sprout },
          { name: 'Traceability', path: '/trace', icon: ShieldCheck },
          { name: t('nav.contractFarming', 'Forward Contracts'), path: '/contract-farming', icon: FileText },
          { name: t('nav.fundedAgreements', 'Funded Agreements'), path: '/sponsor/agreements', icon: TrendingUp },
          { name: t('nav.freeGrants', 'Free-Support Grants'), path: '/sponsor/support-records', icon: HeartHandshake },
          { name: t('nav.escrow', 'Escrow Vault'), path: '/escrow', icon: ShieldCheck },
        ];
      case 'logistics':
        return [
          { name: t('nav.dashboard', 'Dashboard'), path: '/logistics', icon: LayoutDashboard },
          { name: '🛵 Rider Partner App', path: '/rider', icon: Bike, highlight: true },
          { name: t('nav.deliveries', 'Deliveries'), path: '/logistics/deliveries', icon: Truck },
          { name: t('nav.coldChain', 'Cold-Chain IoT'), path: '/logistics/cold-chain', icon: Activity, highlight: true },
          { name: 'Batch Trace', path: '/trace', icon: ShieldCheck },
          { name: t('nav.fleetRadar', 'Live Fleet Radar'), path: '/logistics/fleet-radar', icon: Navigation },
        ];
      case 'admin':
        return [
          { name: t('nav.dashboard', 'Overview'), path: '/admin', icon: LayoutDashboard },
          { name: t('nav.verificationCenter', 'Verification Center'), path: '/admin/verifications', icon: ShieldCheck, highlight: true },
          { name: 'Digital Traceability', path: '/trace', icon: ShieldCheck },
          { name: t('nav.cropOversight', 'Crop Oversight'), path: '/admin/crops', icon: Sprout },
          { name: t('nav.orders', 'Orders'), path: '/admin/orders', icon: Package },
          { name: t('nav.escrow', 'Escrow Settlement'), path: '/escrow', icon: ShieldCheck },
          { name: t('nav.schemes', 'Gov Schemes'), path: '/schemes', icon: FileText },
          { name: t('nav.analytics', 'Market Analytics'), path: '/admin/analytics', icon: TrendingUp },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                  FarmSync <span className="text-emerald-600 font-bold">AI</span>
                </span>
                <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
                  Smart India Hackathon 2026
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold shadow-xs'
                      : link.highlight
                      ? 'text-purple-700 bg-purple-50/70 hover:bg-purple-100/70 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Selector Dropdown */}
            <LanguageSelector />

            {currentUser ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in">
                      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-800">Notifications</span>
                          {unreadCount > 0 && (
                            <Badge variant="rose" size="sm">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllNotificationsRead(currentUser.id)}
                            className="text-[11px] text-emerald-600 hover:underline font-medium"
                          >
                            {t('nav.markAllRead', 'Mark all read')}
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {userNotifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            No notifications right now.
                          </div>
                        ) : (
                          userNotifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markNotificationRead(n.id);
                                if (n.linkUrl) {
                                  navigate(n.linkUrl);
                                  setShowNotifications(false);
                                }
                              }}
                              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                                !n.isRead ? 'bg-emerald-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <p className="text-xs font-bold text-slate-800">{n.title}</p>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Pill */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2.5 p-1.5 rounded-2xl hover:bg-slate-100 border border-slate-200/80 transition-all"
                  >
                    <img
                      src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.fullName}`}
                      alt={currentUser.fullName}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-500/30"
                    />
                    <div className="text-left hidden md:block">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                          {currentUser.fullName}
                        </span>
                        {currentUser.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-emerald-700 capitalize">
                        {currentUser.role}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{currentUser.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <div className="mt-1">
                          <Badge variant={currentUser.isVerified ? 'emerald' : 'amber'} size="sm">
                            {currentUser.isVerified ? 'Verified Account' : 'Verification Pending'}
                          </Badge>
                        </div>
                      </div>

                      <Link
                        to={`/${currentRole}/profile`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 mr-2.5 text-slate-400" />
                        {t('nav.myProfile', 'My Profile & Verification')}
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        {t('nav.signOut', 'Sign Out')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 rounded-xl"
                >
                  {t('nav.signIn', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  {t('nav.getStarted', 'Get Started')}
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 animate-fade-in shadow-lg">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Language / भाषा:</span>
            <LanguageSelector />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                location.pathname === link.path
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {currentUser && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              {t('nav.signOut', 'Sign Out')}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
