import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ComplianceDisclaimer: React.FC<{ variant?: 'banner' | 'inline' }> = ({ variant = 'banner' }) => {
  if (variant === 'inline') {
    return (
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
        <p>
          Loan approval is subject to eligibility verification, credit assessment, and compliance checks. Processing times may vary. Terms and conditions apply.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-start gap-2.5 text-[11px] sm:text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold">LendPlus Kenya</strong> provides a digital loan application platform. Loan approval is subject to eligibility verification, credit assessment, and regulatory compliance requirements. Processing times may vary. Approval is not guaranteed. Terms and conditions apply.
        </p>
      </div>
    </div>
  );
};
