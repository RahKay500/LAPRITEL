import nodemailer from 'nodemailer'

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

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
          <td style="padding:10px 0;width:56px;">
            ${
              item.imageUrl
                ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" width="48" height="48" style="width:48px;height:48px;object-fit:cover;display:block;border:1px solid #eee;">`
                : ''
            }
          </td>
          <td style="padding:10px 0 10px 12px;">${escapeHtml(item.productName || 'Bag Ivy')} (${escapeHtml(item.name)}) x${Number(item.quantity)}</td>
          <td style="padding:10px 0;text-align:right;">GHS ${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:480px;margin:0 auto;">
      <h1 style="color:#580D0D;font-size:20px;">Thank you for your order!</h1>
      <p>Hi ${escapeHtml(customer.fullName)}, your LAPRITEL order <strong>${escapeHtml(reference)}</strong> has been received and paid for.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${itemRows}
        <tr>
          <td></td>
          <td style="padding:12px 0;border-top:1px solid #eee;font-weight:bold;">Subtotal</td>
          <td style="padding:12px 0;border-top:1px solid #eee;text-align:right;font-weight:bold;">GHS ${subtotal.toFixed(2)}</td>
        </tr>
      </table>
      <p style="margin-top:16px;">We'll deliver to:<br>${escapeHtml(customer.address)}, ${escapeHtml(customer.city)}, ${escapeHtml(customer.region)}</p>
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

export async function sendAdminOrderNotificationEmail({ reference, customer, items, subtotal }) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email not configured — skipping admin order notification email.')
    return
  }

  if (!process.env.ADMIN_NOTIFICATION_EMAIL) {
    console.warn('ADMIN_NOTIFICATION_EMAIL not set — skipping admin order notification email.')
    return
  }

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;width:56px;">
            ${
              item.imageUrl
                ? `<img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}" width="48" height="48" style="width:48px;height:48px;object-fit:cover;display:block;border:1px solid #eee;">`
                : ''
            }
          </td>
          <td style="padding:10px 0 10px 12px;">${escapeHtml(item.productName || 'Bag Ivy')} (${escapeHtml(item.name)}) x${Number(item.quantity)}</td>
          <td style="padding:10px 0;text-align:right;">GHS ${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:480px;margin:0 auto;">
      <h1 style="color:#580D0D;font-size:20px;">New order received</h1>
      <p>Order <strong>${escapeHtml(reference)}</strong> just came in and has been paid.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        ${itemRows}
        <tr>
          <td></td>
          <td style="padding:12px 0;border-top:1px solid #eee;font-weight:bold;">Subtotal</td>
          <td style="padding:12px 0;border-top:1px solid #eee;text-align:right;font-weight:bold;">GHS ${subtotal.toFixed(2)}</td>
        </tr>
      </table>
      <p style="margin-top:16px;">
        <strong>${escapeHtml(customer.fullName)}</strong><br>
        ${escapeHtml(customer.email)} &middot; ${escapeHtml(customer.phone)}<br>
        ${escapeHtml(customer.address)}, ${escapeHtml(customer.city)}, ${escapeHtml(customer.region)}
      </p>
      <p style="margin-top:24px;color:#666;font-size:13px;">
        Update its status from the Admin Dashboard once it ships.
      </p>
    </div>
  `

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: `New order ${reference} — GHS ${subtotal.toFixed(2)}`,
    html,
  })
}

export async function sendPasswordResetEmail({ email, fullName, resetUrl }) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email not configured — skipping password reset email.')
    return
  }

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:480px;margin:0 auto;">
      <h1 style="color:#580D0D;font-size:20px;">Reset Your Password</h1>
      <p>Hi ${escapeHtml(fullName)}, we received a request to reset your LAPRITEL password.</p>
      <p style="margin-top:16px;">
        <a href="${resetUrl}" style="display:inline-block;background:#580D0D;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">
          Reset Password
        </a>
      </p>
      <p style="margin-top:16px;color:#666;font-size:13px;">
        This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
      </p>
      <p style="margin-top:24px;color:#666;font-size:13px;">— The LAPRITEL Team</p>
    </div>
  `

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: 'Reset your LAPRITEL password',
    html,
  })
}

const STATUS_EMAILS = {
  processing: {
    subject: (reference) => `Your LAPRITEL order ${reference} is being prepared`,
    message: 'Your bag is being hand-beaded and prepared for you.',
  },
  shipped: {
    subject: (reference) => `Your LAPRITEL order ${reference} is on its way`,
    message: 'Your order has been shipped and is on its way to you.',
  },
  delivered: {
    subject: (reference) => `Your LAPRITEL order ${reference} has been delivered`,
    message: 'Your order has been delivered. We hope you love it.',
  },
}

export async function sendOrderStatusEmail({ reference, customer, status }) {
  const template = STATUS_EMAILS[status]
  if (!template) return

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('Email not configured — skipping order status email.')
    return
  }

  const html = `
    <div style="font-family:Georgia,serif;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;">
      <h1 style="color:#580D0D;font-size:22px;letter-spacing:2px;">LAPRITEL</h1>
      <p>Hi ${escapeHtml(customer.fullName.split(' ')[0])},</p>
      <p>${escapeHtml(template.message)}</p>
      <p style="color:#666;font-size:13px;">Order reference: ${escapeHtml(reference)}</p>
      <p style="margin-top:24px;color:#666;font-size:13px;">— The LAPRITEL Team</p>
    </div>
  `

  await getTransporter().sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: customer.email,
    subject: template.subject(reference),
    html,
  })
}
