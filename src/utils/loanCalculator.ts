import { LoanCalculation, InstallmentScheduleItem } from '../types';

/**
 * Official Lendplus Kenya Loan & Application Fee Tiers
 * Format:
 * 92.....loan 3k
 * 142.....6000
 * 240....12000
 * 290......20000
 * 350.....30000
 * 399.....40000
 * 499...50000
 * 699.....60000
 * 749.....70000
 * 800....80000
 * 899....90000
 * 999.....100000
 */
export const APPLICATION_FEE_TIERS = [
  { amount: 3000, fee: 92, label: 'KSh 3,000' },
  { amount: 6000, fee: 142, label: 'KSh 6,000' },
  { amount: 12000, fee: 240, label: 'KSh 12,000' },
  { amount: 20000, fee: 290, label: 'KSh 20,000' },
  { amount: 30000, fee: 350, label: 'KSh 30,000' },
  { amount: 40000, fee: 399, label: 'KSh 40,000' },
  { amount: 50000, fee: 499, label: 'KSh 50,000' },
  { amount: 60000, fee: 699, label: 'KSh 60,000' },
  { amount: 70000, fee: 749, label: 'KSh 70,000' },
  { amount: 80000, fee: 800, label: 'KSh 80,000' },
  { amount: 90000, fee: 899, label: 'KSh 90,000' },
  { amount: 100000, fee: 999, label: 'KSh 100,000' },
];

export function getApplicationFee(loanAmount: number): number {
  if (loanAmount <= 3000) return 92;
  if (loanAmount <= 6000) return 142;
  if (loanAmount <= 12000) return 240;
  if (loanAmount <= 20000) return 290;
  if (loanAmount <= 30000) return 350;
  if (loanAmount <= 40000) return 399;
  if (loanAmount <= 50000) return 499;
  if (loanAmount <= 60000) return 699;
  if (loanAmount <= 70000) return 749;
  if (loanAmount <= 80000) return 800;
  if (loanAmount <= 90000) return 899;
  return 999;
}

export function getRepaymentMonths(loanAmount: number): number {
  return loanAmount < 20000 ? 6 : 18;
}

/**
 * Calculates Kenyan CBK compliant digital credit loan costs for Lendplus Kenya
 * - Principal: KSh 3,000 - KSh 100,000
 * - Terms: 
 *    - Below KSh 15,000: 6 Months repayment plan
 *    - KSh 20,000 and above: 18 Months repayment plan
 * - Interest: 42% per annum (3.5% monthly) standard, 30% per annum (2.5% monthly) returning
 * - Facilitation / processing fee & KSh 150/mo service fee
 */
export function calculateLendplusLoan(
  principal: number,
  customMonths?: number,
  isReturning: boolean = false
): LoanCalculation {
  const safePrincipal = Math.max(3000, Math.min(principal, 100000));
  const termMonths = customMonths || getRepaymentMonths(safePrincipal);
  const termDays = termMonths * 30;

  // Application Fee according to the exact fee schedule
  const applicationFee = getApplicationFee(safePrincipal);

  // Interest rate: 42% p.a. (3.5%/mo) first time, 30% p.a. (2.5%/mo) returning
  const annualRate = isReturning ? 0.30 : 0.42;
  const monthlyRate = annualRate / 12;
  const interestAmount = Math.round(safePrincipal * monthlyRate * termMonths);

  // Processing & Facilitation Fee (inclusive of Kenyan Excise Duty)
  const feeRate = isReturning ? 0.05 : 0.07;
  const initiationFee = Math.round(safePrincipal * feeRate);

  // Monthly Service & Technology Fee: KSh 150 per month
  const serviceFee = Math.round(150 * termMonths);

  // Total Repayment
  const totalRepayment = safePrincipal + interestAmount + initiationFee + serviceFee;

  // Approximate APR
  const totalFeesAndInterest = interestAmount + initiationFee + serviceFee;
  const apr = Math.round(((totalFeesAndInterest / safePrincipal) / (termMonths / 12)) * 100);

  // Due Date calculation (final month from today)
  const today = new Date();
  const dueDateObj = new Date(today.getFullYear(), today.getMonth() + termMonths, today.getDate());
  const dueDate = dueDateObj.toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Installments Schedule (6 or 18 monthly installments)
  const installmentsCount = termMonths;
  const installmentAmount = Math.round(totalRepayment / installmentsCount);

  const schedule: InstallmentScheduleItem[] = [];

  for (let i = 1; i <= installmentsCount; i++) {
    const instDateObj = new Date(today.getFullYear(), today.getMonth() + i, today.getDate());
    const amount = (i === installmentsCount)
      ? totalRepayment - (installmentAmount * (installmentsCount - 1))
      : installmentAmount;

    schedule.push({
      installmentNumber: i,
      dueDate: instDateObj.toLocaleDateString('en-KE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      amount: amount,
      principalPortion: Math.round(safePrincipal / installmentsCount),
      interestPortion: Math.round(interestAmount / installmentsCount),
      feePortion: Math.round((initiationFee + serviceFee) / installmentsCount),
      status: 'upcoming'
    });
  }

  return {
    principal: safePrincipal,
    termMonths,
    termDays,
    applicationFee,
    isReturningCustomer: isReturning,
    interestRateAnnual: isReturning ? 30 : 42,
    interestAmount,
    initiationFee,
    serviceFee,
    totalRepayment,
    apr,
    dueDate,
    monthlyInstallment: installmentAmount,
    installmentsCount,
    schedule
  };
}

/**
 * Validates a Kenyan National ID Number (7-8 numeric digits) or Alien ID
 */
export function validateKenyanID(idNumber: string): {
  isValid: boolean;
  error?: string;
} {
  const cleanId = idNumber.replace(/\s+/g, '');
  if (!cleanId) {
    return { isValid: false, error: 'National ID number is required.' };
  }
  // Kenyan National IDs are standard 7 or 8 numeric digits (some military/alien are 6-9 digits)
  if (!/^\d{7,8}$/.test(cleanId)) {
    return { isValid: false, error: 'Kenyan National ID must be 7 or 8 numeric digits.' };
  }

  return { isValid: true };
}

/**
 * Validates a Kenyan Mobile Phone (M-PESA / Airtel: 07XX, 01XX, +2547XX, +2541XX)
 */
export function validateKenyanPhone(phone: string): {
  isValid: boolean;
  formatted?: string;
  error?: string;
} {
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  if (!cleanPhone) {
    return { isValid: false, error: 'Kenyan phone number is required.' };
  }

  // Regex matches: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX, 2541XXXXXXXX, +2547XXXXXXXX, +2541XXXXXXXX
  const kenyanRegex = /^(?:\+?254|0)?([71]\d{8})$/;
  const match = cleanPhone.match(kenyanRegex);

  if (!match) {
    return { isValid: false, error: 'Enter a valid Kenyan mobile number (e.g. 0712 345 678 or 0110 123 456).' };
  }

  const normalized = `+254 ${match[1].substring(0, 3)} ${match[1].substring(3, 6)} ${match[1].substring(6)}`;
  return {
    isValid: true,
    formatted: normalized
  };
}

/**
 * Format currency to Kenyan Shillings (KSh / KES)
 */
export function formatKES(amount: number): string {
  return 'KSh ' + Math.round(amount).toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Backward-compatible alias for any residual imports
export const formatZAR = formatKES;
export const validateSouthAfricanID = (idNumber: string) => validateKenyanID(idNumber);

