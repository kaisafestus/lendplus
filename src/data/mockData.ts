import { UserProfile, LoanRecord, FaqItem } from '../types';
import { calculateLendplusLoan } from '../utils/loanCalculator';

export const KENYA_BANKS = [
  { id: 'mpesa', name: 'Safaricom M-PESA', code: 'MPESA', popular: true, logoColor: '#00a859', isMobileMoney: true },
  { id: 'airtel', name: 'Airtel Money', code: 'AIRTEL', popular: true, logoColor: '#e40000', isMobileMoney: true },
  { id: 'kcb', name: 'KCB Bank Kenya', code: '01', popular: true, logoColor: '#005b94' },
  { id: 'equity', name: 'Equity Bank Kenya', code: '68', popular: true, logoColor: '#a32020' },
  { id: 'coop', name: 'Co-operative Bank of Kenya', code: '11', popular: true, logoColor: '#008542' },
  { id: 'ncba', name: 'NCBA Bank Kenya', code: '07', popular: true, logoColor: '#1c3f60' },
  { id: 'absa_ke', name: 'Absa Bank Kenya', code: '03', popular: true, logoColor: '#b70124' },
  { id: 'stanbic_ke', name: 'Stanbic Bank Kenya', code: '31', popular: false, logoColor: '#0033aa' },
  { id: 'dtb', name: 'Diamond Trust Bank (DTB)', code: '63', popular: false, logoColor: '#532e85' },
  { id: 'family', name: 'Family Bank', code: '70', popular: false, logoColor: '#d66a00' },
  { id: 'stanchart_ke', name: 'Standard Chartered Kenya', code: '02', popular: false, logoColor: '#0072aa' },
  { id: 'im_bank', name: 'I&M Bank Kenya', code: '57', popular: false, logoColor: '#002f6c' },
];

export const SA_BANKS = KENYA_BANKS; // alias

export const KENYA_COUNTIES = [
  'Nairobi',
  'Mombasa',
  'Kiambu',
  'Nakuru',
  'Kisumu',
  'Machakos',
  'Uasin Gishu (Eldoret)',
  'Kajiado',
  'Meru',
  'Kilifi',
  'Nyeri',
  'Kakamega',
  'Bungoma',
  'Murang\'a',
  'Laikipia',
  'Kisii',
];

export const SA_PROVINCES = KENYA_COUNTIES; // alias

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user_active_1',
    title: 'Ms',
    firstName: 'Faith',
    lastName: 'Wanjiku',
    idNumber: '29481023',
    dateOfBirth: '15/04/1994',
    gender: 'Female',
    phone: '+254 722 456 789',
    email: 'faith.wanjiku@example.co.ke',
    address: 'Rhapta Road, Westlands',
    city: 'Nairobi',
    county: 'Nairobi',
    postalCode: '00100',
    employmentType: 'Permanently Employed',
    employerName: 'Safaricom PLC',
    jobTitle: 'Senior Operations Associate',
    monthlyIncome: 85000,
    monthlyExpenses: 34000,
    nextPayDate: '2026-08-31',
    payoutMethod: 'M-PESA',
    mpesaNumber: '0722 456 789',
    bankName: 'Equity Bank Kenya',
    accountType: 'Salary',
    accountNumber: '0180293847291',
    isReturning: false,
    creditScore: 710
  },
  {
    id: 'user_vip_2',
    title: 'Mr',
    firstName: 'Brian',
    lastName: 'Ochieng',
    idNumber: '24819034',
    dateOfBirth: '22/09/1989',
    gender: 'Male',
    phone: '+254 710 987 654',
    email: 'brian.ochieng@example.co.ke',
    address: 'Kilimani, Argwings Kodhek Rd',
    city: 'Nairobi',
    county: 'Nairobi',
    postalCode: '00100',
    employmentType: 'Permanently Employed',
    employerName: 'Kenya Airways',
    jobTitle: 'Senior Systems Engineer',
    monthlyIncome: 145000,
    monthlyExpenses: 52000,
    nextPayDate: '2026-08-25',
    payoutMethod: 'M-PESA',
    mpesaNumber: '0710 987 654',
    bankName: 'KCB Bank Kenya',
    accountType: 'Current',
    accountNumber: '1120938475',
    isReturning: true,
    creditScore: 780
  }
];

