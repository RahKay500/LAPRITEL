export default function CustomerDetails({ form, errors, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold uppercase tracking-wide text-ink">
        Customer Details
      </legend>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="fullName" className="text-sm text-ink/70">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={onChange}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
          />
          {errors.fullName && (
            <p id="fullName-error" role="alert" className="mt-1 text-xs text-burgundy">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="text-sm text-ink/70">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="text-sm text-ink/70">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={onChange}
              maxLength={10}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.phone && (
              <p id="phone-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  )
}
