// Only pending/paid/processing/shipped/delivered form a real forward
// sequence — cancelled and failed are exits that can happen from anywhere,
// so they're handled as their own always-confirm case below rather than
// ranked.
const STATUS_RANK = { pending: 0, paid: 1, processing: 2, shipped: 3, delivered: 4 }

// A paid order accidentally dropped back to "pending" (or any earlier
// status) doesn't undo the actual Paystack charge, but it can make a paid
// order silently vanish from a "needs fulfillment" view. Confirm before any
// backward move, and before moving to/from a terminal state, since those are
// the clicks most likely to be a mistake.
export function isRiskyStatusChange(current, next) {
  if (current === next) return false
  if (next === 'cancelled' || next === 'failed') return true
  if (current === 'cancelled' || current === 'failed') return true
  const currentRank = STATUS_RANK[current]
  const nextRank = STATUS_RANK[next]
  return currentRank !== undefined && nextRank !== undefined && nextRank < currentRank
}
