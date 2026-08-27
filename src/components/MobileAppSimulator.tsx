import React, { useState } from 'react';
import { 
  X, 
  Home, 
  Calculator, 
  CreditCard, 
  User, 
  Bell, 
  Zap, 
  ShieldCheck, 
  Wifi, 
  Battery, 
  Smartphone
} from 'lucide-react';
import { UserProfile, LoanRecord } from '../types';
import { LoanCalculator } from './LoanCalculator';
import { formatKES } from '../utils/loanCalculator';

interface MobileAppSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  activeLoan: LoanRecord | null;
  onStartApply: (amount: number, termMonths: number, isReturning: boolean) => void;
  onOpenOzow: (loanNumber: string, amount: number) => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeLoan,
  onStartApply,
  onOpenOzow,
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'calc' | 'loans' | 'profile'>('home');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative flex flex-col items-center">
        
        {/* Close Button Top */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 sm:-right-12 text-slate-300 hover:text-white p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Device Frame */}
        <div className="w-[360px] sm:w-[390px] h-[740px] bg-slate-900 rounded-[48px] p-3.5 shadow-2xl border-4 border-slate-700/80 relative flex flex-col overflow-hidden">
          
          {/* Top Speaker / Dynamic Island */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-800 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
          </div>

          {/* Screen Container */}
          <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative z-10 text-slate-900 select-none">
            
            {/* Native Mobile Status Bar */}
            <div className="pt-2 px-6 pb-1 bg-white flex justify-between items-center text-[11px] font-bold text-slate-800 shrink-0">
              <span>09:41</span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Wifi className="w-3 h-3" />
                <span className="text-[10px] font-bold">5G</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mobile App Header */}
            <div className="px-4 py-3 bg-white border-b border-orange-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-xs flex items-center justify-center font-['Outfit'] shadow-xs shadow-orange-600/30">
                  L+
                </div>
                <span className="font-extrabold text-sm tracking-tight text-slate-900 font-['Outfit']">
                  Lend<span className="text-orange-600">Plus</span> KE
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded border border-orange-200">
                  CBK Regulated
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                  <Bell className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Mobile Screen Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              
              {/* TAB 1: Mobile Home */}
              {mobileTab === 'home' && (
                <div className="space-y-4">
                  
                  {/* User Greeting Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-slate-400">Karibu Back</p>
                        <h4 className="font-extrabold text-base font-['Outfit'] text-white">
                          {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User'}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-full">
                        M-PESA Direct
                      </span>
                    </div>

                    {activeLoan ? (
                      <div className="mt-3 pt-3 border-t border-slate-700/80 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-400">Balance:</span>
                          <div className="text-lg font-black text-orange-400 font-['Outfit']">
                            {formatKES(activeLoan.balanceRemaining)}
                          </div>
                        </div>
                        <button
                          onClick={() => onOpenOzow(activeLoan.loanNumber, activeLoan.calculation.monthlyInstallment)}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] rounded-xl shadow-xs"
                        >
                          Repay
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-slate-700/80 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-400">Available Limit:</span>
                          <div className="text-base font-black text-white font-['Outfit']">KSh 30,000</div>
                        </div>
                        <button
                          onClick={() => onStartApply(10000, 6, false)}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] rounded-xl"
                        >
                          Get Cash
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Compact Quick Calculator */}
                  <div className="bg-white p-3.5 rounded-2xl border border-orange-200/80 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">Instant Quick Loan</span>
                      <span className="text-orange-600 font-bold text-xs font-mono">42% APR</span>
                    </div>
                    <div className="p-2.5 bg-orange-50/40 rounded-xl flex justify-between items-center border border-orange-100">
                      <span className="text-slate-500 text-[11px]">Amount</span>
                      <span className="font-extrabold text-sm text-orange-700">KSh 10,000</span>
                    </div>
                    <div className="p-2.5 bg-orange-50/40 rounded-xl flex justify-between items-center border border-orange-100">
                      <span className="text-slate-500 text-[11px]">Repayment Plan</span>
                      <span className="font-bold text-xs text-slate-800">6 Months</span>
                    </div>
                    <button
                      onClick={() => onStartApply(10000, 6, false)}
                      className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Apply in 3 Minutes</span>
                    </button>
                  </div>

                  {/* Quick Feature Strip */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <ShieldCheck className="w-4 h-4 text-orange-600 mb-1" />
                      <div className="font-bold text-[11px] text-slate-900">CBK Licensed</div>
                      <div className="text-[9px] text-slate-400">CBK/DCP/0089</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200">
                      <Smartphone className="w-4 h-4 text-orange-600 mb-1" />
                      <div className="font-bold text-[11px] text-slate-900">M-PESA Express</div>
                      <div className="text-[9px] text-slate-400">5-min disbursement</div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: Calculator */}
              {mobileTab === 'calc' && (
                <div className="space-y-3">
                  <LoanCalculator onStartApplication={onStartApply} compact={true} />
                </div>
              )}

              {/* TAB 3: My Loans */}
              {mobileTab === 'loans' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-900">Active & Past Loans</h4>
                  {activeLoan ? (
                    <div className="p-3.5 rounded-2xl bg-white border border-orange-300 shadow-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded border border-orange-200">Active</span>
                          <div className="font-bold text-xs text-slate-900 mt-1">{activeLoan.loanNumber}</div>
                        </div>
                        <span className="font-extrabold text-sm text-slate-900">{formatKES(activeLoan.balanceRemaining)}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Due Date: {activeLoan.calculation.dueDate}
                      </div>
                      <button
                        onClick={() => onOpenOzow(activeLoan.loanNumber, activeLoan.calculation.monthlyInstallment)}
                        className="w-full py-2 bg-orange-600 text-white font-bold text-[11px] rounded-xl"
                      >
                        Pay Next Installment ({formatKES(activeLoan.calculation.monthlyInstallment)})
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-white rounded-2xl border border-slate-200">
                      <p className="text-slate-500 text-xs">No active loans found.</p>
                      <button
                        onClick={() => onStartApply(5000, 6, false)}
                        className="mt-3 px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl"
                      >
                        Apply Now
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Profile */}
              {mobileTab === 'profile' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white border border-orange-200/80 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center mx-auto border border-orange-200">
                      {currentUser ? currentUser.firstName.charAt(0) : 'G'}
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest User'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      National ID: {currentUser?.idNumber || 'Not provided'}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-2 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Payout Channel:</span>
                       <span className="font-bold text-slate-800">{currentUser?.bankName || 'M-PESA'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Income:</span>
                       <span className="font-bold text-slate-800">{currentUser ? formatKES(currentUser.monthlyIncome) : 'KSh 0'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Status:</span>
                      <span className="font-bold text-orange-600">CBK Verified</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Native Mobile Bottom Navigation Bar */}
            <div className="h-14 bg-white border-t border-slate-200 px-4 flex items-center justify-between shrink-0">
              {[
                { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
                { id: 'calc', label: 'Calculator', icon: <Calculator className="w-4 h-4" /> },
                { id: 'loans', label: 'My Loans', icon: <CreditCard className="w-4 h-4" /> },
                { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMobileTab(t.id as any)}
                  className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
                    mobileTab === t.id ? 'text-orange-600 font-extrabold' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Home Indicator Bar */}
            <div className="pb-1 pt-0.5 bg-white flex justify-center shrink-0">
              <div className="w-24 h-1 bg-slate-300 rounded-full" />
            </div>

          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3">
          Interactive simulation of LendPlus Kenya Mobile Application
        </p>

      </div>
    </div>
  );
};
