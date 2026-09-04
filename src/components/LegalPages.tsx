import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, UserCheck } from 'lucide-react';

interface LegalPagesProps {
  open: 'privacy' | 'terms' | 'eligibility' | 'rates' | null;
  onClose: () => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ open, onClose }) => {
  if (!open) return null;

  const isPrivacy = open === 'privacy';
  const isTerms = open === 'terms';
  const isEligibility = open === 'eligibility';
  const isRates = open === 'rates';

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-orange-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {isPrivacy && <ShieldCheck className="w-5 h-5 text-orange-400" />}
            {isTerms && <FileText className="w-5 h-5 text-orange-400" />}
            {isEligibility && <UserCheck className="w-5 h-5 text-orange-400" />}
            {isRates && <FileText className="w-5 h-5 text-orange-400" />}
            <h3 className="font-bold text-base font-['Outfit']">
              {isPrivacy && 'Privacy Policy'}
              {isTerms && 'Terms & Conditions'}
              {isEligibility && 'Eligibility & Loan Terms'}
              {isRates && 'Loan Terms, Rates & Repayment'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-sm text-slate-700 space-y-4 leading-relaxed">
          {isPrivacy && (
            <>
              <p>
                <strong>LendPlus Kenya Limited</strong> (&ldquo;LendPlus&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a digital credit provider licensed by the Central Bank of Kenya under license <strong>CBK/DCP/0089</strong>. This Privacy Policy describes how we collect, use, store, and share your personal information in compliance with the Kenya Data Protection Act, 2019.
              </p>
              <h4 className="font-bold text-slate-900 pt-2">1. Information We Collect</h4>
              <p>We collect your Kenyan National ID number, phone number, M-PESA number, employment or business details, and supporting documents required to process your loan application and comply with CBK regulations.</p>
              <h4 className="font-bold text-slate-900 pt-2">2. How We Use Your Information</h4>
              <p>Your data is used to verify your identity, perform credit assessment, process loan applications, disburse approved loan amounts via M-PESA, recover outstanding balances, and meet our regulatory reporting obligations.</p>
              <h4 className="font-bold text-slate-900 pt-2">3. Sharing with Credit Reference Bureaus</h4>
              <p>LendPlus reports loan performance data to licensed Credit Reference Bureaus (CRBs) in Kenya including Metropol, TransUnion, and Creditinfo in line with the CRB Act and CBK regulations.</p>
              <h4 className="font-bold text-slate-900 pt-2">4. Your Rights</h4>
              <p>You have the right to access, correct, or request deletion of your personal data, subject to our legal and regulatory retention obligations. Contact our Data Protection Officer at <strong>support@lendplus.co.ke</strong>.</p>
              <h4 className="font-bold text-slate-900 pt-2">5. Data Security</h4>
              <p>We use 256-bit SSL encryption and industry-standard safeguards to protect your information. We do not sell or share your data with unauthorized third parties.</p>
            </>
          )}

          {isTerms && (
            <>
              <p>
                By using the LendPlus Kenya platform, you agree to the following terms and conditions, which govern your use of our website, mobile application, and lending services.
              </p>
              <h4 className="font-bold text-slate-900 pt-2">1. Eligibility</h4>
              <p>You must be a Kenyan citizen aged 18 to 65 years, hold a valid Kenyan National ID, have an active Safaricom M-PESA or Airtel Money number registered in your name, and meet our credit assessment criteria.</p>
              <h4 className="font-bold text-slate-900 pt-2">2. Loan Approval</h4>
              <p>All loan applications are subject to verification, eligibility checks, credit assessment, and final approval. Approval is not guaranteed. LendPlus reserves the right to decline any application.</p>
              <h4 className="font-bold text-slate-900 pt-2">3. Interest, Fees & Repayment</h4>
              <p>Interest, processing fees, and statutory application fees are disclosed before disbursement. Repayment periods, installment amounts, and any applicable late payment charges are stated in your loan agreement.</p>
              <h4 className="font-bold text-slate-900 pt-2">4. Late Payment & Default</h4>
              <p>Late repayments may attract additional charges as set out in your loan agreement and may be reported to licensed Credit Reference Bureaus, affecting your future creditworthiness.</p>
              <h4 className="font-bold text-slate-900 pt-2">5. Customer Support</h4>
              <p>For questions or complaints, contact us at <strong>+254 700 888 222</strong> or <strong>support@lendplus.co.ke</strong>. You may also escalate unresolved complaints to the Central Bank of Kenya.</p>
            </>
          )}

          {isEligibility && (
            <>
              <h4 className="font-bold text-slate-900">Minimum Eligibility Criteria</h4>
              <p>To apply for a LendPlus loan, you must meet all of the following criteria:</p>
              <ul className="space-y-2 pt-1">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" /> Be <strong>18 years or older</strong> and a Kenyan citizen or legal resident.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" /> Possess a <strong>valid Kenyan National ID</strong> (7 or 8 digits) or Alien ID.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" /> Have an <strong>active mobile phone number</strong> registered with Safaricom M-PESA or Airtel Money in your name.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" /> <strong>Meet lending and credit assessment criteria</strong>, including a verifiable monthly income of at least KSh 15,000.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" /> Have an acceptable Credit Reference Bureau (CRB) standing under CBK responsible lending rules.</li>
              </ul>
              <p className="pt-2">Meeting these criteria does not guarantee loan approval. Each application is subject to verification and a final credit assessment.</p>
            </>
          )}

          {isRates && (
            <>
              <h4 className="font-bold text-slate-900">Loan Amount & Repayment Period</h4>
              <ul className="space-y-1.5 pt-1">
                <li>• <strong>Loan Amount:</strong> KSh 500 to KSh 50,000 (subject to credit assessment)</li>
                <li>• <strong>Repayment Period:</strong> 30 to 180 days</li>
                <li>• <strong>Interest Rate:</strong> 3.5% per month (42% p.a.) for standard borrowers; 2.5% per month (30% p.a.) for VIP borrowers</li>
                <li>• <strong>Processing & Facilitation Fee:</strong> 7% – 9% (inclusive of 20% Kenya Excise Duty)</li>
                <li>• <strong>Account Technology Maintenance:</strong> KSh 150 per month</li>
              </ul>

              <h4 className="font-bold text-slate-900 pt-3">Late Payment Policy</h4>
              <p>Late repayments attract additional fees as outlined in your loan agreement. Continued default may result in reporting to licensed Credit Reference Bureaus and may affect your future creditworthiness.</p>

              <h4 className="font-bold text-slate-900 pt-3">Loan Renewal Policy</h4>
              <p>Loan renewal is subject to repayment history, current credit standing, and re-qualification. Renewals are offered at LendPlus&rsquo;s discretion and are not automatic.</p>

              <h4 className="font-bold text-slate-900 pt-3">Early Settlement</h4>
              <p>You may settle your loan in full or partially at any time with zero early settlement penalty.</p>

              <p className="pt-3 text-xs text-slate-500">
                All amounts and rates are subject to change in line with CBK regulations. The full schedule is provided in your individual loan agreement and the CBK-mandated pre-agreement statement.
              </p>
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-500">CBK Licensed Digital Credit Provider • License CBK/DCP/0089</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
