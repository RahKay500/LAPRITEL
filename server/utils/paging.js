export function parsePaging(query, { defaultLimit = 25, maxLimit = 100 } = {}) {
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || defaultLimit, 1), maxLimit)
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  return { limit, page, offset: (page - 1) * limit }
}
