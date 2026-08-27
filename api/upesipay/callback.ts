export const config = {
  runtime: 'nodejs',
};

const UPESIPAY_CONFIG = {
  apiUsername: process.env.UPESIPAY_API_USERNAME || 'kyz1LAZ6m0gq5dDrXufm',
  apiPassword: process.env.UPESIPAY_API_PASSWORD || 'F11tPB3NCaGDIjfLOPdhQj3lizdX0vjkPhsi1PpZ',
  basicAuth: process.env.UPESIPAY_BASIC_AUTH || 'Basic a3l6MUxBWjZtMGdxNWREclh1Zm06RjExdFBCM05DYUdESWpmTE9QZGhRajNsaXpkWDB2amtQaHNpMVBwWg==',
  merchantId: process.env.UPESIPAY_MERCHANT_ID || 'AT275',
  channelId: process.env.UPESIPAY_CHANNEL_ID || '99',
  baseUrl: process.env.UPESIPAY_BASE_URL || 'https://api.upesipay.com',
  callbackUrl: process.env.UPESIPAY_CALLBACK_URL || '',
};

function normalizeKenyanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) {
    return digits;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `254${digits.substring(1)}`;
  }
  if (digits.length === 9) {
    return `254${digits}`;
  }
  return digits;
}

declare global {
  // eslint-disable-next-line no-var
  var lendplusTransactionsDb: Map<string, {
    reference: string;
    checkoutRequestId: string;
    merchantRequestId?: string;
    phoneNumber: string;
    amount: number;
    type: 'loan_application_fee' | 'loan_repayment';
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    mpesaReceiptNumber?: string;
    timestamp: string;
    description: string;
    rawResponse?: any;
  }> | undefined;
}

function getTransactionsDb(): Map<string, {
  reference: string;
  checkoutRequestId: string;
  merchantRequestId?: string;
  phoneNumber: string;
  amount: number;
  type: 'loan_application_fee' | 'loan_repayment';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  mpesaReceiptNumber?: string;
  timestamp: string;
  description: string;
  rawResponse?: any;
}> {
  if (!global.lendplusTransactionsDb) {
    global.lendplusTransactionsDb = new Map();
  }
  return global.lendplusTransactionsDb;
}

function getRequestBody(req: any): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

interface TransactionRecord {
  reference: string;
  checkoutRequestId: string;
  merchantRequestId?: string;
  phoneNumber: string;
  amount: number;
  type: 'loan_application_fee' | 'loan_repayment';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  mpesaReceiptNumber?: string;
  timestamp: string;
  description: string;
  rawResponse?: any;
}

export default async function handler(req: any, res: any) {
  const transactionsDb = getTransactionsDb();

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const body = await getRequestBody(req);
    const callbackData = body ? JSON.parse(body) : {};
    console.log('[UpesiPay Webhook IPN Received]:', JSON.stringify(callbackData, null, 2));

    const ref = callbackData?.reference || callbackData?.account_reference || callbackData?.BillRefNumber;
    const receipt = callbackData?.mpesa_receipt || callbackData?.MpesaReceiptNumber || callbackData?.TransID;
    const resultCode = callbackData?.result_code ?? callbackData?.ResultCode;

    if (ref && transactionsDb.has(ref)) {
      const record = transactionsDb.get(ref)! as TransactionRecord;
      if (resultCode === 0 || resultCode === '0' || callbackData?.status === 'SUCCESS') {
        record.status = 'SUCCESS';
        record.mpesaReceiptNumber = receipt || `QKH${Math.floor(10000000 + Math.random() * 90000000)}Y`;
      } else {
        record.status = 'FAILED';
      }
      record.rawResponse = callbackData;
    }

    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Callback processed successfully',
    });
  } catch (err: any) {
    console.error('[UpesiPay Webhook Error]:', err);
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
}