export const INITIAL_DEMO_LOANS: LoanRecord[] = [
  {
    id: 'loan_lp_94821',
    loanNumber: 'LP-KE-2026-94821',
    userId: 'user_active_1',
    user: DEMO_USERS[0],
    amount: 15000,
    termDays: 61,
    calculation: calculateLendplusLoan(15000, 61, false),
    appliedAt: '2026-08-10T09:30:00Z',
    approvedAt: '2026-08-10T09:33:10Z',
    disbursedAt: '2026-08-10T09:34:00Z',
    status: 'active',
    balanceRemaining: 9250,
    paidAmount: 8500,
    mpesaAutoDebitAuthorized: true,
    contractSigned: true,
    referenceNumber: 'LP94821-WANJIKU',
    payments: [
      {
        id: 'pay_901',
        loanId: 'loan_lp_94821',
        amount: 8500,
        date: '2026-08-20',
        method: 'M-PESA Express (STK Push)',
        status: 'Completed',
        reference: 'QKD82910J5'
      }
    ]
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq_1',
    category: 'General',
    question: 'What is LendPlus Kenya and is it regulated by the Central Bank of Kenya?',
    answer: 'LendPlus Kenya is an authorized digital credit platform operated by Lendplus Kenya Limited (Registration No: PVT-AYUQ782). We are fully licensed as a Digital Credit Provider (DCP) by the Central Bank of Kenya (CBK License: CBK/DCP/2023/048) under the CBK Digital Credit Providers Regulations 2022. All interest rates, fees, and data handling adhere to Kenyan statutory requirements and the Data Protection Act 2019.'
  },
  {
    id: 'faq_2',
    category: 'Application',
    question: 'How much money can I borrow and how is it disbursed?',
    answer: 'First-time borrowers can apply for between KSh 1,000 and KSh 30,000 with flexible terms of 61 to 90 days. Funds are disbursed instantly directly to your registered Safaricom M-PESA or Airtel Money wallet within 3 minutes of automated approval. Timely repayments unlock VIP limits up to KSh 50,000 with lower interest rates.'
  },
  {
    id: 'faq_3',
    category: 'Application',
    question: 'What are the minimum eligibility criteria to qualify for a loan in Kenya?',
    answer: 'To qualify for a LendPlus Kenya loan: 1) You must be a Kenyan citizen aged 20 to 60 years; 2) Possess a valid Kenyan National ID Card (7-8 digits); 3) Have an active Safaricom M-PESA or Airtel Money registered in your legal name for at least 6 months; 4) Have a regular monthly source of income or business earnings.'
  },
  {
    id: 'faq_4',
    category: 'Fees & Rates',
    question: 'How are interest rates and processing fees calculated under CBK guidelines?',
    answer: 'Our rates are fully transparent with zero hidden fees. Interest is 3.5% per month (42% p.a.) for first-time applicants, and 2.5% per month (30% p.a.) for returning VIP borrowers. Processing and facilitation fee is 7% - 9% (inclusive of 20% Kenya Excise Duty as per the Finance Act), and monthly account technology maintenance is KSh 150/month.'
  },
  {
    id: 'faq_5',
    category: 'Application',
    question: 'How fast will I receive my money on M-PESA?',
    answer: 'Our proprietary algorithmic scoring model performs instant real-time KYC and credit risk assessment. Once you accept your loan quote, funds hit your M-PESA phone number in under 2 minutes (24/7, including weekends and public holidays).'
  },
  {
    id: 'faq_6',
    category: 'Repayment',
    question: 'How do I repay my loan via M-PESA Paybill or STK Push?',
    answer: 'You can repay anytime via: 1) Instant M-PESA STK Push directly from your LendPlus dashboard (you enter your phone and PIN prompt appears automatically); 2) M-PESA Paybill: Go to Lipa na M-PESA > Paybill > Enter Business No. 4085435 > Account No: Your National ID or Loan Number; 3) Pesalink / Direct Bank Transfer.'
  },
  {
    id: 'faq_7',
    category: 'Repayment',
    question: 'Can I settle my loan early without penalty in Kenya?',
    answer: 'Yes! LendPlus encourages responsible borrowing. You can settle your outstanding loan balance early at any time with zero early repayment fees, saving on future monthly service fees.'
  },
  {
    id: 'faq_8',
    category: 'Safety & CBK',
    question: 'Is my personal information and CRB data protected in Kenya?',
    answer: 'Yes. LendPlus Kenya is fully registered with the Office of the Data Protection Commissioner (ODPC) under the Data Protection Act 2019. We never share your data with unauthorized third parties or contact your phonebook. Credit information is securely reported to licensed Kenyan Credit Reference Bureaus (Metropol, TransUnion, Creditinfo).'
  }
];

export const COMPANY_DETAILS = {
  name: 'Lendplus Kenya Limited',
  regNumber: 'PVT-AYUQ782',
  cbkLicense: 'CBK/DCP/0089',
  cbkNumber: 'CBK/DCP/0089',
  ncrNumber: 'CBK/DCP/0089', // alias for components
  mpesaPaybill: '4085435',
  mpesaTill: '984210',
  phone: '+254 709 219 000',
  helpPhone: '+254 700 888 222',
  email: 'support@lendplus.co.ke',
  address: 'Mirage Tower 2, 7th Floor, Chiromo Road, Westlands, Nairobi, Kenya',
  hours: 'Monday – Friday: 08:00 – 18:00 | Saturday: 08:00 – 14:00 (EAT)',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=ke.lendplus&pli=1'
};

