export interface LoanCalculation {
  principal: number;
  termMonths: number; // 6 months for <15k, 18 months for >=20k
  termDays: number;
  applicationFee: number; // Mandatory upfront processing fee paid via M-PESA STK Push
  isReturningCustomer: boolean;
  interestRateAnnual: number;
  interestAmount: number;
  initiationFee: number; // Processing & facilitation fee (inclusive of excise duty)
  serviceFee: number; // Monthly maintenance
  totalRepayment: number;
  apr: number;
  dueDate: string;
  monthlyInstallment: number;
  installmentsCount: number;
  schedule: InstallmentScheduleItem[];
}

export interface InstallmentScheduleItem {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  principalPortion: number;
  interestPortion: number;
  feePortion: number;
  status: 'upcoming' | 'paid' | 'overdue';
}

export interface UserProfile {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  idNumber: string; // Kenyan National ID (7-8 digits) or Alien ID
  dateOfBirth?: string;
  gender?: 'Male' | 'Female';
  phone: string; // Kenyan Phone e.g. 0722123456 / +254722123456
  email: string;
  address: string;
  city: string;
  county: string; // Kenyan County e.g. Nairobi, Kiambu, Mombasa
  postalCode: string;
  
  // Employment
  employmentType: string;
  employerName: string;
  jobTitle: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  nextPayDate: string;

  // Disbursement & Mobile Wallet
  payoutMethod: 'M-PESA' | 'Direct Bank Transfer';
  mpesaNumber?: string;
  bankName?: string;
  accountType?: 'Savings' | 'Current' | 'Salary';
  accountNumber?: string;
  branchCode?: string;

  isReturning: boolean;
  creditScore?: number;
  password?: string;
}

export interface LoanRecord {
  id: string;
  loanNumber: string;
  userId: string;
  user: UserProfile;
  amount: number;
  termDays: number;
  calculation: LoanCalculation;
  appliedAt: string;
  approvedAt?: string;
  disbursedAt?: string;
  status: 'pending' | 'under_review' | 'approved' | 'disbursed' | 'active' | 'paid' | 'rejected';
  balanceRemaining: number;
  paidAmount: number;
  payments: PaymentTransaction[];
  mpesaAutoDebitAuthorized?: boolean;
  contractSigned: boolean;
  referenceNumber: string;
}

export interface PaymentTransaction {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  method: 'M-PESA Express (STK Push)' | 'M-PESA Paybill (4085435)' | 'M-PESA Express';
  status: 'Completed' | 'Processing' | 'Failed';
  reference: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Application' | 'Fees & Rates' | 'Repayment' | 'Safety & CBK';
}
