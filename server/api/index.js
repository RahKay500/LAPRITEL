// Vercel serverless entry point. index.js (app.listen) is for local dev
// only -- on Vercel, the platform itself wraps this exported Express app
// as the request handler for every path (see vercel.json's rewrite).
import app from '../app.js'

export default app
