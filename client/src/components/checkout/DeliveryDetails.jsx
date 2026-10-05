import { ghanaRegions } from '../../utils/checkout'

export default function DeliveryDetails({ form, setForm, errors, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold uppercase tracking-wide text-ink">
        Delivery Address
      </legend>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="address" className="text-sm text-ink/70">
            Street Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={onChange}
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? 'address-error' : undefined}
            className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
          />
          {errors.address && (
            <p id="address-error" role="alert" className="mt-1 text-xs text-burgundy">
              {errors.address}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="text-sm text-ink/70">
              City / Town
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={form.city}
              onChange={onChange}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'city-error' : undefined}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            />
            {errors.city && (
              <p id="city-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.city}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="region" className="text-sm text-ink/70">
              Region
            </label>
            <select
              id="region"
              name="region"
              value={form.region}
              onChange={onChange}
              aria-invalid={Boolean(errors.region)}
              aria-describedby={errors.region ? 'region-error' : undefined}
              className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
            >
              <option value="">Select region</option>
              {ghanaRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && (
              <p id="region-error" role="alert" className="mt-1 text-xs text-burgundy">
                {errors.region}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-start gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.sendToSomeone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sendToSomeone: event.target.checked,
                  recipientName: event.target.checked ? current.recipientName : '',
                  recipientPhone: event.target.checked ? current.recipientPhone : '',
                }))
              }
              className="mt-1 h-4 w-4 accent-burgundy"
            />
            <span>Send this order to someone else</span>
          </label>

          {form.sendToSomeone && (
            <div className="space-y-4 border-l-2 border-burgundy/30 pl-4">
              <p className="text-xs text-ink/60">
                The delivery address above is where the order will be delivered. You still
                pay and receive the receipt.
              </p>
              <div>
                <label htmlFor="recipientName" className="text-sm text-ink/70">
                  Recipient's Full Name
                </label>
                <input
                  id="recipientName"
                  name="recipientName"
                  type="text"
                  value={form.recipientName}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.recipientName)}
                  className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                />
                {errors.recipientName && (
                  <p role="alert" className="mt-1 text-xs text-burgundy">
                    {errors.recipientName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="recipientPhone" className="text-sm text-ink/70">
                  Recipient's Phone Number
                </label>
                <input
                  id="recipientPhone"
                  name="recipientPhone"
                  type="tel"
                  value={form.recipientPhone}
                  onChange={onChange}
                  aria-invalid={Boolean(errors.recipientPhone)}
                  className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
                />
                {errors.recipientPhone && (
                  <p role="alert" className="mt-1 text-xs text-burgundy">
                    {errors.recipientPhone}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="text-sm text-ink/70">
            Order Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={form.notes}
            onChange={onChange}
            className="mt-1 w-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
          />
        </div>
      </div>
    </fieldset>
  )
}
