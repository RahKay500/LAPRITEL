import { getAllContactMessages } from '../models/contactMessages.js'
import { parsePaging } from '../utils/paging.js'

export async function listContactMessages(req, res) {
  const { limit, offset } = parsePaging(req.query)
  const messages = await getAllContactMessages({ limit, offset })
  res.json(messages)
}
