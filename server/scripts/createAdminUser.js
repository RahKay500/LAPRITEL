import 'dotenv/config'
import crypto from 'crypto'
import { supabase } from '../config/supabase.js'
import { createResetToken } from '../models/passwordResetTokens.js'
import { sendPasswordResetEmail } from '../utils/email.js'

const email = process.argv[2]

if (!email) {
  console.error('Usage: CLIENT_URL=<site-url> node scripts/createAdminUser.js <email>')
  process.exit(1)
}

const { data: existing, error: listError } = await supabase.auth.admin.listUsers()

if (listError) {
  console.error('Failed to list users:', listError.message)
  process.exit(1)
}

if (existing.users.some((u) => u.email?.toLowerCase() === email.toLowerCase())) {
  console.error(`${email} already has an account — use setAdminRole.js to promote it instead.`)
  process.exit(1)
}

const placeholderPassword = crypto.randomBytes(24).toString('base64')

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password: placeholderPassword,
  email_confirm: true,
  app_metadata: { role: 'admin' },
})

if (error) {
  console.error('Failed to create user:', error.message)
  process.exit(1)
}

const rawToken = await createResetToken(data.user.id)
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
const resetUrl = `${clientUrl}/reset-password?token=${rawToken}`

await sendPasswordResetEmail({ email, fullName: '', resetUrl })

console.log(`Created admin account for ${email} and sent a password-setup link to their inbox.`)
console.log(`Reset link (valid 1 hour, in case the email doesn't arrive): ${resetUrl}`)
