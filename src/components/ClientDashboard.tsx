import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  ShieldCheck, 
  Zap, 
  FileText, 
  HelpCircle,
  LogOut,
  Sparkles,
  Plus,
  Smartphone
} from 'lucide-react';
import { UserProfile, LoanRecord } from '../types';
import { formatKES } from '../utils/loanCalculator';

interface ClientDashboardProps {
  currentUser: UserProfile;
  activeLoan: LoanRecord | null;
  allLoans: LoanRecord[];
  onOpenOzowRepay: (loanNumber: string, amount: number) => void;
  onApplyNewLoan: () => void;
  onSwitchUser: (userId: string) => void;
  onLogout: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  currentUser,
  activeLoan,
  allLoans,
  onOpenOzowRepay,
  onApplyNewLoan,
  onSwitchUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'history' | 'profile'>('overview');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleDownloadStatement = () => {
    setDownloadSuccess(true);
    // Simulate statement generation
    const element = document.createElement('a');
    const file = new Blob([
      `LENDPLUS KENYA LIMITED - OFFICIAL LOAN STATEMENT\n` +
      `CBK Digital Credit Provider License: CBK/DCP/0089\n` +
      `Date: ${new Date().toLocaleDateString('en-KE')}\n` +
      `Borrower: ${currentUser.firstName} ${currentUser.lastName}\n` +
      `National ID: ${currentUser.idNumber}\n` +
      `M-PESA / Phone: ${currentUser.phone}\n` +
      `Active Balance Remaining: ${activeLoan ? formatKES(activeLoan.balanceRemaining) : 'KSh 0'}\n` +
      `Total Borrowed: ${activeLoan ? formatKES(activeLoan.amount) : 'KSh 0'}\n` +
      `Status: ${activeLoan?.status.toUpperCase() || 'N/A'}\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Lendplus-Statement-${currentUser.lastName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="py-10 bg-orange-50/40 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top User Greeting & Status Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-2xl font-black font-['Outfit'] shadow-md shadow-orange-500/20">
              {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black font-['Outfit']">
                  Habari, {currentUser.firstName} {currentUser.lastName}
                </h2>
                {currentUser.isReturning && (
                  <span className="bg-orange-500/20 text-orange-300 border border-orange-400/40 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> VIP Borrower
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                National ID: <span className="font-mono text-slate-300 font-semibold">{currentUser.idNumber}</span> • Payout: <span className="text-orange-400 font-semibold">{currentUser.payoutMethod || 'M-PESA'}</span> ({currentUser.mpesaNumber || currentUser.phone})
              </p>
            </div>
          </div>

          {/* User Account Controls */}
          <div className="flex items-center gap-2.5 z-10">
            <button
              onClick={handleDownloadStatement}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 hover:border-slate-600 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download Statement'}</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Loan Overview', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'schedule', label: 'Payment Schedule', icon: <Calendar className="w-4 h-4" /> },
            { id: 'history', label: 'Payment History', icon: <History className="w-4 h-4" /> },
            { id: 'profile', label: 'My Details', icon: <User className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/25'
                  : 'bg-white text-slate-600 hover:bg-orange-50/50 hover:text-orange-600 border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Loan Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Active Loan Main Card */}
            <div className="lg:col-span-8 space-y-6">
              {activeLoan ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
                  
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        Active M-PESA Cash Loan
                      </span>
                      <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-1">
                        Loan #{activeLoan.loanNumber}
                      </h3>
                    </div>

                    <button
                      onClick={handleDownloadStatement}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-3 py-2 rounded-xl transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadSuccess ? 'Downloaded!' : 'Download Statement'}</span>
                    </button>
                  </div>

                  {/* Progress & Balance Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Remaining Balance</span>
                      <div className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
                        {formatKES(activeLoan.balanceRemaining)}
                      </div>
                      <p className="text-xs text-orange-700 font-semibold">
                        Original disbursed: {formatKES(activeLoan.amount)}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-xs font-bold text-slate-500 uppercase">Next Installment Due</span>
                      <div className="text-3xl font-extrabold text-orange-600 font-['Outfit']">
                        {formatKES(activeLoan.calculation.monthlyInstallment)}
                      </div>
                      <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Due on {activeLoan.calculation.dueDate}
                      </p>
                    </div>
                  </div>

                  {/* Repayment Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Repayment Progress</span>
                      <span>
                        {Math.round((activeLoan.paidAmount / activeLoan.calculation.totalRepayment) * 100)}% Paid
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, Math.round((activeLoan.paidAmount / activeLoan.calculation.totalRepayment) * 100))}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                      <span>Paid: {formatKES(activeLoan.paidAmount)}</span>
                      <span>Total: {formatKES(activeLoan.calculation.totalRepayment)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => onOpenOzowRepay(activeLoan.loanNumber, activeLoan.calculation.monthlyInstallment)}
                      className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Instant M-PESA STK Repayment</span>
                    </button>

                    <button
                      onClick={() => onOpenOzowRepay(activeLoan.loanNumber, activeLoan.balanceRemaining)}
                      className="w-full sm:w-auto py-3.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors"
                    >
                      Settle Full Loan ({formatKES(activeLoan.balanceRemaining)})
                    </button>
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">No Active Loans</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      You have 0 outstanding balances. You are eligible for an immediate fast M-PESA cash disbursement.
                    </p>
                  </div>
                  <button
                    onClick={onApplyNewLoan}
                    className="py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/20 inline-flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Apply for New Loan (Up to KSh {currentUser.isReturning ? '100,000' : '50,000'})</span>
                  </button>
                </div>
              )}

              {/* Security & Regulatory Strip */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Central Bank of Kenya (CBK) Licensed DCP Provider • License CBK/DCP/0089</span>
                </div>
                <span className="font-semibold text-slate-700">Data Protection Act 2019</span>
              </div>

            </div>

            {/* Right Side: Quick Stats & Helpdesk */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Credit Health Widget */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 font-['Outfit'] uppercase tracking-wider">
                  LendPlus Borrower Standing
                </h4>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Credit Standing</span>
                    <div className="text-2xl font-black text-orange-600 font-['Outfit']">
                      {currentUser.creditScore || 720} <span className="text-xs text-slate-400 font-normal">/ 900</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-800 bg-orange-100 px-2.5 py-1 rounded-full">
                    Excellent
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Eligible Limit:</span>
                    <span className="font-bold text-slate-900">{currentUser.isReturning ? 'KSh 100,000' : 'KSh 50,000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Rate:</span>
                    <span className="font-bold text-orange-600">{currentUser.isReturning ? '2.5% / mo (VIP)' : '3.5% / mo'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payout Channel:</span>
                    <span className="font-bold text-slate-900">{currentUser.payoutMethod || 'M-PESA'}</span>
                  </div>
                </div>
              </div>

              {/* Need assistance box */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md space-y-3">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                  <HelpCircle className="w-4 h-4" />
                  <span>Dedicated Support Desk</span>
                </div>
                <h4 className="font-bold text-base font-['Outfit']">Need Payment Assistance?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If you need to reschedule an installment or request a payment restructuring, our Nairobi customer team is here to assist.
                </p>
                <div className="pt-2 text-xs font-semibold space-y-1">
                  <a href="tel:+254709824000" className="block text-orange-400 hover:underline">
                    📞 Helpline: +254 709 824 000
                  </a>
                  <a href="mailto:support@lendplus.co.ke" className="block text-slate-300 hover:underline">
                    ✉️ support@lendplus.co.ke
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Schedule */}
        {activeTab === 'schedule' && activeLoan && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-4">Scheduled Installments</h3>
            <div className="divide-y divide-slate-100">
              {activeLoan.calculation.schedule.map((item) => (
                <div key={item.installmentNumber} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold shrink-0">
                      #{item.installmentNumber}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Due {item.dueDate}</h4>
                      <p className="text-xs text-slate-500">
                        Principal: {formatKES(item.principalPortion)} • Interest & Fees: {formatKES(item.interestPortion + item.feePortion)}
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right flex sm:block items-center justify-between pl-13 sm:pl-0">
                    <span className="text-base font-extrabold text-slate-900 font-['Outfit'] block">
                      {formatKES(item.amount)}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                      M-PESA / Paybill
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-4">Payment Transactions</h3>
            {activeLoan?.payments && activeLoan.payments.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {activeLoan.payments.map((p) => (
                  <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{p.method}</h4>
                      <p className="text-xs text-slate-400">Ref: {p.reference} • Date: {p.date}</p>
                    </div>
                    <div className="sm:text-right flex sm:block items-center justify-between">
                      <span className="text-base font-bold text-orange-600">{formatKES(p.amount)}</span>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full block mt-0.5">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No payment transactions recorded yet.</p>
            )}
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md max-w-2xl">
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-4">Client Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Full Legal Name:</span>
                <span className="font-bold text-slate-800 text-sm">{currentUser.title} {currentUser.firstName} {currentUser.lastName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Kenyan National ID:</span>
                <span className="font-bold font-mono text-slate-800 text-sm">{currentUser.idNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">M-PESA / Phone:</span>
                <span className="font-bold text-slate-800 text-sm">{currentUser.phone}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">County / City:</span>
                <span className="font-bold text-slate-800 text-sm">{currentUser.county || 'Nairobi'}, {currentUser.city || 'Nairobi'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Disbursement Channel:</span>
                <span className="font-bold text-slate-800 text-sm">{currentUser.payoutMethod || 'M-PESA'}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
