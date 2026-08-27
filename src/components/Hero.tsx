import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Zap, 
  Smartphone, 
  Banknote,
  Send
} from 'lucide-react';
import { LoanCalculator } from './LoanCalculator';

interface HeroProps {
  onStartApplication: (amount: number, termDays: number, isReturning: boolean) => void;
  onOpenEligibility: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartApplication,
  onOpenEligibility,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-orange-50/50 via-white to-slate-50">
      {/* Subtle background glow elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-300/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Value Proposition & Information */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Regulatory badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-wide border border-orange-200 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>CBK Licensed Digital Credit Provider • CBK/DCP/2023/048</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-['Outfit'] leading-[1.1]">
              Instant Mobile Cash Loans in <span className="text-orange-600 underline decoration-orange-300 underline-offset-4">Kenya</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Borrow from <strong className="text-slate-900">KSh 3,000 up to KSh 100,000</strong> within 3 minutes. 
              Get instant automated approval, fair CBK-compliant rates, and funds credited directly to your <strong className="text-orange-700">M-PESA</strong>.
            </p>

            {/* Core Feature Bullet Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Instant M-PESA Payout</h4>
                  <p className="text-xs text-slate-500">Funds hit your wallet in under 2 mins</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">CBK Regulated Rates</h4>
                  <p className="text-xs text-slate-500">Transparent pricing with zero hidden costs</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">6 to 18 Month Plans</h4>
                  <p className="text-xs text-slate-500">6 months under 15k, 18 months 20k+</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Paperless KYC</h4>
                  <p className="text-xs text-slate-500">National ID & M-PESA statement check</p>
                </div>
              </div>
            </div>

            {/* Trust and Rating strip */}
            <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">FW</div>
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">BO</div>
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">JK</div>
                </div>
                <span className="font-semibold text-slate-800">100,000+ Kenyans empowered</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {'★'.repeat(5)}
                </div>
                <span className="font-bold text-slate-800">4.8 / 5.0</span>
                <span className="text-slate-400">Google Play rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Loan Calculator Widget */}
          <div className="lg:col-span-5">
            <LoanCalculator onStartApplication={onStartApplication} />
          </div>

        </div>
      </div>
    </section>
  );
};
