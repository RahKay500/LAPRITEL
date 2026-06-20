import 'dotenv/config'
import { supabase } from '../config/supabase.js'

const email = process.argv[2]

if (!email) {
  console.error('Usage: node scripts/setAdminRole.js <email>')
  process.exit(1)
}

const { data, error } = await supabase.auth.admin.listUsers()

if (error) {
  console.error('Failed to list users:', error.message)
  process.exit(1)
}

const user = data.users.find((u) => u.email === email)

if (!user) {
  console.error(`No user found with email: ${email}`)
  process.exit(1)
}

const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
  app_metadata: { role: 'admin' },
})

if (updateError) {
  console.error('Failed to set admin role:', updateError.message)
  process.exit(1)
}

console.log(`${email} is now an admin. They'll need to log out and back in for it to take effect.`)
