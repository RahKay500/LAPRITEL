import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import { apiLimiter } from './middleware/rateLimiter.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(helmet())
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/api', apiLimiter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`LAPRITEL server running on port ${PORT}`)
})
