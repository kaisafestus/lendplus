import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  UserCheck, 
  Calendar, 
  Briefcase, 
  Building2, 
  Smartphone,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { formatKES } from '../utils/loanCalculator';

interface EligibilitySectionProps {
  onStartApply: () => void;
}

export const EligibilitySection: React.FC<EligibilitySectionProps> = ({ onStartApply }) => {
  // Quick interactive checker state
  const [ageRange, setAgeRange] = useState<string>('18-65');
  const [hasKenyanId, setHasKenyanId] = useState<string>('yes');
  const [employmentStatus, setEmploymentStatus] = useState<string>('employed');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(35000);

  const isEligible = 
    ageRange === '18-65' && 
    hasKenyanId === 'yes' && 
    (employmentStatus === 'employed' || employmentStatus === 'self_employed') &&
    monthlyIncome >= 15000;

  const requirements = [
    {
      icon: <Calendar className="w-5 h-5 text-orange-600" />,
      title: 'Age Requirement',
      desc: 'You must be a Kenyan citizen between 18 and 65 years of age at the time of your application.'
    },
    {
      icon: <UserCheck className="w-5 h-5 text-orange-600" />,
      title: 'Kenyan National ID',
      desc: 'A valid original 7 or 8-digit Republic of Kenya National ID number or registered Alien ID card.'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-orange-600" />,
      title: 'Registered M-PESA or Airtel Line',
      desc: 'An active Safaricom M-PESA or Airtel Money mobile number registered under your own National ID for at least 3 months.'
    },
    {
      icon: <Briefcase className="w-5 h-5 text-orange-600" />,
      title: 'Regular Income / Source of Funds',
      desc: 'Regular monthly income from employment, business, trade or freelancing of at least KSh 15,000/month.'
    },
    {
      icon: <Building2 className="w-5 h-5 text-orange-600" />,
      title: 'Good Credit Record (CRB)',
      desc: 'A verified Credit Reference Bureau (CRB Metropol/TransUnion) standing in line with CBK responsible lending rules.'
    },
  ];

  return (
    <section id="eligibility" className="py-16 sm:py-20 bg-orange-50/40 border-b border-orange-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Who Can Apply in Kenya
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-['Outfit']">
            Loan Eligibility Criteria
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            We practice responsible digital credit lending licensed by the Central Bank of Kenya (CBK). 
            Check if you qualify below in 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Requirements List */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit'] mb-4">
              Standard Requirements
            </h3>

            {requirements.map((req, i) => (
              <div 
                key={i}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                  {req.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{req.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Interactive Eligibility Checker */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                  Kenya Eligibility Pre-Checker
                </h3>
                <p className="text-xs text-slate-500">Test your qualification before applying</p>
              </div>
            </div>

            {/* Question 1: Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. What is your age?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'under_18', label: 'Under 18' },
                  { id: '18-65', label: '18 to 65 years' },
                  { id: 'over_65', label: 'Over 65' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAgeRange(opt.id)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      ageRange === opt.id
                        ? 'border-orange-600 bg-orange-50 text-orange-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Kenyan ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Do you have a valid Kenyan National ID?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHasKenyanId('yes')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    hasKenyanId === 'yes'
                      ? 'border-orange-600 bg-orange-50 text-orange-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Yes, I have Kenyan ID
                </button>
                <button
                  type="button"
                  onClick={() => setHasKenyanId('no')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    hasKenyanId === 'no'
                      ? 'border-red-500 bg-red-50 text-red-800 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  No, Foreign passport only
                </button>
              </div>
            </div>

            {/* Question 3: Employment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. What is your employment or business status?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'employed', label: 'Employed' },
                  { id: 'self_employed', label: 'Self-Employed / Biz' },
                  { id: 'unemployed', label: 'Unemployed' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setEmploymentStatus(opt.id)}
                    className={`py-2 px-2 text-center text-xs font-semibold rounded-xl border transition-all ${
                      employmentStatus === opt.id
                        ? 'border-orange-600 bg-orange-50 text-orange-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: Monthly income */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  4. Monthly Net Income / Revenue
                </label>
                <span className="text-sm font-extrabold text-orange-600 font-['Outfit']">
                  {formatKES(monthlyIncome)}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={150000}
                step={5000}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>KSh 5,000</span>
                <span>KSh 75,000</span>
                <span>KSh 150,000+</span>
              </div>
            </div>

            {/* Result Box */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isEligible
                ? 'bg-orange-50/90 border-orange-300 text-orange-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-start gap-3">
                {isEligible ? (
                  <CheckCircle2 className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold">
                    {isEligible ? 'You May Qualify for a LendPlus Kenya M-PESA Loan' : 'Eligibility Notice'}
                  </h4>
                  <p className="text-xs mt-1 text-slate-600 leading-relaxed">
                    {isEligible
                      ? 'Based on your profile, you may meet the general criteria to apply. Final approval is subject to CBK digital credit requirements, credit assessment, and verification.'
                      : 'To qualify under CBK DCP guidelines, applicants must be 18-65, hold a valid Kenyan ID, and have a monthly income of at least KSh 15,000.'}
                  </p>
                </div>
              </div>
            </div>

            {isEligible && (
              <button
                type="button"
                onClick={onStartApply}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Start Online M-PESA Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
