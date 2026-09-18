import React, { useState, useRef, useEffect } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  MapPin, 
  User, 
  Package, 
  Bike, 
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../common/Button';
import confetti from 'canvas-confetti';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  expectedOtp: string;
  recipientName: string;
  deliveryLocation: string;
  cropName: string;
  quantityKg: number;
  riderName?: string;
  onSuccess: (verifiedOtp: string) => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  expectedOtp,
  recipientName,
  deliveryLocation,
  cropName,
  quantityKg,
  riderName,
  onSuccess
}) => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  useEffect(() => {
    if (isOpen) {
      setOtpDigits(['', '', '', '']);
      setError(null);
      setIsVerifying(false);
      setIsSuccess(false);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (!cleanVal && value !== '') return;

    const char = cleanVal.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = char;
    setOtpDigits(newDigits);
    setError(null);

    // Auto advance focus to next digit
    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (pastedData) {
      const newDigits = ['', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setOtpDigits(newDigits);
      if (pastedData.length === 4) {
        inputRefs[3].current?.focus();
      } else {
        inputRefs[pastedData.length]?.current?.focus();
      }
    }
  };

  const enteredOtp = otpDigits.join('');

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (enteredOtp.length < 4) {
      setError('Please enter all 4 digits of the delivery OTP.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      if (enteredOtp.trim() === expectedOtp.trim()) {
        setIsSuccess(true);
        setIsVerifying(false);
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}

        setTimeout(() => {
          onSuccess(enteredOtp);
          onClose();
        }, 1200);
      } else {
        setIsVerifying(false);
        setError(`Invalid OTP "${enteredOtp}". Please ask the customer to check the 4-digit handover PIN in their FarmSync app.`);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-fade-in text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                Doorstep Delivery OTP Authentication
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">Order: {orderNumber}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consignment & Handover Details */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Recipient</span>
            <span className="font-bold text-slate-900">{recipientName}</span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">Drop Address</span>
            <span className="font-semibold text-slate-700 text-right truncate max-w-[220px]">
              {deliveryLocation}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Produce Item</span>
            <span className="font-black text-emerald-800">
              {quantityKg} kg • {cropName}
            </span>
          </div>
        </div>

        {/* Success State Animation */}
        {isSuccess ? (
          <div className="py-6 text-center space-y-2 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-base font-black text-emerald-800">OTP Verified Successfully!</h4>
            <p className="text-xs text-slate-500">
              Doorstep produce inspection confirmed and escrow payout authorized.
            </p>
          </div>
        ) : (
          /* OTP Input Form */
          <form onSubmit={handleVerify} className="space-y-4">
            
            <div className="text-center space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Enter 4-Digit Handover PIN from Customer
              </label>
              <p className="text-[11px] text-slate-400">
                Customer sees this on their order tracking screen
              </p>
            </div>

            {/* 4 Digit Box Inputs */}
            <div className="flex items-center justify-center gap-3">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-14 h-14 text-center text-2xl font-black rounded-2xl border transition-all ${
                    digit 
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-400/20' 
                      : 'border-slate-300 bg-white text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
              ))}
            </div>

            {/* Hint / Fast autofill helper for Demo convenience */}
            <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Customer's Secret OTP: <strong className="font-mono text-sm font-black text-blue-700 tracking-wider">{expectedOtp}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const chars = expectedOtp.slice(0, 4).split('');
                  setOtpDigits(chars);
                }}
                className="text-[10px] font-black text-blue-700 bg-white hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-300 transition-colors"
              >
                Autofill
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="harvest"
                size="md"
                disabled={enteredOtp.length < 4 || isVerifying}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black flex-1 shadow-md shadow-emerald-600/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isVerifying ? 'Authenticating...' : 'Verify OTP & Complete Delivery'}
              </Button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
