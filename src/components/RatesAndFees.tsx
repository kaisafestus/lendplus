import React from 'react';
import { 
  ShieldCheck, 
  Percent, 
  FileCheck2, 
  TrendingDown, 
  AlertCircle,
  Zap,
  Smartphone
} from 'lucide-react';
import { calculateLendplusLoan, formatKES, APPLICATION_FEE_TIERS } from '../utils/loanCalculator';

export const RatesAndFees: React.FC = () => {
  const tableRows = APPLICATION_FEE_TIERS.map((tier) => ({
    ...tier,
    calc: calculateLendplusLoan(tier.amount, tier.amount < 20000 ? 6 : 18, false)
  }));

  return (
    <section id="rates" className="py-16 sm:py-20 bg-white border-b border-orange-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-['Outfit']">
            CBK-Regulated Rates & Application Fee Schedule
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            No hidden charges. 6-Month plans for loans under KSh 15,000 and 18-Month plans for loans KSh 20,000 and above, fully compliant with Central Bank of Kenya regulations.
          </p>
        </div>

        {/* 3 Core Fee Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          
          <div className="p-6 rounded-3xl bg-orange-50/30 border border-orange-200/70 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold mb-4 border border-orange-200">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Annual Interest Rate</h3>
            <div className="mt-2 space-y-1 text-slate-600 text-sm">
              <p><strong className="text-slate-900">Standard borrowers:</strong> 42% per annum (3.5% monthly).</p>
              <p><strong className="text-orange-700">Returning VIP borrowers:</strong> 30% per annum (2.5% monthly).</p>
              <p className="text-xs text-slate-400 mt-2">Calculated on a reducing monthly schedule in compliance with CBK guidelines.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-orange-50/30 border border-orange-200/70 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold mb-4 border border-orange-200">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">M-PESA Application Fee</h3>
            <div className="mt-2 space-y-1 text-slate-600 text-sm">
              <p><strong className="text-slate-900">Fixed tier schedule:</strong> KSh 92 on KSh 3,000 up to KSh 999 on KSh 100,000.</p>
              <p><strong className="text-orange-700">Settled via STK Push:</strong> Initiated upon application verification to trigger disbursement.</p>
              <p className="text-xs text-slate-400 mt-2">Secured directly through Safaricom Daraja API.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-orange-50/30 border border-orange-200/70 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold mb-4 border border-orange-200">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Repayment Periods</h3>
            <div className="mt-2 space-y-1 text-slate-600 text-sm">
              <p><strong className="text-slate-900">Under KSh 15,000:</strong> 6 Months (6 monthly installments).</p>
              <p><strong className="text-orange-700">KSh 20,000 and above:</strong> 18 Months (18 monthly installments).</p>
              <p className="text-xs text-slate-400 mt-2">Zero early settlement penalty fees at any point.</p>
            </div>
          </div>

        </div>

        {/* Full Loan & Application Fee Schedule Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-base font-['Outfit']">Official LendPlus Kenya Fee & Repayment Schedule</h3>
            </div>
            <span className="text-xs text-orange-300 font-mono">CBK/DCP/0089 Compliant</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-orange-50/70 text-slate-700 text-xs uppercase tracking-wider border-b border-orange-100">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Loan Amount</th>
                  <th className="px-6 py-3.5 font-bold text-orange-700">M-PESA App Fee (STK)</th>
                  <th className="px-6 py-3.5 font-bold">Repayment Plan</th>
                  <th className="px-6 py-3.5 font-bold">Total Repayable</th>
                  <th className="px-6 py-3.5 font-bold">Monthly Installment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tableRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-6 py-3.5 font-extrabold text-slate-900">{formatKES(row.amount)}</td>
                    <td className="px-6 py-3.5 font-black text-amber-700 bg-amber-50/50">
                      KSh {row.fee}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        row.calc.termMonths === 6 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-slate-900 text-amber-300'
                      }`}>
                        {row.calc.termMonths} Months ({row.calc.installmentsCount} Installments)
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-extrabold text-orange-600">{formatKES(row.calc.totalRepayment)}</td>
                    <td className="px-6 py-3.5 text-xs font-bold text-slate-900">
                      {formatKES(row.calc.monthlyInstallment)} / month
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-orange-50/30 text-xs text-slate-500 border-t border-orange-100 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <p>
              * Once your application is reviewed and approved, an M-PESA STK Push prompt is sent to your registered phone to settle the statutory application fee. After payment confirmation, your loan principal is disbursed to your M-PESA balance. Disbursement is subject to verification and regulatory compliance.
            </p>
          </div>
        </div>

        {/* Loan Terms Summary */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-2 text-sm">Loan Amount &amp; Repayment Period</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Loan amount: KSh 500 to KSh 50,000 (subject to credit assessment)</li>
              <li>• Repayment period: 30 to 180 days</li>
              <li>• Monthly installment structure for terms up to 6 months</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-2 text-sm">Late Payment &amp; Renewal Policies</h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Late repayments attract charges as set out in your loan agreement</li>
              <li>• Defaults may be reported to licensed Credit Reference Bureaus</li>
              <li>• Loan renewal is subject to repayment history and re-qualification</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Compliance statement:</strong> All loan applications are subject to verification, eligibility checks, credit assessment, and final approval. Loan approval is not guaranteed. Processing times may vary. Terms and conditions apply.
          </p>
        </div>

      </div>
    </section>
  );
};
