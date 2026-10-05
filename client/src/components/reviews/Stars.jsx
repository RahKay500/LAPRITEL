export default function Stars({ value, label }) {
  return (
    <span aria-label={label || `${value} out of 5 stars`} className="text-burgundy tracking-wide">
      {'★'.repeat(value)}
      <span className="text-black/20">{'★'.repeat(5 - value)}</span>
    </span>
  )
}
