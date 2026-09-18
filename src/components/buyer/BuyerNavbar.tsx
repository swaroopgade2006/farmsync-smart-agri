import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { AppSwitcherModal } from '../common/AppSwitcherModal';
import { DarkStoreSelectorModal } from '../darkstore/DarkStoreSelectorModal';
import { 
  ShoppingBag, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  CheckCircle2, 
  Sparkles, 
  LayoutDashboard, 
  Package, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  MapPin, 
  Layers, 
  Sprout, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { Badge } from '../common/Badge';

import { useCart } from '../../context/CartContext';

export const BuyerNavbar: React.FC = () => {
  const { currentUser, logout, switchRole, buyerProfile } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, darkStores, getNearestDarkStore } = useData();
  const { isCartOpen, setIsCartOpen, itemCount, grandTotal } = useCart();
  const { t } = useLanguage();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [showDarkStoreModal, setShowDarkStoreModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(() => {
    return localStorage.getItem('farmsync_selected_darkstore_id') || darkStores[0]?.id || 'ds_vij_01';
  });
  const location = useLocation();
  const navigate = useNavigate();

  const activeStore = darkStores.find(s => s.id === selectedStoreId) || darkStores[0];

  const userNotifications = notifications.filter(
    n => n.userId === currentUser?.id || n.userId === `user_${currentUser?.id}` || n.userId === 'user_freshmart'
  );
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchToFarmer = () => {
    switchRole('farmer');
    navigate('/farmer');
  };

  const buyerNavLinks = [
    { name: t('nav.marketplace', 'Marketplace'), path: '/buyer/marketplace', icon: ShoppingBag },
    { name: '⚡ 15m Dark Stores', path: '/buyer/dark-stores', icon: Zap, highlight: true },
    { name: '📦 Dark Store Manager', path: '/dark-store/manage', icon: Package },
    { name: t('nav.mandiPrices', 'Mandi Forecast'), path: '/mandi-prices', icon: TrendingUp },
    { name: t('nav.aiMatches', 'AI Matches'), path: '/buyer/ai-recommendations', icon: Sparkles },
    { name: 'Batch Traceability', path: '/trace', icon: ShieldCheck },
    { name: t('nav.contractFarming', 'Forward Contracts'), path: '/contract-farming', icon: FileText },
    { name: t('nav.escrow', 'Escrow Gateway'), path: '/escrow', icon: ShieldCheck },
    { name: t('nav.orders', 'Orders & Radar'), path: '/buyer/orders', icon: Package },
    { name: t('nav.analytics', 'Demand Analytics'), path: '/buyer/demand-analytics', icon: TrendingUp },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & App Badge */}
            <div className="flex items-center space-x-3">
              <Link to="/buyer/marketplace" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                    FarmSync <span className="text-blue-600 font-black">Market</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded uppercase tracking-wider">
                      🛒 Buyer & QuickMart
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Hyperlocal Dark Store Location Selector Header Pill */}
            {activeStore && (
              <button
                onClick={() => setShowDarkStoreModal(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100/90 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 transition-all text-left group"
                title="Change Dark Store delivery hub"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800 group-hover:text-amber-900 leading-none">
                    <span>{activeStore.city} Hub</span>
                    <span className="text-[10px] font-bold text-emerald-600">⚡ 15m</span>
                  </div>
                  <span className="text-[10px] text-slate-500 truncate max-w-[130px] block leading-none mt-0.5">
                    {activeStore.name}
                  </span>
                </div>
              </button>
            )}

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              {buyerNavLinks.slice(0, 5).map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : link.highlight
                        ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 font-bold border border-amber-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative group">
                <button className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1">
                  More ▾
                </button>
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 hidden group-hover:block z-50 animate-fade-in">
                  {buyerNavLinks.slice(5).map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link
                    to="/buyer"
                    className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Buyer Dashboard
                  </Link>
                </div>
              </div>
            </div>

            {/* Desktop Right Actions */}
            <div className="flex items-center space-x-2.5">
              
              {/* App Switcher Button: SWITCH TO FARMER APP */}
              <button
                onClick={handleSwitchToFarmer}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-2xs group"
                title="Open Farmer KisanSetu App"
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span>Farmer App 🌾</span>
              </button>

              {/* Multi-Portal Switcher Modal Trigger */}
              <button
                onClick={() => setShowAppSwitcher(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Switch Apps & Portals"
                aria-label="App Switcher"
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all font-bold text-xs"
                title="Open Express Cart"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                    {itemCount}
                  </span>
                )}
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
                    <div className="p-3 bg-blue-50/50 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-800">Buyer & Delivery Alerts</span>
                        {unreadCount > 0 && (
                          <Badge variant="rose" size="sm">
                            {unreadCount} new
                          </Badge>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllNotificationsRead(currentUser?.id || 'user_freshmart')}
                          className="text-[11px] text-blue-700 hover:underline font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {userNotifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          No pending buyer alerts.
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
                              !n.isRead ? 'bg-blue-50/40' : ''
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

              {/* Buyer Profile Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-blue-50/80 border border-blue-200 transition-all"
                >
                  <img
                    src={currentUser?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=FreshMart`}
                    alt={currentUser?.fullName || 'FreshMart Buyer'}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-blue-500/40"
                  />
                  <div className="text-left hidden md:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                        {currentUser?.fullName || 'FreshMart'}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    </div>
                    <span className="text-[10px] font-medium text-blue-700">
                      🛒 Commercial Buyer
                    </span>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser?.fullName || 'FreshMart Supermarkets'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || 'procurement@freshmart.in'}</p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <Badge variant="blue" size="sm">APMC Commercial Verified</Badge>
                      </div>
                    </div>

                    <Link
                      to="/buyer/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 mr-2.5 text-slate-400" />
                      Buyer Profile & APMC KYC
                    </Link>

                    <Link
                      to="/dark-store/manage"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2.5 text-xs text-emerald-800 hover:bg-emerald-50 font-bold"
                    >
                      <Zap className="w-4 h-4 mr-2.5 text-emerald-600" />
                      Dark Store Stock & Ops
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleSwitchToFarmer();
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-xs text-emerald-800 hover:bg-emerald-50 font-semibold"
                    >
                      <Sprout className="w-4 h-4 mr-2.5 text-emerald-600" />
                      Open Farmer App 🌾
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
            
            {/* Quick Switch to Farmer App in Mobile Menu */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Switch to Farmer App</span>
                <span className="text-[11px] text-emerald-700">KisanSetu & Crop Lifecycle</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSwitchToFarmer();
                }}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
              >
                <span>Launch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Change Dark Store */}
            {activeStore && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowDarkStoreModal(true);
                }}
                className="w-full p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-left flex items-center justify-between text-xs font-bold text-amber-900"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Selected Dark Store: {activeStore.name}</span>
                </div>
                <span className="text-amber-700 text-[10px] underline">Change</span>
              </button>
            )}

            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Language / भाषा:</span>
              <LanguageSelector />
            </div>

            {buyerNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  location.pathname === link.path
                    ? 'bg-blue-600 text-white font-bold'
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

      {/* Dark Store Selector Modal */}
      <DarkStoreSelectorModal 
        isOpen={showDarkStoreModal} 
        onClose={() => setShowDarkStoreModal(false)}
        selectedStoreId={selectedStoreId}
        onSelectStore={(store) => {
          setSelectedStoreId(store.id);
          localStorage.setItem('farmsync_selected_darkstore_id', store.id);
          setShowDarkStoreModal(false);
        }}
      />
    </>
  );
};
