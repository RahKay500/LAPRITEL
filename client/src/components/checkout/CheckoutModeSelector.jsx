const MODES = [
  {
    id: 'self',
    label: 'For myself',
    description: "You're the one receiving this order.",
  },
  {
    id: 'gift',
    label: 'For someone else',
    description: 'You pay now, it ships to them.',
  },
  {
    id: 'link',
    label: 'Someone else pays',
    description: 'Send a link, it ships to you.',
  },
]

export default function CheckoutModeSelector({ mode, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold uppercase tracking-wide text-ink">
        Who is this order for?
      </legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {MODES.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={mode === option.id}
            className={`rounded-lg border-2 p-4 text-left transition-colors ${
              mode === option.id
                ? 'border-burgundy bg-burgundy-tint/30'
                : 'border-black/10 hover:border-burgundy/40'
            }`}
          >
            <p className="text-sm font-bold text-ink">{option.label}</p>
            <p className="mt-1 text-xs text-ink/60">{option.description}</p>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
