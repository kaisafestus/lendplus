import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const initiateUrl = process.env.UPESIPAY_STK_PUSH_URL || 'https://upesipay.com/api/v2/collections/initiate/';
const statusUrl = process.env.UPESIPAY_STATUS_URL || 'https://upesipay.com/api/v2/transaction-status';
const basicAuth = process.env.UPESIPAY_BASIC_AUTH || '';
const channelId = process.env.UPESIPAY_CHANNEL_ID || '';

function normalizeKenyanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
  return digits.length === 9 ? `254${digits}` : digits;
}

async function readResponse(response: Response): Promise<any> {
  const text = await response.text();
  try { return text ? JSON.parse(text) : {}; } catch { return { message: text || response.statusText }; }
}

async function startServer() {
  const app = express();
  const port = 3000;
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    gateway: 'UpesiPay',
    channelId: channelId || null,
    configured: Boolean(basicAuth && channelId),
  }));

  app.post('/api/upesipay/stk-push', async (req, res) => {
    if (!basicAuth || !channelId) return res.status(500).json({ success: false, error: 'UpesiPay is not configured on the server.' });
    const phone = normalizeKenyanPhone(String(req.body?.phoneNumber || ''));
    const amount = Math.round(Number(req.body?.amount));
    if (!/^2547\d{8}$/.test(phone)) return res.status(400).json({ success: false, error: 'Enter a valid Safaricom number.' });
    if (!Number.isFinite(amount) || amount < 1 || amount > 500000) return res.status(400).json({ success: false, error: 'Amount must be between KES 1 and KES 500,000.' });

    try {
      const callbackUrl = process.env.UPESIPAY_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/upesipay/callback`;
      const response = await fetch(initiateUrl, {
        method: 'POST',
        headers: { Authorization: basicAuth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel_id: Number(channelId), phone_number: phone, amount, callback_url: callbackUrl }),
      });
      const gateway = await readResponse(response);
      if (!response.ok || gateway?.success !== true || !gateway?.data?.checkout_request_id) {
        return res.status(response.ok ? 502 : response.status).json({ success: false, error: gateway?.message || 'UpesiPay did not accept the STK Push request.' });
      }
      return res.json({
        success: true,
        message: gateway.message,
        reference: gateway.data.checkout_request_id,
        checkoutRequestId: gateway.data.checkout_request_id,
        merchantRequestId: gateway.data.merchant_request_id,
        amount: gateway.data.amount ?? amount,
        phoneNumber: gateway.data.phone_number ?? phone,
        status: 'PENDING',
        liveGateway: true,
      });
    } catch (error) {
      console.error('[UpesiPay] STK push error:', error);
      return res.status(502).json({ success: false, error: 'Unable to reach UpesiPay.' });
    }
  });

  app.get('/api/upesipay/status', async (req, res) => {
    const reference = String(req.query.reference || '');
    if (!reference) return res.status(400).json({ success: false, error: 'Transaction reference is required.' });
    try {
      const response = await fetch(`${statusUrl}?reference=${encodeURIComponent(reference)}`, { headers: { Authorization: basicAuth } });
      const gateway = await readResponse(response);
      if (!response.ok || gateway?.success !== true) return res.status(response.ok ? 502 : response.status).json({ success: false, error: gateway?.message || 'Unable to retrieve transaction status.' });
      const data = gateway.data || {};
      const status = String(data.status || '').toLowerCase();
      return res.json({ success: true, transaction: {
        reference,
        checkoutRequestId: data.checkout_request_id || reference,
        status: status === 'success' ? 'SUCCESS' : ['failed', 'cancelled', 'timeout'].includes(status) ? 'FAILED' : 'PENDING',
        mpesaReceiptNumber: data.mpesa_receipt_number || data.receipt_number,
      }});
    } catch (error) {
      console.error('[UpesiPay] status error:', error);
      return res.status(502).json({ success: false, error: 'Unable to reach UpesiPay status service.' });
    }
  });

  app.post('/api/upesipay/callback', (req, res) => {
    console.log('[UpesiPay callback]', JSON.stringify(req.body));
    return res.status(204).end();
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(port, '0.0.0.0', () => console.log(`[Lendplus Server] http://0.0.0.0:${port}`));
}

startServer();
