import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  Smartphone, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { formatKES } from '../utils/loanCalculator';
import { initiateUpesiPayStkPush, checkUpesiPayStatus } from '../utils/upesipay';
import confetti from 'canvas-confetti';

interface OzowPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanNumber: string;
  defaultAmount: number;
  onPaymentSuccess: (amount: number, method: any, reference: string) => void;
}

export const OzowPaymentModal: React.FC<OzowPaymentModalProps> = ({
  isOpen,
  onClose,
  loanNumber,
  defaultAmount,
  onPaymentSuccess,
}) => {
  const [payAmount, setPayAmount] = useState<number>(defaultAmount || 3750);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [error, setError] = useState<string>('');
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const startPolling = (reference: string) => {
    let attempts = 0;
    const maxAttempts = 30;

    const finishSuccess = (ref: string) => {
      clearInterval(pollingRef.current!);
      pollingRef.current = null;
      setPaymentRef(ref);
      setIsProcessing(false);
      setStep('success');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }
      onPaymentSuccess(payAmount, 'Upesi Pay M-PESA Express (STK Push)', ref);
    };

    const finishError = (message: string) => {
      clearInterval(pollingRef.current!);
      pollingRef.current = null;
      setIsProcessing(false);
      setError(message);
      setStep('input');
    };

    pollingRef.current = window.setInterval(async () => {
      attempts++;
      try {
        const statusRes = await checkUpesiPayStatus(reference);
        if (statusRes.success && statusRes.transaction?.status === 'SUCCESS') {
          finishSuccess(statusRes.transaction.mpesaReceiptNumber || reference);
        } else if (statusRes.transaction?.status === 'FAILED') {
          finishError('Payment failed. Please try again.');
        } else if (attempts >= maxAttempts) {
          finishError('Payment verification timed out. Please check your M-PESA balance or contact support.');
        }
      } catch (err) {
        if (attempts >= maxAttempts) {
          finishError('Unable to verify payment. Please try again.');
        }
      }
    }, 2000);
  };

  const handleSendStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim() || phoneNumber.trim().length < 9) {
      setError('Please enter a valid Safaricom M-PESA phone number.');
      return;
    }
    setError('');
    setIsProcessing(true);

    try {
      const res = await initiateUpesiPayStkPush({
        phoneNumber: phoneNumber.trim(),
        amount: payAmount,
        type: 'loan_repayment',
        description: `Lendplus Loan ${loanNumber} Repayment`,
        accountReference: `LP_REP_${loanNumber}`
      });
      
      if (res.success && res.reference) {
        setPaymentRef(res.reference);
        setStep('processing');
        startPolling(res.checkoutRequestId || res.reference);
      } else {
        setIsProcessing(false);
        setError(res.error || 'Failed to initiate STK Push. Please try again.');
      }
    } catch (err) {
      console.warn('Upesi Pay STK dispatch note:', err);
      setIsProcessing(false);
      setError('Failed to connect to payment gateway. Please try again.');
    }
  };

  const handleReset = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setStep('input');
    setIsProcessing(false);
    setPaymentRef('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-orange-500 text-white px-2.5 py-1 rounded-lg font-black text-sm tracking-tight font-['Outfit']">
              UPESI PAY
            </div>
            <div>
              <span className="text-sm font-bold text-white block">M-PESA Express (STK Push)</span>
              <p className="text-[11px] text-orange-400 flex items-center gap-1 font-medium">
                <Lock className="w-3 h-3" /> Merchant ID: AT275 • Channel: 99
              </p>
            </div>
          </div>
          {step === 'input' && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Payment Meta Info */}
        <div className="bg-orange-50/70 px-5 py-3 border-b border-orange-200/60 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-500">Merchant:</span>
            <span className="font-bold text-slate-900 ml-1">Lendplus Kenya (AT275)</span>
          </div>
          <div>
            <span className="text-slate-500">Loan Number:</span>
            <span className="font-mono font-bold text-orange-700 ml-1">{loanNumber}</span>
          </div>
        </div>

        {/* Step 1: Input Details */}
        {step === 'input' && (
          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 flex items-center gap-2.5 text-xs text-orange-950 font-semibold">
              <Zap className="w-4 h-4 text-orange-600 shrink-0 fill-orange-600" />
              <span>M-PESA STK Push: A PIN prompt will pop up on your phone.</span>
            </div>

            {/* Repayment Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount to Repay (KSh)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">KSh</span>
                <input
                  type="number"
                  min={100}
                  max={100000}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-2.5 text-base font-extrabold text-slate-900 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[1500, 3750, defaultAmount].filter((v, i, a) => a.indexOf(v) === i && v > 0).map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPayAmount(amt)}
                    className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 font-semibold rounded-lg transition-colors"
                  >
                    {formatKES(amt)}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSendStkPush} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Safaricom M-PESA Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="07XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">A PIN prompt will appear on this phone after the STK push is initiated.</p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Initiating Upesi Pay STK Push...</span>
                  </>
                ) : (
                  <>
                    <span>Send M-PESA STK Prompt ({formatKES(payAmount)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Upesi Pay Gateway • Prompt ledger reconciliation</span>
            </div>
          </div>
        )}

        {/* Step 2: Waiting for M-PESA Confirmation */}
        {step === 'processing' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900 font-['Outfit']">Waiting for M-PESA Confirmation</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                An M-PESA STK prompt for <strong className="text-slate-900">{formatKES(payAmount)}</strong> was sent to <strong>{phoneNumber}</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-900 text-white border border-slate-800 rounded-2xl text-xs font-mono text-left space-y-1.5">
              <div className="text-orange-400 font-bold uppercase tracking-wider text-[10px]">Upesi Pay • Safaricom STK Prompt</div>
              <p className="text-slate-300">Please enter your M-PESA PIN on your phone to complete the payment.</p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Cancel and return
            </button>
          </div>
        )}

        {/* Step 3: Success Receipt */}
        {step === 'success' && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider bg-orange-100 px-2.5 py-0.5 rounded-full">
                Payment Confirmed!
              </span>
              <h4 className="text-xl font-black text-slate-900 font-['Outfit'] mt-2">
                {formatKES(payAmount)} Received
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Your loan balance has been updated.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">M-PESA Ref:</span>
                <span className="font-bold text-slate-900">{paymentRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway:</span>
                <span className="font-semibold text-slate-800">Upesi Pay (Merchant: AT275)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel:</span>
                <span className="font-semibold text-slate-800">Channel ID: 99 (STK Push)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="text-slate-700">{new Date().toLocaleString('en-KE')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Done & Return to Account
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
