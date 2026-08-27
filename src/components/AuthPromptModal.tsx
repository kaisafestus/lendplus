import React from 'react';
import { 
  X, 
  ShieldCheck, 
  UserPlus, 
  LogIn,
  ArrowRight
} from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  onGoToLogin,
  onGoToRegister,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-orange-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm font-['Outfit'] shadow-md shadow-orange-600/30">
              L+
            </div>
            <div>
              <h3 className="font-bold text-base font-['Outfit']">Account Required</h3>
              <p className="text-[11px] text-orange-400">LendPlus Kenya • CBK Regulated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 font-['Outfit']">
              Sign Up or Log In to Continue
            </h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              To apply for a loan, make repayments, or access your account, please create an account or log in to your existing LendPlus Kenya profile.
            </p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={onGoToRegister}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onGoToLogin}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>I Already Have an Account</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>256-Bit SSL Encrypted • CBK Licensed DCP</span>
          </div>
        </div>

      </div>
    </div>
  );
};
