const MADE_TO_ORDER = 'Made to order: allow 5–7 working days.'
const MIXED = 'Made-to-order bags take 5–7 working days. Ready-to-ship bags ship sooner.'
const READY = 'Ready to ship.'

function LeadTimeNote({ items, className = '' }) {
  if (items.length === 0) return null

  const readyCount = items.filter((item) => item.readyToShip).length
  let message = MADE_TO_ORDER
  if (readyCount === items.length) message = READY
  else if (readyCount > 0) message = MIXED

  return <p className={`text-xs text-ink/60 ${className}`}>{message}</p>
}

export default LeadTimeNote
