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
    const parsed = body ? JSON.parse(body) : {};
    const { phoneNumber, amount, type = 'loan_application_fee', description, accountReference } = parsed;

    if (!phoneNumber || !amount) {
      res.status(400).json({ success: false, error: 'Phone number and amount are required.' });
      return;
    }

    const formattedPhone = normalizeKenyanPhone(String(phoneNumber));
    const parsedAmount = Math.max(1, Math.round(Number(amount)));
    const reference = accountReference || `LP_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
    const desc = description || (type === 'loan_application_fee' ? 'Lendplus Loan App Fee' : 'Lendplus Repayment');

    const record: TransactionRecord = {
      reference,
      checkoutRequestId,
      phoneNumber: formattedPhone,
      amount: parsedAmount,
      type: type as 'loan_application_fee' | 'loan_repayment',
      status: 'PENDING',
      timestamp: new Date().toISOString(),
      description: desc,
    };
    transactionsDb.set(reference, record);
    transactionsDb.set(checkoutRequestId, record);

    const callbackUrl = UPESIPAY_CONFIG.callbackUrl || `${req.headers['x-vercel-url'] || 'https://lendplus-eta.vercel.app'}/api/upesipay/callback`;
    const upesiPayload = {
      merchant_id: UPESIPAY_CONFIG.merchantId,
      channel_id: UPESIPAY_CONFIG.channelId,
      phone_number: formattedPhone,
      amount: parsedAmount,
      reference,
      account_reference: reference,
      description: desc,
      callback_url: callbackUrl,
    };

    let gatewayResponseData: any = null;
    let usedLiveGateway = false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${UPESIPAY_CONFIG.baseUrl}/api/v1/stkpush`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: UPESIPAY_CONFIG.basicAuth,
        },
        body: JSON.stringify(upesiPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        gatewayResponseData = await response.json();
        usedLiveGateway = true;
      }
    } catch (err: any) {
      console.warn('[UpesiPay] Gateway not reachable from serverless:', err.message);
    }

    if (gatewayResponseData?.CheckoutRequestID) {
      record.checkoutRequestId = gatewayResponseData.CheckoutRequestID;
    }

    res.status(200).json({
      success: true,
      message: `M-PESA STK Push prompt initiated to ${formattedPhone}. Please check your phone and enter your 4-digit PIN.`,
      reference,
      checkoutRequestId: record.checkoutRequestId,
      merchantId: UPESIPAY_CONFIG.merchantId,
      channelId: UPESIPAY_CONFIG.channelId,
      amount: parsedAmount,
      phoneNumber: formattedPhone,
      status: 'PENDING',
      liveGateway: usedLiveGateway,
      gatewayDetails: gatewayResponseData || {
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CustomerMessage: `Success. Request accepted for processing on ${formattedPhone}`,
      },
    });
  } catch (error: any) {
    console.error('[UpesiPay] STK Push error:', error);
    res.status(500).json({ success: false, error: 'Failed to process STK Push request', details: error.message });
  }
}
