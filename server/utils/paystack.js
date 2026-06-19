import crypto from 'crypto'

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

export async function verifyTransaction(reference) {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  )

  const body = await response.json()

  if (!response.ok || !body.status) {
    throw new Error(body.message || 'Unable to verify transaction with Paystack')
  }

  return body.data
}

export function isValidWebhookSignature(rawBody, signature) {
  if (!signature) return false

  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex')

  return hash === signature
}
