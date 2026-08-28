export default function handler(_req: any, res: any) {
  // Never allow a browser request to mark an M-PESA payment as complete.
  return res.status(410).json({
    success: false,
    error: 'Manual payment confirmation is disabled. Payment status is verified with UpesiPay.',
  });
}
