import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  ShieldCheck,
  UserPlus,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');

  // Register fields
  const [regFirstName, setRegFirstName] = useState<string>('');
  const [regLastName, setRegLastName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');

  if (!isOpen) return null;

  const resetForms = () => {
    setLoginIdentifier('');
    setLoginPassword('');
    setRegFirstName('');
    setRegLastName('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setError('');
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const identifier = loginIdentifier.trim();
    const password = loginPassword.trim();

    if (!identifier || !password) {
      setError('Please enter your email/phone and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const saved = localStorage.getItem('lendplus_users');
        const users: UserProfile[] = saved ? JSON.parse(saved) : [];
        const found = users.find(
          (u) =>
            (u.email && u.email.toLowerCase() === identifier.toLowerCase()) ||
            (u.phone && u.phone.replace(/\s+/g, '') === identifier.replace(/\s+/g, ''))
        );

        if (!found || found.password !== password) {
          setError('Invalid email/phone or password.');
          setIsLoading(false);
          return;
        }

        onLoginSuccess(found);
        resetForms();
      } catch (err) {
        setError('Unable to load account. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const firstName = regFirstName.trim();
    const lastName = regLastName.trim();
    const email = regEmail.trim().toLowerCase();
    const password = regPassword;
    const confirmPassword = regConfirmPassword;

    if (!firstName || !lastName) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const saved = localStorage.getItem('lendplus_users');
        const users: UserProfile[] = saved ? JSON.parse(saved) : [];

        const exists = users.some((u) => u.email.toLowerCase() === email);
        if (exists) {
          setError('An account with this email already exists.');
          setIsLoading(false);
          return;
        }

        const newUser: UserProfile = {
          id: `user_${Date.now()}`,
          title: 'Mr',
          firstName,
          lastName,
          idNumber: '',
          dateOfBirth: '',
          gender: 'Male',
          phone: '',
          email,
          address: '',
          city: 'Nairobi',
          county: 'Nairobi',
          postalCode: '00100',
          employmentType: '',
          employerName: '',
          jobTitle: '',
          monthlyIncome: 0,
          monthlyExpenses: 0,
          nextPayDate: '',
          payoutMethod: 'M-PESA',
          mpesaNumber: '',
          bankName: 'Safaricom M-PESA',
          accountType: 'Salary',
          accountNumber: '',
          isReturning: false,
          creditScore: 650,
          password,
        };

        users.push(newUser);
        localStorage.setItem('lendplus_users', JSON.stringify(users));

        onLoginSuccess(newUser);
        resetForms();
      } catch (err) {
        setError('Unable to create account. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-orange-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm font-['Outfit'] shadow-md shadow-orange-600/30">
              L+
            </div>
            <div>
              <h3 className="font-bold text-base font-['Outfit']">
                {mode === 'login' ? 'Client Account Login' : 'Create Account'}
              </h3>
              <p className="text-[11px] text-orange-400">LendPlus Kenya • CBK Regulated</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => { setMode('login'); resetForms(); }}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              mode === 'login'
                ? 'text-orange-700 border-b-2 border-orange-600 bg-orange-50/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); resetForms(); }}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              mode === 'register'
                ? 'text-orange-700 border-b-2 border-orange-600 bg-orange-50/50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. borrower@example.co.ke or 0712 345 678"
                    value={loginIdentifier}
                    onChange={(e) => {
                      setLoginIdentifier(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${
                  isLoading
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-orange-600/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kelvin"
                    value={regFirstName}
                    onChange={(e) => {
                      setRegFirstName(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kipchumba"
                    value={regLastName}
                    onChange={(e) => {
                      setRegLastName(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@example.co.ke"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={regConfirmPassword}
                  onChange={(e) => {
                    setRegConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${
                  isLoading
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-orange-600/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>256-Bit SSL Encrypted • CBK Licensed DCP</span>
          </div>

        </div>

      </div>
    </div>
  );
};
