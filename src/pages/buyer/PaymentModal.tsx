import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Order, PaymentMethod } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Lock, 
  Sparkles,
  Receipt
} from 'lucide-react';

interface PaymentModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ order, isOpen, onClose }) => {
  const { processPayment } = useData();
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('buyer@okhdfc');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidPayment, setPaidPayment] = useState<any | null>(null);

  if (!order) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const p = await processPayment(order.id, method);
      setIsProcessing(false);
      setPaidPayment(p);
    } catch (err) {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setPaidPayment(null);
        onClose();
      }}
      title="Secure Escrow Payment Gateway"
      subtitle={`Order ${order.orderNumber} • ${order.cropName} (${order.quantity} kg)`}
      maxWidth="md"
    >
      {paidPayment ? (
        <div className="py-6 space-y-5 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Payment Processed Successfully!</h3>
            <p className="text-xs text-slate-500 mt-1">Funds held safely in FarmSync Escrow until delivery verification</p>
          </div>

          {/* Receipt Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="font-bold text-slate-800">{paidPayment.transactionId}</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">Payment ID:</span>
              <span className="font-bold text-slate-800">{paidPayment.paymentId}</span>
            </div>
            <div className="flex justify-between pb-1 border-b border-slate-200">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-bold text-emerald-700">₹{paidPayment.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Method:</span>
              <span className="font-bold text-slate-800">{paidPayment.paymentMethod}</span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              setPaidPayment(null);
              onClose();
            }}
          >
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handlePay} className="space-y-4">
          
          {/* Amount Box */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Payable Amount</span>
              <span className="text-xs text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Escrow Protected Trade
              </span>
            </div>
            <span className="text-2xl font-black text-white">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'UPI' as PaymentMethod, label: 'UPI / QR', icon: Smartphone },
                { id: 'Escrow' as PaymentMethod, label: 'Agri Escrow', icon: ShieldCheck },
                { id: 'NetBanking' as PaymentMethod, label: 'Net Banking', icon: Building2 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      method === item.id
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1 text-emerald-700" />
                    <span className="text-xs block">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {method === 'UPI' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">UPI ID (VPA)</label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@bank"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {method === 'Escrow' && (
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Automated Smart Escrow
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Funds are reserved from your digital credit line and will be released to farmer {order.farmerName} only after you inspect and accept the harvested lot at your delivery hub.
              </p>
            </div>
          )}

          {method === 'NetBanking' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Select Bank</label>
              <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold">
                <option>State Bank of India (SBI)</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>NABARD Agri Trade Gateway</option>
              </select>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="harvest"
              size="md"
              className="w-full sm:w-auto"
              isLoading={isProcessing}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Simulate Pay ₹{order.totalAmount.toLocaleString('en-IN')}
            </Button>
          </div>

        </form>
      )}
    </Modal>
  );
};
