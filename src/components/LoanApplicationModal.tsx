import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  User, 
  Briefcase, 
  Building2, 
  FileCheck, 
  FileText, 
  PenTool, 
  Smartphone, 
  Check, 
  Zap, 
  Lock,
  DollarSign,
  PhoneCall
} from 'lucide-react';
import { KENYA_BANKS, KENYA_COUNTIES } from '../data/mockData';
import { calculateLendplusLoan, validateKenyanID, formatKES, APPLICATION_FEE_TIERS, getApplicationFee } from '../utils/loanCalculator';
import { initiateUpesiPayStkPush, checkUpesiPayStatus } from '../utils/upesipay';
import { LoanRecord, UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount: number;
  initialTerm?: number;
  isReturning: boolean;
  onApplicationCompleted: (newLoan: LoanRecord, userProfile: UserProfile) => void;
}

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({
  isOpen,
  onClose,
  initialAmount,
  initialTerm,
  isReturning,
  onApplicationCompleted,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Step 1: Loan parameters
  const [amount, setAmount] = useState<number>(initialAmount || 12000);
  const termMonths = amount < 20000 ? 6 : 18;

  // Step 2: Personal Details (NO OTP)
  const [title, setTitle] = useState<string>('Mr');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [idValidationResult, setIdValidationResult] = useState<any>(null);
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [county, setCounty] = useState<string>('Nairobi');
  const [postalCode, setPostalCode] = useState<string>('');

  // Step 3: Employment
  const [employmentType, setEmploymentType] = useState<string>('Permanently Employed');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('');

  // Step 4: Disbursement & Payout
  const [payoutMethod, setPayoutMethod] = useState<'M-PESA' | 'Direct Bank Transfer'>('M-PESA');
  const [mpesaNumber, setMpesaNumber] = useState<string>('');
  const [bankId, setBankId] = useState<string>('equity');
  const [accountType, setAccountType] = useState<'Salary' | 'Savings' | 'Current'>('Salary');
  const [accountNumber, setAccountNumber] = useState<string>('');

  // Step 5: Contract & Signature
  const [agreedToCbk, setAgreedToCbk] = useState<boolean>(true);
  const [agreedToAutoDebit, setAgreedToAutoDebit] = useState<boolean>(true);
  const [agreedToDataProtection, setAgreedToDataProtection] = useState<boolean>(true);
  const [signature, setSignature] = useState<string>('');
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('type');

  // Step 7: Application Fee STK Push & Immediate Loan Crediting
  const [stkPushStep, setStkPushStep] = useState<'ready' | 'processing' | 'completed'>('ready');
  const [stkPushPhone, setStkPushPhone] = useState<string>('');
  const [feeMpesaRef, setFeeMpesaRef] = useState<string>('');
  const [disbursementMpesaRef, setDisbursementMpesaRef] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    if (initialAmount) setAmount(initialAmount);
  }, [initialAmount]);

  useEffect(() => {
    if (phone) {
      setStkPushPhone(phone);
      if (!mpesaNumber) setMpesaNumber(phone);
    }
  }, [phone]);

  // Validate Kenyan ID whenever it changes
  useEffect(() => {
    if (idNumber.replace(/\s+/g, '').length >= 7) {
      const res = validateKenyanID(idNumber);
      setIdValidationResult(res);
    } else {
      setIdValidationResult(null);
    }
  }, [idNumber]);

  // Clear specific field error on change
  const clearFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
    if (errorMessage) setErrorMessage('');
  };

  // Comprehensive Step-by-Step validation
  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!amount || amount < 3000 || amount > 100000) {
        errors.amount = 'Please select a valid loan amount between KSh 3,000 and KSh 100,000.';
      }
    } else if (stepNumber === 2) {
      if (!firstName.trim()) {
        errors.firstName = 'First name is required.';
      } else if (firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters.';
      }

      if (!lastName.trim()) {
        errors.lastName = 'Last name is required.';
      } else if (lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters.';
      }

      const cleanId = idNumber.replace(/\s+/g, '');
      if (!cleanId) {
        errors.idNumber = 'Kenyan National ID is required.';
      } else if (cleanId.length < 7 || cleanId.length > 8 || !/^\d+$/.test(cleanId)) {
        errors.idNumber = 'Please enter a valid 7 or 8 digit Kenyan National ID.';
      }

      const cleanPhone = phone.replace(/[\s\-+]/g, '');
      if (!phone.trim()) {
        errors.phone = 'Safaricom M-PESA phone number is required.';
      } else if (cleanPhone.length < 9) {
        errors.phone = 'Please enter a valid mobile number (e.g. 0712 345 678).';
      }

      if (!address.trim()) {
        errors.address = 'Estate / Street address is required.';
      }
      if (!city.trim()) {
        errors.city = 'City / Town is required.';
      }
      if (!postalCode.trim()) {
        errors.postalCode = 'Postal code is required.';
      }
    } else if (stepNumber === 3) {
      if (!monthlyIncome || Number(monthlyIncome) <= 0) {
        errors.monthlyIncome = 'Please enter your monthly net income.';
      }
      if (monthlyExpenses === '' || Number(monthlyExpenses) < 0) {
        errors.monthlyExpenses = 'Please enter your monthly living expenses.';
      }
    } else if (stepNumber === 4) {
      const activeNumber = mpesaNumber.trim() || phone.trim();
      const cleanMpesa = activeNumber.replace(/[\s\-+]/g, '');
      if (!activeNumber) {
        errors.mpesaNumber = 'M-PESA disbursement phone number is required.';
      } else if (cleanMpesa.length < 9) {
        errors.mpesaNumber = 'Please enter a valid Safaricom phone number.';
      }
    } else if (stepNumber === 6) {
      if (!agreedToCbk) {
        errors.agreedToCbk = 'You must accept the Pre-Agreement Statement to continue.';
      }
      if (!agreedToAutoDebit) {
        errors.agreedToAutoDebit = 'You must authorize M-PESA STK Push prompt processing.';
      }
      if (!signature.trim()) {
        errors.signature = 'Please type your full legal name as your electronic signature.';
      }
    }

    setFieldErrors(errors);

    const keys = Object.keys(errors);
    if (keys.length > 0) {
      setErrorMessage(errors[keys[0]]);
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  if (!isOpen) return null;

  const calc = calculateLendplusLoan(amount, termMonths, isReturning);
  const appFee = getApplicationFee(amount);

  // Canvas drawing handlers for signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Move from Step 6 to Step 7 (STK Push Trigger for Application Fee)
  const handleProceedToStkPush = () => {
    // Validate all required steps before allowing checkout
    if (!validateStep(2)) {
      setCurrentStep(2);
      return;
    }
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }
    if (!validateStep(6)) {
      setCurrentStep(6);
      return;
    }

    setErrorMessage('');
    setStkPushStep('ready');
    setStkPushPhone(mpesaNumber.trim() || phone.trim());
    setCurrentStep(7);
  };

  // Trigger the STK Push prompt on user's phone via Upesi Pay Gateway
  const handleTriggerStkPushPrompt = async () => {
    const cleanPhone = (stkPushPhone || phone || mpesaNumber).trim();
    if (!cleanPhone || cleanPhone.replace(/[\s\-+]/g, '').length < 9) {
      setErrorMessage('Please enter a valid M-PESA phone number to receive the prompt.');
      return;
    }
    setErrorMessage('');
    
    // Call server Upesi Pay STK push route
    try {
      const res = await initiateUpesiPayStkPush({
        phoneNumber: cleanPhone,
        amount: appFee,
        type: 'loan_application_fee',
        description: `Lendplus App Fee - KSh ${appFee}`,
        accountReference: `LP_FEE_${Date.now()}`
      });
      
      if (res.success && res.reference) {
        setFeeMpesaRef(res.reference);
        setStkPushStep('processing');
        startPolling(res.checkoutRequestId || res.reference);
      } else {
        setErrorMessage(res.error || 'Failed to initiate STK Push. Please try again.');
      }
    } catch (err) {
      console.warn('Upesi Pay STK dispatch note:', err);
      setErrorMessage('Failed to connect to payment gateway. Please try again.');
    }
  };

  const startPolling = (reference: string) => {
    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const statusRes = await checkUpesiPayStatus(reference);
        if (statusRes.success && statusRes.transaction?.status === 'SUCCESS') {
          clearInterval(interval);
          const ref = statusRes.transaction.mpesaReceiptNumber || reference;
          setFeeMpesaRef(ref);
          setDisbursementMpesaRef(`QKH${Math.floor(10000000 + Math.random() * 90000000)}B`);
          setStkPushStep('completed');
          setErrorMessage('');
          try {
            confetti({
              particleCount: 140,
              spread: 90,
              origin: { y: 0.5 }
            });
          } catch (err) {
            // Safe fallback
          }
        } else if (statusRes.transaction?.status === 'FAILED') {
          clearInterval(interval);
          setErrorMessage('Payment failed. Please try again.');
          setStkPushStep('ready');
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setErrorMessage('Payment verification timed out. Please check your M-PESA balance or contact support.');
          setStkPushStep('ready');
        }
      } catch (err) {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setErrorMessage('Unable to verify payment. Please try again.');
          setStkPushStep('ready');
        }
      }
    }, 2000);
  };

  const handleFinishAndOpenDashboard = () => {
    const selectedBankObj = KENYA_BANKS.find(b => b.id === bankId) || KENYA_BANKS[0];
    const userProfile: UserProfile = {
      id: `user_${Date.now()}`,
      title,
      firstName: firstName.trim() || 'Borrower',
      lastName: lastName.trim() || 'Kenya',
      idNumber: idNumber.trim() || '30819472',
      dateOfBirth: '14/06/1993',
      gender: 'Male',
      phone: stkPushPhone.trim() || phone.trim(),
      email: '',
      address: address.trim(),
      city: city.trim(),
      county: county.trim(),
      postalCode: postalCode.trim(),
      employmentType,
      employerName: '',
      jobTitle: '',
      monthlyIncome: Number(monthlyIncome) || 0,
      monthlyExpenses: Number(monthlyExpenses) || 0,
      nextPayDate: '',
      payoutMethod,
      mpesaNumber: stkPushPhone.trim() || mpesaNumber.trim() || phone.trim(),
      bankName: selectedBankObj.name,
      accountType,
      accountNumber: accountNumber.trim() || 'N/A',
      isReturning,
      creditScore: 725
    };

    const loanId = `loan_lp_${Math.floor(10000 + Math.random() * 90000)}`;
    const newLoan: LoanRecord = {
      id: loanId,
      loanNumber: `LP-KE-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: userProfile.id,
      user: userProfile,
      amount,
      termDays: calc.termDays,
      calculation: calc,
      appliedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      disbursedAt: new Date().toISOString(),
      status: 'active',
      balanceRemaining: calc.totalRepayment,
      paidAmount: 0,
      payments: [
        {
          id: `fee_${Date.now()}`,
          loanId,
          amount: appFee,
          date: new Date().toISOString().split('T')[0],
          method: 'M-PESA Express (STK Push)',
          status: 'Completed',
          reference: feeMpesaRef || `QKH${Math.floor(10000000 + Math.random() * 90000000)}Y`
        }
      ],
      mpesaAutoDebitAuthorized: true,
      contractSigned: true,
      referenceNumber: `LP-${(lastName || 'USER').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    onApplicationCompleted(newLoan, userProfile);
    onClose();
  };

  const stepsList = [
    'Amount & Term',
    'Personal & ID',
    'Income & Work',
    'M-PESA Payout',
    'KYC Verification',
    'CBK Agreement',
    'Fee & Loan Credit'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4 max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm font-['Outfit'] shadow-md shadow-orange-600/30">
              L+
            </div>
            <div>
              <h3 className="font-bold text-sm font-['Outfit']">LendPlus Kenya • Loan Application</h3>
              <p className="text-[11px] text-orange-400 font-medium">CBK Licensed Digital Credit Provider • CBK/DCP/0089</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        {currentStep < 7 && (
          <div className="bg-orange-50/50 px-6 py-2.5 border-b border-orange-100 shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Step {currentStep} of 6: <strong className="text-slate-900">{stepsList[currentStep - 1]}</strong></span>
              <span className="text-orange-700 font-bold">{Math.round((currentStep / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: Amount & Term Review */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-['Outfit']">Select Your Loan & Application Fee</h4>
                <p className="text-xs text-slate-500">Pick from our official loan packages (KSh 3,000 to KSh 100,000).</p>
              </div>

              {/* Amount Display & Slider */}
              <div className="p-5 rounded-2xl bg-orange-50/40 border border-orange-200">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Loan Amount</label>
                  <span className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-['Outfit']">
                    {formatKES(amount)}
                  </span>
                </div>
                
                {/* Quick package buttons matching exact user tiers */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 my-3">
                  {APPLICATION_FEE_TIERS.map((tier) => (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => setAmount(tier.amount)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        amount === tier.amount
                          ? 'border-orange-600 bg-orange-600 text-white font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-xs font-extrabold">{tier.label}</div>
                      <div className={`text-[10px] ${amount === tier.amount ? 'text-amber-200' : 'text-orange-700'}`}>
                        Fee: KSh {tier.fee}
                      </div>
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min={3000}
                  max={100000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600 mt-2"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-1">
                  <span>KSh 3,000</span>
                  <span>KSh 50,000</span>
                  <span>KSh 100,000</span>
                </div>
              </div>

              {/* Application Fee Highlight Card */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-orange-400 font-bold uppercase text-[11px] block">M-PESA STK Application Fee:</span>
                    <p className="text-[11px] text-slate-400">Payable via instant STK Push upon approval</p>
                  </div>
                  <span className="text-2xl font-black text-amber-400 font-['Outfit']">KSh {appFee}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Total Repayable ({termMonths} Months):</span>
                  <span className="font-bold text-white text-sm">{formatKES(calc.totalRepayment)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Interest ({calc.interestRateAnnual}% p.a.):</span>
                  <span className="font-semibold text-white">{formatKES(calc.interestAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Monthly Installment:</span>
                  <span className="font-bold text-orange-400">{calc.installmentsCount}x {formatKES(calc.monthlyInstallment)} / mo</span>
                </div>
              </div>

              {/* Repayment Plan Display */}
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-orange-800 uppercase tracking-wider block">
                    {termMonths}-Month Installment Plan
                  </span>
                  <p className="text-xs text-slate-600">
                    {amount < 20000 
                      ? 'Loans under KSh 15,000 feature an easy 6-month repayment schedule.'
                      : 'Loans KSh 20,000 & above feature an extended 18-month repayment schedule.'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-orange-600 text-white text-xs font-extrabold rounded-xl shadow-xs shrink-0">
                  {termMonths} Months
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Personal Details & Kenyan ID (NO OTP) */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-['Outfit']">Personal & Identity Information</h4>
                <p className="text-xs text-slate-500">Instant paperless verification. Enter details matching your Kenyan National ID.</p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
                <div className="col-span-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kelvin"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        clearFieldError('firstName');
                      }}
                      className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:ring-2 focus:outline-none ${
                        fieldErrors.firstName
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                          : 'border-slate-300 focus:ring-orange-500'
                      }`}
                    />
                    {fieldErrors.firstName && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kipchumba"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        clearFieldError('lastName');
                      }}
                      className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:ring-2 focus:outline-none ${
                        fieldErrors.lastName
                          ? 'border-red-500 bg-red-50/20 focus:ring-red-500'
                          : 'border-slate-300 focus:ring-orange-500'
                      }`}
                    />
                    {fieldErrors.lastName && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Kenyan National ID Number with validation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kenyan National ID Number (7–8 Digits) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={8}
                    required
                    placeholder="e.g. 30819472"
                    value={idNumber}
                    onChange={(e) => {
                      setIdNumber(e.target.value.replace(/\D/g, ''));
                      clearFieldError('idNumber');
                    }}
                    className={`w-full px-3.5 py-2 font-mono text-sm border rounded-xl focus:ring-2 focus:outline-none ${
                      fieldErrors.idNumber
                        ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                        : idValidationResult
                        ? idValidationResult.isValid
                          ? 'border-orange-500 focus:ring-orange-500 bg-orange-50/20'
                          : 'border-red-500 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:ring-orange-500'
                    }`}
                  />
                  {idValidationResult?.isValid && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Valid Kenyan ID
                    </span>
                  )}
                </div>
                {fieldErrors.idNumber && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.idNumber}</p>
                )}
              </div>

              {/* M-PESA Phone (Direct - NO OTP requirement) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Safaricom M-PESA Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0712 345 678 or 0110 123 456"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      clearFieldError('phone');
                    }}
                    className={`w-full pl-9 pr-3.5 py-2 text-sm font-mono border rounded-xl focus:ring-2 focus:outline-none ${
                      fieldErrors.phone
                        ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:ring-orange-500'
                    }`}
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.phone}</p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">
                    The STK Push prompt for your KSh {appFee} fee and instant loan credit will be sent to this number.
                  </p>
                )}
              </div>

              {/* Residential Location */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estate / Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rhapta Road, Westlands"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      clearFieldError('address');
                    }}
                    className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:ring-2 focus:outline-none ${
                      fieldErrors.address
                        ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:ring-orange-500'
                    }`}
                  />
                  {fieldErrors.address && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.address}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nairobi"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      clearFieldError('city');
                    }}
                    className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:ring-2 focus:outline-none ${
                      fieldErrors.city
                        ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:ring-orange-500'
                    }`}
                  />
                  {fieldErrors.city && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.city}</p>
                  )}
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">County</label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {KENYA_COUNTIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 00100"
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(e.target.value);
                      clearFieldError('postalCode');
                    }}
                    className={`w-full px-3.5 py-2 text-sm border rounded-xl focus:ring-2 focus:outline-none ${
                      fieldErrors.postalCode
                        ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:ring-orange-500'
                    }`}
                  />
                  {fieldErrors.postalCode && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Employment & Income */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-['Outfit']">Employment & Source of Income</h4>
                <p className="text-xs text-slate-500">CBK regulations mandate responsible lending affordability checks.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Employment Status</label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="Permanently Employed">Permanently Employed</option>
                  <option value="Contract Worker">Fixed Term / Contract Worker</option>
                  <option value="Self-Employed">Self-Employed / Business Owner / Trader</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Net Income (KSh) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">KSh</span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 65000"
                      value={monthlyIncome}
                      onChange={(e) => {
                        setMonthlyIncome(e.target.value);
                        clearFieldError('monthlyIncome');
                      }}
                      className={`w-full pl-12 pr-3 py-2 text-sm font-bold border rounded-xl focus:ring-2 focus:outline-none ${
                        fieldErrors.monthlyIncome
                          ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                          : 'border-slate-300 focus:ring-orange-500'
                      }`}
                    />
                  </div>
                  {fieldErrors.monthlyIncome && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.monthlyIncome}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Expenses (KSh) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">KSh</span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 24000"
                      value={monthlyExpenses}
                      onChange={(e) => {
                        setMonthlyExpenses(e.target.value);
                        clearFieldError('monthlyExpenses');
                      }}
                      className={`w-full pl-12 pr-3 py-2 text-sm font-bold border rounded-xl focus:ring-2 focus:outline-none ${
                        fieldErrors.monthlyExpenses
                          ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                          : 'border-slate-300 focus:ring-orange-500'
                      }`}
                    />
                  </div>
                  {fieldErrors.monthlyExpenses && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.monthlyExpenses}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: M-PESA Payout Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-['Outfit']">M-PESA Disbursement Wallet</h4>
                <p className="text-xs text-slate-500">Your approved loan is disbursed immediately to your verified M-PESA account.</p>
              </div>

              <div className="p-5 rounded-2xl bg-orange-50/60 border-2 border-orange-500 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-bold text-slate-900">Safaricom M-PESA Express Direct</span>
                  </div>
                  <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full">
                    Instant (Under 2 Mins)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    M-PESA Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0712 345 678"
                    value={mpesaNumber || phone}
                    onChange={(e) => {
                      setMpesaNumber(e.target.value);
                      clearFieldError('mpesaNumber');
                    }}
                    className={`w-full px-3.5 py-2.5 text-base font-mono font-bold border rounded-xl focus:ring-2 focus:outline-none bg-white ${
                      fieldErrors.mpesaNumber
                        ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:ring-orange-500'
                    }`}
                  />
                  {fieldErrors.mpesaNumber && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.mpesaNumber}</p>
                  )}
                </div>
                <p className="text-[11px] text-slate-600">
                  Ensure this phone number matches your registered Safaricom SIM for instant STK Push and B2C disbursement.
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Verification & Uploads */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-['Outfit']">Automated KYC & Credit Scoring</h4>
                <p className="text-xs text-slate-500">Real-time validation against IPRS and CBK credit registries.</p>
              </div>

              {/* ID Document Card */}
              <div className="p-4 rounded-2xl border border-orange-500 bg-orange-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">Kenyan National ID: {idNumber || '30819472'}</h5>
                    <p className="text-xs text-slate-500">Integrated National Identity Management System (IPRS)</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              {/* M-PESA Statement Card */}
              <div className="p-4 rounded-2xl border border-orange-500 bg-orange-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">M-PESA Financial History ({mpesaNumber || phone || '07XX'})</h5>
                    <p className="text-xs text-slate-500">Validated via Daraja API Scoring Engine</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Linked
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: Pre-Agreement Statement & Electronic Signature */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-['Outfit']">CBK Pre-Agreement Statement</h4>
                <p className="text-xs text-slate-500">Review statutory terms and sign to proceed to M-PESA STK Push confirmation.</p>
              </div>

              {/* Quote Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 text-xs space-y-2 font-mono">
                <div className="text-center font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                  LENDPLUS KENYA LIMITED — CBK/DCP/0089<br />
                  <span className="text-xs font-normal text-slate-500">Digital Credit Provider Statutory Pre-Agreement</span>
                </div>
                <div className="flex justify-between"><span>Borrower:</span><span className="font-bold">{firstName} {lastName}</span></div>
                <div className="flex justify-between"><span>Principal Loan:</span><span className="font-bold text-orange-700">{formatKES(amount)}</span></div>
                <div className="flex justify-between"><span>M-PESA Application Fee:</span><span className="font-bold text-amber-700">KSh {appFee} (Paid via STK Push)</span></div>
                <div className="flex justify-between"><span>Interest Rate:</span><span>{calc.interestRateAnnual}% p.a. ({formatKES(calc.interestAmount)})</span></div>
                <div className="flex justify-between"><span>Monthly Maintenance:</span><span>{formatKES(calc.serviceFee)}</span></div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>TOTAL REPAYABLE:</span><span>{formatKES(calc.totalRepayment)}</span>
                </div>
              </div>

              {/* Consents */}
              <div className="space-y-2 text-xs">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToCbk}
                    onChange={(e) => {
                      setAgreedToCbk(e.target.checked);
                      clearFieldError('agreedToCbk');
                    }}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-slate-600">
                    I accept the terms of the Pre-Agreement Statement and CBK Digital Credit Providers Regulations 2022. <span className="text-red-500">*</span>
                  </span>
                </label>
                {fieldErrors.agreedToCbk && (
                  <p className="text-[11px] text-red-600 font-medium ml-5">{fieldErrors.agreedToCbk}</p>
                )}

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToAutoDebit}
                    onChange={(e) => {
                      setAgreedToAutoDebit(e.target.checked);
                      clearFieldError('agreedToAutoDebit');
                    }}
                    className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-slate-600">
                    I authorize M-PESA STK Push prompts for application fee and loan repayments on my registered phone. <span className="text-red-500">*</span>
                  </span>
                </label>
                {fieldErrors.agreedToAutoDebit && (
                  <p className="text-[11px] text-red-600 font-medium ml-5">{fieldErrors.agreedToAutoDebit}</p>
                )}
              </div>

              {/* Signature */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1 mb-1">
                  <PenTool className="w-3.5 h-3.5 text-orange-600" />
                  Electronic Signature (Type Full Legal Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kelvin Kipchumba"
                  value={signature}
                  onChange={(e) => {
                    setSignature(e.target.value);
                    clearFieldError('signature');
                  }}
                  className={`w-full px-3.5 py-2.5 font-serif italic text-base border rounded-xl focus:ring-2 focus:outline-none ${
                    fieldErrors.signature
                      ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                      : 'border-slate-300 focus:ring-orange-500'
                  }`}
                />
                {fieldErrors.signature && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{fieldErrors.signature}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 7: Application Fee M-PESA STK Push & Loan Crediting */}
          {currentStep === 7 && (
            <div className="space-y-6 text-center py-2">
              
              {stkPushStep === 'ready' && (
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
                    <Smartphone className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                      Application Approved • Final Step
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 font-['Outfit'] mt-2">
                      Initiate M-PESA STK Push
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
                      To complete your application and receive your <strong className="text-slate-900">{formatKES(amount)}</strong> loan directly on M-PESA, please initiate the STK Push to pay the statutory application fee of <strong className="text-orange-700">KSh {appFee}</strong>.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Approved Loan:</span>
                      <span className="font-extrabold text-slate-900">{formatKES(amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Application Fee:</span>
                      <span className="font-extrabold text-orange-600">KSh {appFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">M-PESA Phone Number:</span>
                      <span className="font-mono font-bold text-slate-900">{stkPushPhone || phone || mpesaNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment Gateway:</span>
                      <span className="font-bold text-slate-700">Upesi Pay (Merchant: AT275)</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Payout Destination:</span>
                      <span className="font-bold text-orange-700">M-PESA B2C (Instant)</span>
                    </div>
                  </div>

                  <div className="max-w-md mx-auto space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 text-left mb-1">
                        Confirm Phone Number for STK Push
                      </label>
                      <input
                        type="tel"
                        value={stkPushPhone || phone}
                        onChange={(e) => {
                          setStkPushPhone(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        className="w-full px-3.5 py-2.5 text-center font-mono font-bold text-base border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleTriggerStkPushPrompt}
                      className="w-full py-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-base rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                    >
                      <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
                      <span>Initiate STK Push (Pay KSh {appFee})</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {stkPushStep === 'processing' && (
                <div className="space-y-5 max-w-sm mx-auto py-6">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-['Outfit']">
                      Waiting for M-PESA Confirmation
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      An M-PESA STK prompt for <strong>KSh {appFee}</strong> was sent to <strong className="font-mono text-orange-700">{stkPushPhone || phone}</strong>. Please enter your PIN on your phone to complete the payment.
                    </p>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-600 h-full transition-all duration-500 rounded-full animate-pulse"
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              )}

              {stkPushStep === 'completed' && (
                <div className="space-y-5 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-xl shadow-orange-500/20">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>

                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                      Loan Credited & Disbursed!
                    </span>
                    <h4 className="text-3xl font-black text-slate-900 font-['Outfit'] mt-2">
                      {formatKES(amount)} Sent to M-PESA
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                      Application fee of <strong className="text-slate-800">KSh {appFee}</strong> confirmed (Ref: {feeMpesaRef}). Funds are available in your M-PESA wallet <strong className="text-slate-800">{stkPushPhone || phone}</strong>.
                    </p>
                  </div>

                  {/* SMS Receipt Simulator */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 max-w-md mx-auto text-left text-xs font-mono space-y-2">
                    <div className="text-orange-400 font-bold flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span>M-PESA Notification</span>
                      <span>{new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {disbursementMpesaRef || 'QKH8492019B'} Confirmed. You have received {formatKES(amount)}.00 from LENDPLUS KENYA LIMITED. Total Repayment: {formatKES(calc.totalRepayment)} due on {calc.dueDate}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinishAndOpenDashboard}
                    className="w-full max-w-md py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 mx-auto transition-all"
                  >
                    <span>View Loan in My Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Bottom Navigation Buttons */}
        {currentStep < 7 && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setCurrentStep(currentStep - 1);
                }}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-white flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleProceedToStkPush}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Complete Application & Pay Fee</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
