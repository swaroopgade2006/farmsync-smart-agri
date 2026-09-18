import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  Sprout, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  ShoppingCart, 
  TrendingUp, 
  Truck, 
  Shield, 
  Building2, 
  Store, 
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

// Default role credentials dictionary
const DEMO_ROLE_CREDENTIALS: Record<UserRole, { email: string; password: string; name: string; title: string; icon: any; color: string; badge: string }> = {
  farmer: {
    email: 'ravi.kumar@farm.in',
    password: 'password123',
    name: 'Ravi Kumar',
    title: 'Verified Farmer (Gudivada, AP)',
    icon: UserCheck,
    color: 'emerald',
    badge: '✓ VERIFIED FARMER'
  },
  fpo: {
    email: 'contact@godavarifpo.coop',
    password: 'password123',
    name: 'Godavari Delta FPO',
    title: 'Farmer Producer Co. (340 Farmers)',
    icon: Building2,
    color: 'blue',
    badge: '✓ VERIFIED FPO'
  },
  buyer: {
    email: 'purchase@freshmart.in',
    password: 'password123',
    name: 'FreshMart Wholesale Hub',
    title: 'Bulk Buyer / Retail Network',
    icon: ShoppingCart,
    color: 'sky',
    badge: '✓ APMC BUYER'
  },
  vendor: {
    email: 'trades@abcagro.in',
    password: 'password123',
    name: 'ABC Agro Mandi Traders',
    title: 'APMC Licensed Mandi Vendor',
    icon: Store,
    color: 'amber',
    badge: '✓ APMC VENDOR'
  },
  investor: {
    email: 'partners@agrifund.vc',
    password: 'password123',
    name: 'AgriFund India VC',
    title: 'Agri Impact & CSR Sponsor',
    icon: TrendingUp,
    color: 'purple',
    badge: '✓ VERIFIED SPONSOR'
  },
  logistics: {
    email: 'dispatch@swiftagri.com',
    password: 'password123',
    name: 'SwiftAgri Express Logistics',
    title: 'Reefer & Cold Chain Fleet',
    icon: Truck,
    color: 'indigo',
    badge: '✓ VERIFIED FLEET'
  },
  admin: {
    email: 'admin@farmsync.ai',
    password: 'password123',
    name: 'SIH Central Authority',
    title: 'Central Verification & Audit Officer',
    icon: Shield,
    color: 'rose',
    badge: '✓ SYSTEM ADMIN'
  },
};

export const LoginPage: React.FC = () => {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryRole = searchParams.get('role') as UserRole;
  const initialRole: UserRole = queryRole && DEMO_ROLE_CREDENTIALS[queryRole] ? queryRole : 'farmer';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(DEMO_ROLE_CREDENTIALS[initialRole].email);
  const [password, setPassword] = useState(DEMO_ROLE_CREDENTIALS[initialRole].password);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // When role changes, automatically synchronize email & password
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setEmail(DEMO_ROLE_CREDENTIALS[newRole].email);
    setPassword(DEMO_ROLE_CREDENTIALS[newRole].password);
    setErrorMessage('');
  };

  useEffect(() => {
    if (queryRole && DEMO_ROLE_CREDENTIALS[queryRole]) {
      handleRoleChange(queryRole);
    }
  }, [queryRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    const res = await login(email, role);
    setIsLoading(false);

    if (res.success) {
      redirectToDashboard(role);
    } else {
      setErrorMessage(res.error || 'Invalid credentials');
    }
  };

  const handleQuickDemoLogin = async (targetRole: UserRole, targetEmail: string) => {
    setEmail(targetEmail);
    setPassword('password123');
    setRole(targetRole);
    switchRole(targetRole);
    redirectToDashboard(targetRole);
  };

  const redirectToDashboard = (targetRole: UserRole) => {
    switch (targetRole) {
      case 'farmer':
      case 'fpo':
        navigate('/farmer');
        break;
      case 'buyer':
      case 'vendor':
        navigate('/buyer/marketplace');
        break;
      case 'investor':
        navigate('/sponsor');
        break;
      case 'logistics':
        navigate('/logistics');
        break;
      case 'admin':
        navigate('/admin/verification');
        break;
      default:
        navigate('/');
    }
  };

  const currentCred = DEMO_ROLE_CREDENTIALS[role] || DEMO_ROLE_CREDENTIALS.farmer;

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-600/20 mb-3">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Sign in to FarmSync AI</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your agricultural trust, identity, and marketplace portal
          </p>
        </div>

        {/* 1-Click Persona Shortcuts */}
        <Card className="p-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-slate-50 border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>1-Click SIH 2026 Test Personas</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Pre-Configured
            </span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(DEMO_ROLE_CREDENTIALS) as UserRole[]).map((r) => {
              const persona = DEMO_ROLE_CREDENTIALS[r];
              const Icon = persona.icon;
              const isSelected = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleQuickDemoLogin(r, persona.email)}
                  className={`p-2 rounded-xl text-left transition-all text-xs font-semibold flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                      : 'bg-white hover:bg-emerald-50/80 border-slate-200 hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                    <span className="font-bold text-[11px] capitalize">{r}</span>
                  </div>
                  <span className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {persona.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 shadow-md border-slate-200">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Active Persona Banner */}
          <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                {role.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{currentCred.name}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {currentCred.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{currentCred.title}</p>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Account Role
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                {(['farmer', 'fpo', 'buyer', 'vendor', 'investor', 'logistics', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={`py-1.5 px-1 rounded-lg text-[11px] font-bold capitalize transition-all text-center ${
                      role === r
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {r === 'investor' ? 'Sponsor' : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Auto-Filled
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@farmsync.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to {role.toUpperCase()} Portal
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to={`/register?role=${role}`} className="font-bold text-emerald-600 hover:underline">
              Create a new {role.toUpperCase()} account
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};
