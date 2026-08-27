export const config = {
  runtime: 'nodejs20.x',
};

const UPESIPAY_CONFIG = {
  merchantId: process.env.UPESIPAY_MERCHANT_ID || 'AT275',
  channelId: process.env.UPESIPAY_CHANNEL_ID || '99',
};

export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    gateway: 'Upesi Pay',
    merchantId: UPESIPAY_CONFIG.merchantId,
    channelId: UPESIPAY_CONFIG.channelId,
  });
}
