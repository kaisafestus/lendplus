import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { calculateLendplusLoan, formatKES, APPLICATION_FEE_TIERS, getApplicationFee } from '../utils/loanCalculator';

interface LoanCalculatorProps {
  onStartApplication: (amount: number, termMonths: number, isReturning: boolean) => void;
  compact?: boolean;
}

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({
  onStartApplication,
  compact = false,
}) => {
  const [amount, setAmount] = useState<number>(12000);
  const [isReturning, setIsReturning] = useState<boolean>(false);
  const [showFeeDetails, setShowFeeDetails] = useState<boolean>(false);

  const termMonths = amount < 20000 ? 6 : 18;

  const calc = useMemo(() => {
    return calculateLendplusLoan(amount, termMonths, isReturning);
  }, [amount, termMonths, isReturning]);

  const appFee = getApplicationFee(amount);

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
      {/* Header / Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg font-['Outfit']">LendPlus Kenya Loan Calculator</h3>
            <p className="text-xs text-slate-500">CBK Licensed • Instant Safaricom M-PESA Payout</p>
          </div>
        </div>

        {/* Borrower Type Switch */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setIsReturning(false)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              !isReturning
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Standard Borrower
          </button>
          <button
            type="button"
            onClick={() => setIsReturning(true)}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              isReturning
                ? 'bg-orange-600 text-white shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            VIP Borrower (30% p.a.)
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-7">
        {/* Slider: Loan Amount */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700">
              Select Desired Loan Amount
            </label>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-['Outfit']">
                {formatKES(amount)}
              </span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="relative py-2">
            <input
              type="range"
              min={3000}
              max={100000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600 focus:outline-none"
            />
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1.5">
              <span>KSh 3,000 (6 Mo)</span>
              <span>KSh 20,000 (18 Mo)</span>
              <span>KSh 100,000 (18 Mo)</span>
            </div>
          </div>

          {/* Quick amount chips matching exact user tiers */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
            {APPLICATION_FEE_TIERS.map((tier) => (
              <button
                key={tier.amount}
                type="button"
                onClick={() => setAmount(tier.amount)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  amount === tier.amount
                    ? 'border-orange-500 bg-orange-50/70 text-slate-900 ring-1 ring-orange-500 font-bold'
                    : 'border-slate-200 text-slate-600 hover:border-orange-300 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{tier.label}</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-md">
                    {tier.amount < 20000 ? '6 Mo' : '18 Mo'}
                  </span>
                </div>
                <div className="text-[10px] text-orange-700 font-semibold mt-0.5">Fee: KSh {tier.fee}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Loan Repayment Plan Details */}
        <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              {termMonths}M
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-800">
                {amount < 20000 ? '6 Months Repayment Plan' : '18 Months Repayment Plan'}
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {amount < 20000 
                  ? 'Loans under KSh 15,000 feature an easy 6-month installment plan' 
                  : 'Loans KSh 20,000 & above feature an extended 18-month installment plan'}
              </p>
            </div>
          </div>
          <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-orange-200/60 flex sm:block items-center justify-between">
            <span className="text-xs text-slate-500 block">Monthly Payment</span>
            <span className="text-base font-extrabold text-slate-900 font-['Outfit']">
              {formatKES(calc.monthlyInstallment)}/mo
            </span>
          </div>
        </div>

        {/* Repayment Breakdown Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-4">
          
          {/* Highlight Application Fee */}
          <div className="p-3.5 bg-orange-500/20 rounded-xl border border-orange-400/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-orange-300 font-bold block">
                M-PESA Application Fee (STK Push):
              </span>
              <span className="text-[11px] text-slate-300">Paid to trigger instant loan crediting</span>
            </div>
            <span className="text-2xl font-black text-amber-300 font-['Outfit']">KSh {appFee}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Repayable Amount</p>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mt-0.5">
                {formatKES(calc.totalRepayment)}
              </h4>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs px-2.5 py-1 rounded-full font-semibold">
                <Calendar className="w-3 h-3" /> Due {calc.dueDate}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {calc.installmentsCount} payments of <span className="text-slate-200 font-bold">{formatKES(calc.monthlyInstallment)}</span>
              </p>
            </div>
          </div>

          {/* Fee Itemization Toggle */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Principal Amount</span>
              <span className="font-semibold text-white">{formatKES(calc.principal)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1">
                Interest ({calc.interestRateAnnual}% p.a.)
                {isReturning && <span className="text-[10px] text-orange-400 font-bold bg-orange-950 px-1.5 rounded">30% VIP</span>}
              </span>
              <span className="font-semibold text-white">{formatKES(calc.interestAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Facilitation Fee (Incl. 20% Kenya Excise)</span>
              <span className="font-semibold text-white">{formatKES(calc.initiationFee)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Account Maintenance Fee (KSh 150/mo × {termMonths} mo)</span>
              <span className="font-semibold text-white">{formatKES(calc.serviceFee)}</span>
            </div>
          </div>

          {/* Fee details toggle info */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => setShowFeeDetails(!showFeeDetails)}
              className="inline-flex items-center gap-1 hover:text-orange-300 transition-colors"
            >
              <Info className="w-3 h-3" />
              <span>{showFeeDetails ? 'Hide schedule' : `View all ${calc.installmentsCount} monthly installments`}</span>
            </button>
            <span className="font-medium text-slate-400">Max APR: {calc.apr}%</span>
          </div>

          {/* Expanded Schedule */}
          {showFeeDetails && (
            <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 bg-slate-800/50 p-3 rounded-xl max-h-56 overflow-y-auto">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                {termMonths}-Month Installment Schedule:
              </p>
              {calc.schedule.map((item) => (
                <div key={item.installmentNumber} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-700/50 last:border-0">
                  <span className="text-slate-300">
                    Month #{item.installmentNumber} ({item.dueDate})
                  </span>
                  <span className="font-bold text-orange-400">{formatKES(item.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => onStartApplication(amount, termMonths, isReturning)}
            className="w-full py-4 px-6 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-base rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 group transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
            <span>Apply Now for {formatKES(amount)} ({termMonths} Months)</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium pt-1">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> 100% Online M-PESA
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" /> Instant STK Payout
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> CBK Licensed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
