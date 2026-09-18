import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { AppSwitcherModal } from '../common/AppSwitcherModal';
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
  Activity, 
  Stethoscope, 
  TrendingUp, 
  Package, 
  HeartHandshake, 
  ShieldCheck, 
  FileText,
  ShoppingBag,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const FarmerNavbar: React.FC = () => {
  const { currentUser, logout, switchRole } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const { t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const userNotifications = notifications.filter(
    n => n.userId === currentUser?.id || n.userId === `user_${currentUser?.id}` || n.userId === 'user_ravi'
  );
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchToBuyer = () => {
    switchRole('buyer');
    navigate('/buyer/marketplace');
  };

  const farmerNavLinks = [
    { name: t('nav.dashboard', 'Dashboard'), path: '/farmer', icon: LayoutDashboard },
    { name: t('nav.myCrops', 'My Crops'), path: '/farmer/crops', icon: Sprout },
    { name: t('nav.cropDoctor', 'Crop Doctor'), path: '/farmer/doctor', icon: Stethoscope, highlight: true },
    { name: t('nav.soilHealth', 'Soil & NPK Dosage'), path: '/farmer/soil-health', icon: Activity },
    { name: t('nav.weather', 'Agro-Weather'), path: '/weather', icon: TrendingUp },
    { name: t('nav.grading', 'SmartGrade AI'), path: '/grading', icon: Sparkles },
    { name: t('nav.contractFarming', 'Forward Contracts'), path: '/contract-farming', icon: FileText },
    { name: t('nav.aiMatches', 'AI Buyer Matches'), path: '/farmer/matches', icon: Sparkles },
    { name: t('nav.orders', 'Orders & Ledger'), path: '/farmer/orders', icon: Package },
    { name: t('nav.schemes', 'Gov Schemes'), path: '/schemes', icon: ShieldCheck },
    { name: t('nav.support', 'Funding & Grants'), path: '/farmer/support', icon: HeartHandshake },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & App Badge */}
            <div className="flex items-center space-x-3">
              <Link to="/farmer" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                    KisanSetu <span className="text-emerald-600 font-black">AI</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded uppercase tracking-wider">
                      🌾 Farmer App
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              {farmerNavLinks.slice(0, 7).map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : link.highlight
                        ? 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* More dropdown or secondary links */}
              <div className="relative group">
                <button className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">
                  More ▾
                </button>
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 hidden group-hover:block z-50 animate-fade-in">
                  {farmerNavLinks.slice(7).map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link
                    to="/trace"
                    className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    Batch Traceability
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop Right Actions */}
            <div className="flex items-center space-x-2.5">
              
              {/* App Switcher Button: SWITCH TO BUYER APP */}
              <button
                onClick={handleSwitchToBuyer}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all shadow-2xs group"
                title="Open Buyer & QuickMart App"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span>Buyer App 🛒</span>
              </button>

              {/* Multi-Portal Launcher Modal Trigger */}
              <button
                onClick={() => setShowAppSwitcher(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Switch Apps & Portals"
                aria-label="App Switcher"
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Language Selector */}
              <LanguageSelector />

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
                    <div className="p-3 bg-emerald-50/50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-800">Farmer Alerts & Orders</span>
                        {unreadCount > 0 && (
                          <Badge variant="rose" size="sm">
                            {unreadCount} new
                          </Badge>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllNotificationsRead(currentUser?.id || 'user_ravi')}
                          className="text-[11px] text-emerald-700 hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {userNotifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          No pending farmer alerts.
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

              {/* Farmer Profile Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-emerald-50/80 border border-emerald-200 transition-all"
                >
                  <img
                    src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=RaviKumar`}
                    alt={currentUser?.fullName || 'Farmer Ravi'}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-500/40"
                  />
                  <div className="text-left hidden md:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                        {currentUser?.fullName || 'Ravi Kumar'}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700">
                      🌾 Cultivator
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser?.fullName || 'Ravi Kumar'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || 'ravi.kumar@kisan.in'}</p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <Badge variant="emerald" size="sm">Land Record Verified</Badge>
                      </div>
                    </div>

                    <Link
                      to="/farmer/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 mr-2.5 text-slate-400" />
                      Farmer Profile & Land Records
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleSwitchToBuyer();
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-xs text-blue-700 hover:bg-blue-50 font-semibold"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2.5 text-blue-600" />
                      Open Buyer App 🛒
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 animate-fade-in shadow-lg">
            
            {/* Quick Switch to Buyer App in Mobile Menu */}
            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-900 block">Switch to Buyer App</span>
                <span className="text-[11px] text-blue-700">15m QuickMart & Wholesale</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSwitchToBuyer();
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
              >
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Language / भाषा:</span>
              <LanguageSelector />
            </div>

            {farmerNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  location.pathname === link.path
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* App Switcher Modal */}
      <AppSwitcherModal isOpen={showAppSwitcher} onClose={() => setShowAppSwitcher(false)} />
    </>
  );
};
