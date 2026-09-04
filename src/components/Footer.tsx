import React from 'react';

interface FooterProps {
  onSelectTab?: (tab: string) => void;
  onOpenApply?: () => void;
  onOpenLegal?: (page: 'privacy' | 'terms' | 'eligibility' | 'rates') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-slate-400">
          <div>
            © 2026 Lendplus Kenya Limited. All rights reserved. Central Bank of Kenya DCP License #CBK/DCP/0089.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <button
              type="button"
              onClick={() => onOpenLegal?.('privacy')}
              className="hover:text-slate-200 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => onOpenLegal?.('terms')}
              className="hover:text-slate-200 transition-colors"
            >
              Terms &amp; Conditions
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => onOpenLegal?.('eligibility')}
              className="hover:text-slate-200 transition-colors"
            >
              Eligibility &amp; Loan Terms
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => onOpenLegal?.('rates')}
              className="hover:text-slate-200 transition-colors"
            >
              Rates &amp; Repayment
            </button>
          </div>
        </div>
        <div className="text-center md:text-left text-slate-500 text-[11px] leading-relaxed">
          Customer Support: <span className="text-slate-300 font-semibold">+254 700 888 222</span> • support@lendplus.co.ke • Mirage Tower 2, 7th Floor, Chiromo Road, Westlands, Nairobi, Kenya. LendPlus provides a digital loan application platform. Loan approval is subject to eligibility verification, credit assessment, and regulatory compliance. Processing times may vary. Approval is not guaranteed. Terms and conditions apply.
        </div>
      </div>
    </footer>
  );
};
