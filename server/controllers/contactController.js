import { createContactMessage } from '../models/contactMessages.js'

export async function submitContactMessage(req, res) {
  const { fullName, email, message } = req.body
  await createContactMessage({ fullName, email, message })
  res.status(201).json({ message: "Message sent. We'll get back to you soon." })
}
