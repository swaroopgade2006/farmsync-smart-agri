import React from 'react';
import { LiveMandiTicker } from '../components/common/LiveMandiTicker';
import { FarmerNavbar } from '../components/farmer/FarmerNavbar';
import { FarmerMobileDock } from '../components/farmer/FarmerMobileDock';
import { KisanMitraChatbot } from '../components/common/KisanMitraChatbot';

export const FarmerAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] text-slate-800">
      <LiveMandiTicker />
      <FarmerNavbar />
      <main className="flex-1 pb-20 xl:pb-10">
        {children}
      </main>
      <FarmerMobileDock />
      <KisanMitraChatbot />
    </div>
  );
};
