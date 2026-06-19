export function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
}

export function errorHandler(err, req, res, next) {
  console.error(err)
  const status = err.status || 500
  const message = status === 500 ? 'Internal server error' : err.message
  res.status(status).json({ message })
}
