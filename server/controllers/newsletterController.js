import { addNewsletterSubscriber } from '../models/newsletter.js'

export async function subscribe(req, res) {
  await addNewsletterSubscriber(req.body.email.trim().toLowerCase())
  res.status(201).json({ message: 'Thanks for subscribing!' })
}
