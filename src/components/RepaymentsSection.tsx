import React from 'react';
import { 
  Smartphone, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  PhoneCall
} from 'lucide-react';

interface RepaymentsSectionProps {
  onOpenOzowDemo: () => void;
}

export const RepaymentsSection: React.FC<RepaymentsSectionProps> = ({ onOpenOzowDemo }) => {
  return (
    <section id="repayments" className="py-16 sm:py-20 bg-orange-50/30 border-b border-orange-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            100% M-PESA Express
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-['Outfit']">
            Instant M-PESA STK Push Repayments
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            No manual paybill typing, no errors, no delays. Repay anytime in 3 seconds directly via Safaricom M-PESA Express (STK Push) prompt sent straight to your phone.
          </p>
        </div>

        {/* Main STK Push Feature Card */}
        <div className="bg-white rounded-3xl border-2 border-orange-500 shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            {/* Left side: Highlights & Details */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-extrabold uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5 fill-orange-600 text-orange-600" />
                <span>Exclusive Fast Repayment Method</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                  How M-PESA STK Push Works
                </h3>
                <p className="text-slate-600 mt-2 text-sm sm:text-base leading-relaxed">
                  When your installment is due or when you choose to settle your loan, LendPlus sends an encrypted prompt directly to your Safaricom SIM. All you do is type your M-PESA PIN.
                </p>
              </div>

              {/* 3 Step List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center shrink-0 text-sm font-['Outfit'] shadow-sm shadow-orange-600/30">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">One-Tap Trigger from Dashboard</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Click "Instant M-PESA STK Repayment" and confirm the amount.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center shrink-0 text-sm font-['Outfit'] shadow-sm shadow-orange-600/30">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Enter Your Safaricom PIN</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Your phone screen pops up with the official prompt: "Do you want to pay KSh X to Lendplus Kenya Ltd?". Enter your 4-digit PIN.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center shrink-0 text-sm font-['Outfit'] shadow-sm shadow-orange-600/30">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Instant Ledger Reconciliation</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Your loan balance updates instantly, generating your M-PESA SMS receipt in real-time.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={onOpenOzowDemo}
                  className="w-full sm:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Test M-PESA Express STK Push</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right side: Visual STK Push Phone Simulation */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-8 sm:p-12 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Phone STK Dialog Simulation */}
              <div className="w-full max-w-xs bg-slate-950/90 border-2 border-orange-500/80 rounded-3xl p-5 shadow-2xl space-y-4 font-mono text-left z-10">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="text-orange-400 font-bold uppercase tracking-wider">M-PESA Express</span>
                  <span className="text-[10px] text-slate-400">Safaricom</span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-200 leading-relaxed font-sans">
                    Do you want to pay <strong>KSh 3,750</strong> to <strong>LENDPLUS KENYA</strong>?
                  </p>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Account: LP-KE-2026-94821
                  </p>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 font-sans mb-1">Enter M-PESA PIN</div>
                  <div className="text-lg tracking-widest text-amber-400 font-black font-mono">
                    ••••
                  </div>
                </div>

                <div className="flex gap-2 text-xs font-sans font-bold">
                  <div className="flex-1 py-2 text-center bg-slate-800 text-slate-300 rounded-lg">
                    Cancel
                  </div>
                  <div className="flex-1 py-2 text-center bg-orange-600 text-white rounded-lg">
                    Send
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-slate-300 font-medium z-10">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>256-Bit Safaricom Daraja API Encryption</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3 Core Security & Speed Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 font-['Outfit']">Instant 3-Second Update</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              No manual waiting for bank clearance. Payments update your loan ledger and unlock higher borrowing limits immediately.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 font-['Outfit']">Zero Fraud Risk</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              You never enter your PIN into a website or third party. PIN entry happens strictly in Safaricom's native hardware SIM environment.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 font-['Outfit']">Zero Early Settlement Penalty</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pay off your balance partially or in full anytime with zero penalty fees, reducing future monthly service costs.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
