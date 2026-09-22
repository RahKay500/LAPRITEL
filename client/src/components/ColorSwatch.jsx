// A two-tone swatch is rendered as two solid halves clipped by the circle's
// own overflow, rather than a single element with a linear-gradient
// background — a hard 50% gradient stop combined with a border-radius circle
// can show a hairline of whatever sits behind it at the seam.
function ColorSwatch({ hex, topHex, bottomHex, isTwoTone, image, alt = '', className = '' }) {
  if (image) {
    return (
      <span className={`block overflow-hidden rounded-full border border-black/10 ${className}`}>
        <img src={image} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      </span>
    )
  }

  if (isTwoTone) {
    return (
      <span className={`block overflow-hidden rounded-full border border-black/10 ${className}`}>
        <span className="block h-1/2 w-full" style={{ background: topHex }} />
        <span className="block h-1/2 w-full" style={{ background: bottomHex }} />
      </span>
    )
  }

  return (
    <span
      className={`block rounded-full border border-black/10 ${className}`}
      style={{ background: hex }}
    />
  )
}

export default ColorSwatch
