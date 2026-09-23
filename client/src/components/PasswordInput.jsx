import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function PasswordInput({
  id,
  name,
  value,
  onChange,
  autoComplete,
  ariaInvalid,
  ariaDescribedby,
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative mt-1">
      <input
        id={id}
        name={name}
        type={isVisible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        className="w-full border border-black/10 px-4 py-2.5 pr-11 text-sm outline-none focus:border-burgundy"
      />
      <button
        type="button"
        onClick={() => setIsVisible((current) => !current)}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-burgundy"
      >
        {isVisible ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
      </button>
    </div>
  )
}

export default PasswordInput
