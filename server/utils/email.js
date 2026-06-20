import nodemailer from 'nodemailer'

let transporter

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }
  return transporter
}

export async function sendOrderConfirmationEmail({ reference, customer, items, subtotal }) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email not configured — skipping order confirmation email.')
    return
  }

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">The Ivy Bag (${item.name}) x${item.quantity}</td>
          <td style="padding:8px 0;text-align:right;">GHS ${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:480px;margin:0 auto;">
      <h1 style="color:#800020;font-size:20px;">Thank you for your order!</h1>
      <p>Hi ${customer.fullName}, your LAPRITEL order <strong>${reference}</strong> has been received and paid for.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${itemRows}
        <tr>
          <td style="padding:12px 0;border-top:1px solid #eee;font-weight:bold;">Subtotal</td>
          <td style="padding:12px 0;border-top:1px solid #eee;text-align:right;font-weight:bold;">GHS ${subtotal.toFixed(2)}</td>
        </tr>
      </table>
      <p style="margin-top:16px;">We'll deliver to:<br>${customer.address}, ${customer.city}, ${customer.region}</p>
      <p style="margin-top:24px;color:#666;font-size:13px;">— The LAPRITEL Team</p>
    </div>
  `

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: customer.email,
    subject: `Your LAPRITEL order ${reference} is confirmed`,
    html,
  })
}
