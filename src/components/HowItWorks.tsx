import React from 'react';
import { 
  Sliders, 
  FileText, 
  CheckCircle, 
  Smartphone, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface HowItWorksProps {
  onStartApply: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartApply }) => {
  const steps = [
    {
      number: '01',
      title: 'Select Loan & Term',
      desc: 'Use our loan calculator to choose your cash amount (KSh 3,000 to KSh 100,000) and review the application fee and transparent installment breakdown.',
      icon: <Sliders className="w-6 h-6 text-orange-600" />,
      badge: 'Step 1'
    },
    {
      number: '02',
      title: 'Complete the Online Form',
      desc: 'Provide your Kenyan National ID and registered Safaricom M-PESA number. No guarantor visits required.',
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      badge: 'Step 2'
    },
    {
      number: '03',
      title: 'Application Review',
      desc: 'Our scoring engine reviews your application in line with CBK responsible lending rules. Review your pre-agreement contract terms and electronically sign.',
      icon: <CheckCircle className="w-6 h-6 text-orange-600" />,
      badge: 'Step 3'
    },
    {
      number: '04',
      title: 'STK Fee & Loan Disbursement',
      desc: 'Once approved, initiate the M-PESA STK Push to pay the statutory application fee. Your approved loan amount is then disbursed to your M-PESA wallet.',
      icon: <Smartphone className="w-6 h-6 text-orange-600" />,
      badge: 'Step 4'
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-orange-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 font-['Outfit']">
            How LendPlus Works in Kenya
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            We've redesigned personal digital lending in Kenya to be a simple, paperless, and transparent online application with direct M-PESA payouts upon approval.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step) => (
            <div 
              key={step.number}
              className="relative p-6 rounded-3xl bg-orange-50/20 border border-slate-200 hover:border-orange-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-orange-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-50 transition-transform">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-300 font-['Outfit'] group-hover:text-orange-600 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 font-['Outfit']">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-orange-200/50 flex items-center text-xs font-bold text-orange-600">
                <span>{step.badge}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-1 text-center sm:text-left z-10">
            <h4 className="text-xl font-bold font-['Outfit']">Ready to apply for a loan to your M-PESA?</h4>
            <p className="text-sm text-slate-300">Applications are reviewed promptly. Our team operates 24/7.</p>
          </div>
          <button
            onClick={onStartApply}
            className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center gap-2 shrink-0 transition-all transform hover:-translate-y-0.5 z-10"
          >
            <span>Start M-PESA Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
