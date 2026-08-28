export const config = { runtime: 'nodejs' };

const UPESIPAY_STATUS_URL = process.env.UPESIPAY_STATUS_URL || 'https://upesipay.com/api/v2/transaction-status';
const UPESIPAY_BASIC_AUTH = process.env.UPESIPAY_BASIC_AUTH || '';

async function readResponse(response: Response): Promise<any> {
  const text = await response.text();
  try { return text ? JSON.parse(text) : {}; } catch { return { message: text || response.statusText }; }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const reference = String(req.query.reference || '');
  if (!reference) return res.status(400).json({ success: false, error: 'Transaction reference is required.' });
  if (!UPESIPAY_BASIC_AUTH) return res.status(500).json({ success: false, error: 'UpesiPay is not configured on the server.' });

  try {
    const response = await fetch(`${UPESIPAY_STATUS_URL}?reference=${encodeURIComponent(reference)}`, {
      headers: { Authorization: UPESIPAY_BASIC_AUTH },
    });
    const gateway = await readResponse(response);
    if (!response.ok || gateway?.success !== true) {
      return res.status(response.ok ? 502 : response.status).json({ success: false, error: gateway?.message || 'Unable to retrieve transaction status.' });
    }

    const transaction = gateway.data || {};
    const status = String(transaction.status || '').toLowerCase();
    return res.status(200).json({
      success: true,
      transaction: {
        reference,
        checkoutRequestId: transaction.checkout_request_id || reference,
        merchantRequestId: transaction.merchant_request_id,
        phoneNumber: transaction.phone_number,
        amount: transaction.amount,
        status: status === 'success' ? 'SUCCESS' : ['failed', 'cancelled', 'timeout'].includes(status) ? 'FAILED' : 'PENDING',
        mpesaReceiptNumber: transaction.mpesa_receipt_number || transaction.receipt_number,
      },
    });
  } catch (error: any) {
    console.error('[UpesiPay] Status error:', error);
    return res.status(502).json({ success: false, error: 'Unable to reach UpesiPay status service.' });
  }
}
