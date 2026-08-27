import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [phoneOrId, setPhoneOrId] = useState<string>('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = phoneOrId.trim();
    if (!cleanInput) {
      setError('Please enter your registered M-PESA phone number or National ID.');
      return;
    }
    if (cleanInput.length < 7) {
      setError('Please enter a valid phone number (e.g. 07XX XXX XXX) or National ID.');
      return;
    }

    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 4) {
      setError('Please enter the 4-digit security code.');
      return;
    }

    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Look up if user previously saved in local storage or create their authenticated session
      let existingUsers: UserProfile[] = [];
      try {
        const saved = localStorage.getItem('lendplus_users');
        if (saved) existingUsers = JSON.parse(saved);
      } catch (err) {
        // Fallback
      }

      const foundUser = existingUsers.find(
        u => u.phone.includes(phoneOrId) || u.idNumber === phoneOrId || u.mpesaNumber?.includes(phoneOrId)
      );

      if (foundUser) {
        onLoginSuccess(foundUser);
      } else {
        // Create authenticated user session for the entered phone/ID
        const newUser: UserProfile = {
          id: `user_${Date.now()}`,
          title: 'Mr',
          firstName: 'Account',
          lastName: 'Holder',
          idNumber: phoneOrId.length <= 8 && /^\d+$/.test(phoneOrId) ? phoneOrId : '34892019',
          dateOfBirth: '01/01/1995',
          gender: 'Male',
          phone: phoneOrId.startsWith('0') || phoneOrId.startsWith('+') ? phoneOrId : `07${phoneOrId.slice(0, 8)}`,
          email: 'borrower@lendplus.co.ke',
          address: 'Nairobi',
          city: 'Nairobi',
          county: 'Nairobi',
          postalCode: '00100',
          employmentType: 'Permanently Employed',
          employerName: 'Employed',
          jobTitle: 'Professional',
          monthlyIncome: 65000,
          monthlyExpenses: 25000,
          nextPayDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          payoutMethod: 'M-PESA',
          mpesaNumber: phoneOrId.startsWith('0') || phoneOrId.startsWith('+') ? phoneOrId : `07${phoneOrId.slice(0, 8)}`,
          bankName: 'Safaricom M-PESA',
          accountType: 'Salary',
          accountNumber: 'N/A',
          isReturning: false,
          creditScore: 720
        };
        onLoginSuccess(newUser);
      }

      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setPhoneOrId('');
    setOtp('');
    setError('');
    setStep('phone');
    onClose();
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
              <h3 className="font-bold text-base font-['Outfit']">Client Account Login</h3>
              <p className="text-[11px] text-orange-400">LendPlus Kenya • CBK Regulated</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  M-PESA Phone Number or National ID
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0712 345 678 or 34892019"
                    value={phoneOrId}
                    onChange={(e) => {
                      setPhoneOrId(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !phoneOrId.trim()}
                className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all ${
                  isLoading || !phoneOrId.trim()
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-orange-600/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending SMS OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send One-Time PIN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Enter Security Code</h4>
                <p className="text-xs text-slate-500">We sent a 4-digit code to {phoneOrId}</p>
              </div>

              <input
                type="text"
                maxLength={4}
                required
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ''));
                  if (error) setError('');
                }}
                placeholder="••••"
                className="w-full py-3 text-center font-mono text-2xl tracking-widest font-extrabold border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={isLoading || otp.trim().length < 4}
                className={`w-full py-3 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 ${
                  isLoading || otp.trim().length < 4
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Log In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
              >
                Change Phone Number
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
