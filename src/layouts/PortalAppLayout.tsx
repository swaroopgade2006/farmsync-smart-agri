import React from 'react';
import { useLocation } from 'react-router-dom';
import { LiveMandiTicker } from '../components/common/LiveMandiTicker';
import { Navbar } from '../components/common/Navbar';
import { MobileNavDock } from '../components/common/MobileNavDock';
import { KisanMitraChatbot } from '../components/common/KisanMitraChatbot';

export const PortalAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8] text-slate-800">
      <LiveMandiTicker />
      {!isAuthPage && <Navbar />}
      <main className="flex-1 pb-20 lg:pb-10">
        {children}
      </main>
      <MobileNavDock />
      <KisanMitraChatbot />
    </div>
  );
};
