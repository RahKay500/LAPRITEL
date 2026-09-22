import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import { apiLimiter } from './middleware/rateLimiter.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'
import { supabase } from './config/supabase.js'
import paymentWebhookRouter from './routes/paymentWebhook.js'
import paymentsRouter from './routes/payments.js'
import ordersRouter from './routes/orders.js'
import authRouter from './routes/auth.js'
import productsRouter from './routes/products.js'
import adminRouter from './routes/admin.js'
import contactRouter from './routes/contact.js'

const app = express()
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// Vercel and Render both sit behind a reverse proxy — without this, req.ip
// resolves to the proxy's address instead of the real client, which breaks
// per-client rate limiting.
app.set('trust proxy', 1)

app.use(helmet())
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
)
app.use(cookieParser())
app.use(morgan('dev'))

// Mounted before express.json() — Paystack's webhook signature is computed
// over the raw request body, which express.json() would otherwise consume.
app.use('/api/payments/webhook', paymentWebhookRouter)

app.use(express.json())
app.use('/api', apiLimiter)

// A scheduled GitHub Actions job pings this on a cron (see
// .github/workflows/keep-alive.yml) to stop Vercel from cold-starting this
// function after idle periods, and touching the database here keeps
// Supabase's free-tier project from auto-pausing after a week of inactivity.
app.get('/api/health', async (req, res) => {
  try {
    await supabase.from('products').select('id').limit(1)
  } catch (error) {
    console.error('Health check DB ping failed:', error.message)
  }
  res.json({ status: 'ok' })
})

app.use('/api/payments', paymentsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/contact', contactRouter)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
