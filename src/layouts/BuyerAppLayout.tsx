import React from 'react';
import { LiveMandiTicker } from '../components/common/LiveMandiTicker';
import { BuyerNavbar } from '../components/buyer/BuyerNavbar';
import { BuyerMobileDock } from '../components/buyer/BuyerMobileDock';
import { KisanMitraChatbot } from '../components/common/KisanMitraChatbot';
import { CartDrawer } from '../components/cart/CartDrawer';
import { FloatingCartBar } from '../components/cart/FloatingCartBar';

export const BuyerAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      <LiveMandiTicker />
      <BuyerNavbar />
      <main className="flex-1 pb-20 xl:pb-10">
        {children}
      </main>
      <FloatingCartBar />
      <CartDrawer />
      <BuyerMobileDock />
      <KisanMitraChatbot />
    </div>
  );
};
