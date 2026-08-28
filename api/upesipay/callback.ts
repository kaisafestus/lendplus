export const config = { runtime: 'nodejs' };

async function readJson(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => { body += chunk; });
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  try {
    const callback = await readJson(req);
    // UpesiPay v2 sends merchant_request_id, checkout_request_id, reference_id and status.
    // Persist this payload in a database when it must update loan/account state asynchronously.
    console.log('[UpesiPay callback]', JSON.stringify(callback));
    return res.status(204).end();
  } catch (error) {
    console.error('[UpesiPay callback parse error]', error);
    return res.status(400).json({ success: false, error: 'Invalid callback payload.' });
  }
}
