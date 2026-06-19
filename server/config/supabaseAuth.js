import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
}

// Separate, anon-key client used only for verifying login credentials.
// Privileged operations (creating users, reading orders) use the
// service-role client in config/supabase.js instead.
export const supabaseAuth = createClient(SUPABASE_URL.trim(), SUPABASE_ANON_KEY.trim(), {
  auth: {
    persistSession: false,
  },
  realtime: {
    transport: ws,
  },
})
