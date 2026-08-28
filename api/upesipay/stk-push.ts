export const config = { runtime: 'nodejs' };

const UPESIPAY_INITIATE_URL = process.env.UPESIPAY_STK_PUSH_URL || 'https://upesipay.com/api/v2/collections/initiate/';
const UPESIPAY_CHANNEL_ID = process.env.UPESIPAY_CHANNEL_ID || '';
const UPESIPAY_BASIC_AUTH = process.env.UPESIPAY_BASIC_AUTH || '';

function normalizeKenyanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

async function readJson(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk; });
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
    req.on('error', reject);
  });
}

async function readResponse(response: Response): Promise<any> {
  const text = await response.text();
  try { return text ? JSON.parse(text) : {}; } catch { return { message: text || response.statusText }; }
}

function callbackUrl(req: any): string {
  if (process.env.UPESIPAY_CALLBACK_URL) return process.env.UPESIPAY_CALLBACK_URL;
  const host = req.headers['x-forwarded-host'] || req.headers.host || req.headers['x-vercel-url'];
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  return `${protocol}://${host}/api/upesipay/callback`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  if (!UPESIPAY_BASIC_AUTH || !UPESIPAY_CHANNEL_ID) {
    return res.status(500).json({ success: false, error: 'UpesiPay is not configured on the server.' });
  }

  try {
    const { phoneNumber, amount } = await readJson(req);
    const phone = normalizeKenyanPhone(String(phoneNumber || ''));
    const amountKes = Math.round(Number(amount));

    if (!/^2547\d{8}$/.test(phone)) {
      return res.status(400).json({ success: false, error: 'Enter a valid Safaricom number in the form 07XXXXXXXX or 2547XXXXXXXX.' });
    }
    if (!Number.isFinite(amountKes) || amountKes < 1 || amountKes > 500000) {
      return res.status(400).json({ success: false, error: 'Amount must be between KES 1 and KES 500,000.' });
    }

    // Official UpesiPay v2 collections API payload. Do not send undocumented v1 fields.
    const payload = {
      channel_id: Number(UPESIPAY_CHANNEL_ID),
      phone_number: phone,
      amount: amountKes,
      callback_url: callbackUrl(req),
    };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    let response: Response;
    try {
      response = await fetch(UPESIPAY_INITIATE_URL, {
        method: 'POST',
        headers: { Authorization: UPESIPAY_BASIC_AUTH, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const gateway = await readResponse(response);
    const data = gateway?.data;
    if (!response.ok || gateway?.success !== true || !data?.checkout_request_id) {
      console.error('[UpesiPay] STK initiation rejected', { status: response.status, gateway });
      return res.status(response.ok ? 502 : response.status).json({
        success: false,
        error: gateway?.message || 'UpesiPay did not accept the STK Push request.',
        code: gateway?.error_code,
      });
    }

    return res.status(200).json({
      success: true,
      message: gateway.message,
      // UpesiPay uses this value as the callback and status-query reference.
      reference: data.checkout_request_id,
      checkoutRequestId: data.checkout_request_id,
      merchantRequestId: data.merchant_request_id,
      amount: data.amount ?? amountKes,
      phoneNumber: data.phone_number ?? phone,
      status: 'PENDING',
      liveGateway: true,
    });
  } catch (error: any) {
    const message = error?.name === 'AbortError' ? 'UpesiPay did not respond in time.' : 'Unable to reach UpesiPay.';
    console.error('[UpesiPay] STK push error:', error);
    return res.status(502).json({ success: false, error: message });
  }
}
