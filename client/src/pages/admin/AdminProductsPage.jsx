import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  fetchAdminProducts,
  createAdminProduct,
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
  isCustom: false,
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function NewCollectionForm({ onCreated }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  function handleNameChange(event) {
    setName(event.target.value)
    setSlug(slugify(event.target.value))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!name.trim()) return setError('Enter a collection name.')
    if (!slug) return setError('Enter a URL slug, e.g. bag-glanzy.')

    setIsSaving(true)
    try {
      await createAdminProduct({ name: name.trim(), slug, description: description.trim() || null })
      setName('')
      setSlug('')
      setDescription('')
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-4 border border-black/15 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">New collection</h2>

      <div>
        <label htmlFor="collectionName" className="text-sm text-ink/85">Name</label>
        <input
          id="collectionName"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="e.g. Bag Glanzy"
          className="mt-1 w-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
        />
      </div>

      <div>
        <label htmlFor="collectionSlug" className="text-sm text-ink/85">URL slug</label>
        <input
          id="collectionSlug"
          type="text"
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
          className="mt-1 w-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
        />
        <p className="mt-1 text-xs text-ink/65">The page address: /shop/{slug || 'your-slug'}</p>
      </div>

      <div>
        <label htmlFor="collectionDescription" className="text-sm text-ink/85">Description (optional)</label>
        <textarea
          id="collectionDescription"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="mt-1 w-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
        />
      </div>

      {error && <p role="alert" className="text-sm text-burgundy">{error}</p>}

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-full border-2 border-burgundy px-8 py-2.5 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Create collection'}
      </button>
    </form>
  )
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
      className="mt-4 grid gap-4 border border-black/15 p-4 sm:grid-cols-2"
    >
      <div>
        <label htmlFor="colorName" className="text-sm text-ink/85">
          Color Name
        </label>
        <input
          id="colorName"
          name="colorName"
          value={form.colorName}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
        />
      </div>

      <div>
        <label htmlFor="colorSlug" className="text-sm text-ink/85">
          Color Slug
        </label>
        <input
          id="colorSlug"
          name="colorSlug"
          value={form.colorSlug}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
        />
      </div>

      <div>
        <label htmlFor="hex" className="text-sm text-ink/85">
          Swatch Color
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            id="hex"
            name="hex"
            type="color"
            value={form.hex}
            onChange={handleChange}
            className="h-10 w-14 cursor-pointer rounded-lg border border-black/15"
          />
          <input
            name="hex"
            value={form.hex}
            onChange={handleChange}
            required
            className="w-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
          />
        </div>
      </div>

      <div>
        <label htmlFor="price" className="text-sm text-ink/85">
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
          className="mt-1 w-full border border-black/15 px-4 py-2.5 text-sm outline-none focus:border-burgundy"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="image" className="text-sm text-ink/85">
          Product Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-ink/85"
        />
        {isUploading && <p className="mt-1 text-xs text-ink/75">Uploading...</p>}
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Variant preview"
            className="mt-2 h-20 w-20 rounded-lg object-cover"
          />
        )}
      </div>

      {showActiveToggle && (
        <label className="flex items-center gap-2 text-sm text-ink/85 sm:col-span-2">
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

      {showActiveToggle && (
        <label className="flex items-center gap-2 text-sm text-ink/85 sm:col-span-2">
          <input
            type="checkbox"
            checked={Boolean(form.readyToShip)}
            onChange={(event) =>
              setForm((current) => ({ ...current, readyToShip: event.target.checked }))
            }
          />
          Ready to ship (in stock) — otherwise shown as made to order
        </label>
      )}

      <label className="flex items-center gap-2 text-sm text-ink/85 sm:col-span-2">
        <input
          type="checkbox"
          checked={form.isCustom}
          onChange={(event) =>
            setForm((current) => ({ ...current, isCustom: event.target.checked }))
          }
        />
        Custom colour (made to order — hidden from the Shop grid, offered as an option on the
        product page instead)
      </label>

      {error && <p className="text-sm text-burgundy sm:col-span-2">{error}</p>}

      <div className="flex items-center gap-6 sm:col-span-2">
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="rounded-full border-2 border-burgundy px-6 py-2 text-sm font-bold uppercase tracking-widest text-burgundy transition-colors hover:bg-burgundy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-semibold uppercase tracking-wide text-ink/85 underline-offset-4 transition-colors hover:text-burgundy hover:underline"
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
  const [expandedIds, setExpandedIds] = useState({})
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

  if (isLoading) return <p className="text-ink/75">Loading products...</p>
  if (error) return <p className="text-sm text-burgundy">{error}</p>

  return (
    <div className="space-y-10">
      <NewCollectionForm onCreated={loadProducts} />

      {actionError && <p className="text-sm text-burgundy">{actionError}</p>}
      {products.length === 0 && <p className="text-ink/75">No collections yet. Create one above.</p>}

      {products.map((product) => (
        <div key={product.id}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              aria-expanded={!!expandedIds[product.id]}
              onClick={() =>
                setExpandedIds((current) => ({ ...current, [product.id]: !current[product.id] }))
              }
              className="flex items-center gap-2 text-left"
            >
              <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink">{product.name}</h2>
              <ChevronDown
                size={20}
                strokeWidth={1.5}
                className={`text-ink/75 transition-transform ${expandedIds[product.id] ? '' : '-rotate-90'}`}
              />
            </button>
            <button
              type="button"
              onClick={() => {
                setAddingForProductId(addingForProductId === product.id ? null : product.id)
                setExpandedIds((current) => ({ ...current, [product.id]: true }))
              }}
              className="rounded-full border border-burgundy px-5 py-2 text-xs font-semibold uppercase tracking-wide text-burgundy hover:bg-burgundy hover:text-white"
            >
              {addingForProductId === product.id ? 'Close' : 'Add Color Variant'}
            </button>
          </div>

          {addingForProductId === product.id && expandedIds[product.id] && (
            <VariantForm
              initialValues={emptyVariantForm}
              isSaving={isSaving}
              onCancel={() => setAddingForProductId(null)}
              onSubmit={(values) => handleAddVariant(product.id, values)}
            />
          )}

          <div className={`mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${expandedIds[product.id] ? '' : 'hidden'}`}>
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
                      isCustom: variant.is_custom,
                      readyToShip: variant.ready_to_ship,
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
                  className={`border border-black/15 p-4 ${
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
                        className="block h-14 w-14 rounded-lg border border-black/15"
                        style={{ backgroundColor: variant.hex }}
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-ink">{variant.color_name}</p>
                      <p className="text-xs text-ink/75">GHS {variant.price}</p>
                      {variant.is_custom && (
                        <p className="text-xs font-medium text-ink/75">Custom (made to order)</p>
                      )}
                      {!variant.is_active && (
                        <p className="text-xs font-medium text-burgundy">Inactive</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingVariantId(variant.id)}
                      className="rounded-full border border-black/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink hover:border-burgundy"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(variant)}
                      className="rounded-full border border-black/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-burgundy hover:border-burgundy"
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
