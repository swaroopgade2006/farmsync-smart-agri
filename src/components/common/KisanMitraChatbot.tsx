import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Bot, 
  X, 
  Send, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Mic, 
  MicOff, 
  Sprout, 
  ShoppingCart, 
  HelpCircle,
  ArrowRight,
  Languages,
  CheckCircle2,
  CloudSun,
  FlaskConical,
  Award,
  FileText,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    path: string;
  };
  detailsList?: string[];
}

export const KisanMitraChatbot: React.FC = () => {
  const { currentUser, currentRole } = useAuth();
  const { crops, buyerRequirements } = useData();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: currentLanguage === 'hi'
        ? `नमस्ते ${currentUser?.fullName || 'किसान बंधु'}! मैं किसान मित्र एआई 🌾 हूँ, आपका 24/7 कृषि सहायक। मैं आज आपकी क्या सहायता कर सकता हूँ?`
        : currentLanguage === 'te'
        ? `నమస్కారం ${currentUser?.fullName || 'రైతు మిత్రమా'}! నేను కిసాన్ మిత్ర AI 🌾. మీకు ఎలా సహాయపడగలను?`
        : currentLanguage === 'ml'
        ? `നമസ്കാരം ${currentUser?.fullName || 'കർഷക സുഹൃത്തേ'}! ഞാൻ കിസാൻ മിത്ര AI 🌾. നിങ്ങളെ എങ്ങനെ സഹായിക്കണം?`
        : `Namaste ${currentUser?.fullName || 'Kisan Bandhu'}! I am Kisan Mitra AI 🌾, your 24/7 agricultural assistant. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButton: {
        label: 'Explore AI Crop Doctor',
        path: '/farmer/doctor'
      }
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // AI Intent Classifier
    setTimeout(() => {
      const q = text.toLowerCase();
      let botResponse: ChatMessage;

      if (q.includes('weather') || q.includes('rain') || q.includes('मौसम') || q.includes('వాతావరణం') || q.includes('spray')) {
        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `🌦️ **Agro-Weather Advisory Active**: Hyperlocal satellite forecast predicts optimal pesticide spraying window for next 24-48 hours. Rain alert in coastal areas from Thursday.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'Open Agro-Weather & Radar',
            path: '/weather'
          }
        };
      } else if (q.includes('soil') || q.includes('fertilizer') || q.includes('खाद') || q.includes('ఎరువులు') || q.includes('npk')) {
        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `🧪 **Soil Health & Nutrient Advisor**: Your plot test shows Nitrogen deficit and balanced Phosphorus. Use the AI Dosage Calculator to compute exact Neem-coated Urea & Vermicompost requirements.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'Calculate Fertilizer Dosage',
            path: '/farmer/soil-health'
          }
        };
      } else if (q.includes('grade') || q.includes('quality') || q.includes('गुणवत्ता') || q.includes('క్వాలిటీ')) {
        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `🔍 **SmartGrade AI Quality Scanner**: Scan your harvest with Computer Vision to calculate size uniformity, surface blemish % and generate an official Digital Quality Certificate for buyers.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'Scan Harvest Quality',
            path: '/grading'
          }
        };
      } else if (q.includes('contract') || q.includes('itc') || q.includes('pepsi') || q.includes('अनुबंध') || q.includes('ఒప్పందం')) {
        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `📜 **Forward Contract Farming**: Corporate buyers (ITC, PepsiCo) have published open contracts offering guaranteed MSP+ bonuses up to 42% with 25% upfront mobilization advance.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'Browse Forward Contracts',
            path: '/contract-farming'
          }
        };
      } else if (q.includes('scheme') || q.includes('pm-kisan') || q.includes('subsidy') || q.includes('योजना') || q.includes('పథకాలు')) {
        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `🏛️ **Government Subsidies & Schemes**: Explore PM-KISAN, PMFBY Crop Insurance, and 60% Solar Pump subsidies with our 1-click eligibility finder quiz.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'Check Scheme Eligibility',
            path: '/schemes'
          }
        };
      } else if (q.includes('escrow') || q.includes('payment') || q.includes('भुगतान') || q.includes('డబ్బులు')) {
        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `🔒 **Smart Escrow Protection**: All payments are locked securely in RBI-compliant escrow and disbursed in verified stages upon harvest grading and delivery OTP confirmation.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'View Escrow Vault',
            path: '/escrow'
          }
        };
      } else if (q.includes('price') || q.includes('rate') || q.includes('mandi') || q.includes('tomato') || q.includes('chilli')) {
        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `📊 **Live Mandi Rates**: Tomato (Arka Rakshak) trading at ₹28-32/kg in APMC hubs. Green Chilli (Guntur Teja) trading strong at ₹55-60/kg.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'View Live Mandi Tracker',
            path: '/mandi-prices'
          }
        };
      } else {
        botResponse = {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: `I understand your query regarding "${text}". FarmSync AI connects verified farmers directly with wholesale off-takers, institutional forward contracts, and precision agro-weather advisories.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: 'Go to Marketplace',
            path: '/buyer/marketplace'
          }
        };
      }

      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleSimulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSend('What is the live market price of Tomato today?');
    }, 1500);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-5 z-50 bg-gradient-to-tr from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group ring-4 ring-emerald-300/30 animate-pulse-subtle"
          aria-label="Ask Kisan Mitra AI"
        >
          <Bot className="w-6 h-6" />
          <span className="text-xs font-bold hidden sm:inline tracking-wide">
            Kisan Mitra AI
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping" />
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[580px] h-[520px] animate-fade-in">
          
          {/* Top Bar */}
          <div className="p-4 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-inner">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black tracking-tight">Kisan Mitra AI</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-emerald-200">Multilingual Agricultural Voice Co-Pilot</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  const nextLang = currentLanguage === 'en' ? 'hi' : currentLanguage === 'hi' ? 'te' : currentLanguage === 'te' ? 'mr' : 'en';
                  setLanguage(nextLang);
                }}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold text-emerald-100 flex items-center gap-1 transition-colors uppercase"
                title="Switch Language"
              >
                <Languages className="w-3 h-3" />
                {currentLanguage}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center space-x-2 overflow-x-auto text-[11px] whitespace-nowrap">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Ask:</span>
            {[
              '🍅 Tomato Mandi Price',
              '🛡️ Free CSR Grants',
              '🤖 5-Factor AI Match',
              '🔍 Scan Leaf Disease',
              '🚚 Cold-Chain Radar'
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.replace(/^[^\s]+\s/, ''))}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-lg font-medium transition-all shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#fafbfa]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {msg.actionButton && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-[11px] py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300"
                        onClick={() => {
                          navigate(msg.actionButton!.path);
                          setIsOpen(false);
                        }}
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                      >
                        {msg.actionButton.label}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="hover:text-emerald-600 transition-colors p-0.5"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
            <button
              onClick={handleSimulateVoiceInput}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
              }`}
              title="Speak in your regional language"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={isListening ? 'Listening to voice...' : 'Ask Kisan Mitra AI anything...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />

            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
