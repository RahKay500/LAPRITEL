import { getAllContactMessages } from '../models/contactMessages.js'

export async function listContactMessages(req, res) {
  const messages = await getAllContactMessages()
  res.json(messages)
}
