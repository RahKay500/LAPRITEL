import { useEffect, useState } from 'react'
import {
  fetchAdminProducts,
  createAdminVariant,
  updateAdminVariant,
  deleteAdminVariant,
  uploadAdminImage,
} from '../../services/admin'

const emptyVariantForm = {
  colorName: '',
  colorSlug: '',
  hex: '#800020',
  price: '',
  imageUrl: '',
}

function VariantForm({ initialValues, onSubmit, onCancel, isSaving, showActiveToggle = false }) {
  const [form, setForm] = useState(initialValues)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    setError('')
    setIsUploading(true)
    try {
      const data = await uploadAdminImage(file)
      setForm((current) => ({ ...current, imageUrl: data.imageUrl }))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    try {
      await onSubmit({ ...form, price: Number(form.price) })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 grid gap-4 rounded-2xl border border-black/10 p-4 sm:grid-cols-2"
    >
      <div>
        <label htmlFor="colorName" className="text-sm text-ink/70">
          Color Name
        </label>
        <input
          id="colorName"
          name="colorName"
          value={form.colorName}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
        />
      </div>

      <div>
        <label htmlFor="colorSlug" className="text-sm text-ink/70">
          Color Slug
        </label>
        <input
          id="colorSlug"
          name="colorSlug"
          value={form.colorSlug}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
        />
      </div>

      <div>
        <label htmlFor="hex" className="text-sm text-ink/70">
          Swatch Color
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            id="hex"
            name="hex"
            type="color"
            value={form.hex}
            onChange={handleChange}
            className="h-10 w-14 cursor-pointer rounded-lg border border-black/10"
          />
          <input
            name="hex"
            value={form.hex}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
          />
        </div>
      </div>

      <div>
        <label htmlFor="price" className="text-sm text-ink/70">
          Price (GHS)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="image" className="text-sm text-ink/70">
          Product Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-ink/70"
        />
        {isUploading && <p className="mt-1 text-xs text-ink/60">Uploading...</p>}
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Variant preview"
            className="mt-2 h-20 w-20 rounded-lg object-cover"
          />
        )}
      </div>

      {showActiveToggle && (
        <label className="flex items-center gap-2 text-sm text-ink/70 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm((current) => ({ ...current, isActive: event.target.checked }))
            }
          />
          Active (visible in shop)
        </label>
      )}

      {error && <p className="text-sm text-burgundy sm:col-span-2">{error}</p>}

      <div className="flex gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="rounded-full bg-burgundy px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-burgundy/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingForProductId, setAddingForProductId] = useState(null)
  const [editingVariantId, setEditingVariantId] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  function loadProducts() {
    setIsLoading(true)
    return fetchAdminProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }

  async function handleAddVariant(productId, values) {
    setIsSaving(true)
    try {
      await createAdminVariant(productId, values)
      setAddingForProductId(null)
      await loadProducts()
    } finally {
      setIsSaving(false)
    }
  }

  async function handleEditVariant(variantId, values) {
    setIsSaving(true)
    try {
      await updateAdminVariant(variantId, values)
      setEditingVariantId(null)
      await loadProducts()
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteVariant(variant) {
    if (!window.confirm(`Delete the ${variant.color_name} variant? This cannot be undone.`)) {
      return
    }
    setActionError('')
    try {
      await deleteAdminVariant(variant.id)
      await loadProducts()
    } catch (err) {
      setActionError(err.message)
    }
  }

  if (isLoading) return <p className="text-ink/60">Loading products...</p>
  if (error) return <p className="text-sm text-burgundy">{error}</p>
  if (products.length === 0) return <p className="text-ink/60">No products yet.</p>

  return (
    <div className="space-y-10">
      {actionError && <p className="text-sm text-burgundy">{actionError}</p>}

      {products.map((product) => (
        <div key={product.id}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl text-ink">{product.name}</h2>
            <button
              type="button"
              onClick={() =>
                setAddingForProductId(addingForProductId === product.id ? null : product.id)
              }
              className="rounded-full border border-burgundy px-5 py-2 text-xs font-semibold uppercase tracking-wide text-burgundy hover:bg-burgundy hover:text-white"
            >
              {addingForProductId === product.id ? 'Close' : 'Add Color Variant'}
            </button>
          </div>

          {addingForProductId === product.id && (
            <VariantForm
              initialValues={emptyVariantForm}
              isSaving={isSaving}
              onCancel={() => setAddingForProductId(null)}
              onSubmit={(values) => handleAddVariant(product.id, values)}
            />
          )}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.product_variants.map((variant) =>
              editingVariantId === variant.id ? (
                <div key={variant.id} className="sm:col-span-2 lg:col-span-3">
                  <VariantForm
                    initialValues={{
                      colorName: variant.color_name,
                      colorSlug: variant.color_slug,
                      hex: variant.hex,
                      price: variant.price,
                      imageUrl: variant.image_url || '',
                      isActive: variant.is_active,
                    }}
                    isSaving={isSaving}
                    showActiveToggle
                    onCancel={() => setEditingVariantId(null)}
                    onSubmit={(values) => handleEditVariant(variant.id, values)}
                  />
                </div>
              ) : (
                <div
                  key={variant.id}
                  className={`rounded-2xl border border-black/10 p-4 ${
                    variant.is_active ? '' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {variant.image_url ? (
                      <img
                        src={variant.image_url}
                        alt={variant.color_name}
                        className="h-14 w-14 rounded-lg object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span
                        className="block h-14 w-14 rounded-lg border border-black/10"
                        style={{ backgroundColor: variant.hex }}
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-ink">{variant.color_name}</p>
                      <p className="text-xs text-ink/60">GHS {variant.price}</p>
                      {!variant.is_active && (
                        <p className="text-xs font-medium text-burgundy">Inactive</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingVariantId(variant.id)}
                      className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink hover:border-burgundy"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(variant)}
                      className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-burgundy hover:border-burgundy"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminProductsPage
