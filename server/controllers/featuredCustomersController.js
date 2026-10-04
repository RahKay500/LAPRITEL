import {
  getFeaturedCustomers,
  createFeaturedCustomer,
  deleteFeaturedCustomer,
} from '../models/featuredCustomers.js'

export async function listPublicFeaturedCustomers(req, res) {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 24, 1), 100)
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0)
  const customers = await getFeaturedCustomers({ limit, offset })
  res.json(customers)
}

export async function listAdminFeaturedCustomers(req, res) {
  const customers = await getFeaturedCustomers()
  res.json(customers)
}

export async function addFeaturedCustomer(req, res) {
  const { firstName, quote, imageUrl } = req.body
  const customer = await createFeaturedCustomer({ firstName, quote, imageUrl })
  res.status(201).json(customer)
}

export async function removeFeaturedCustomer(req, res) {
  await deleteFeaturedCustomer(req.params.id)
  res.json({ message: 'Featured customer removed' })
}
