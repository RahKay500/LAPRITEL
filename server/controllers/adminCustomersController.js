import { supabase } from '../config/supabase.js'
import { parsePaging } from '../utils/paging.js'

export async function listCustomers(req, res) {
  const { limit, page } = parsePaging(req.query)
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: limit })

  if (error) {
    throw new Error(`Failed to list customers: ${error.message}`)
  }

  const customers = data.users.map((user) => ({
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || '',
    phone: user.user_metadata?.phone || '',
    role: user.app_metadata?.role || 'customer',
    createdAt: user.created_at,
  }))

  res.json(customers)
}
