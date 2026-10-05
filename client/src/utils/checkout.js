export const ghanaRegions = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Western North',
  'Central',
  'Eastern',
  'Volta',
  'Oti',
  'Northern',
  'Savannah',
  'North East',
  'Upper East',
  'Upper West',
  'Bono',
  'Bono East',
  'Ahafo',
]

export const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  region: '',
  notes: '',
  sendToSomeone: false,
  recipientName: '',
  recipientPhone: '',
}

const SAVED_DETAILS_KEY = 'lapritel_checkout_details'
const SAVED_FIELDS = ['fullName', 'email', 'phone', 'address', 'city', 'region']

export function readSavedDetails() {
  try {
    const raw = localStorage.getItem(SAVED_DETAILS_KEY)
    return raw ? { ...initialForm, ...JSON.parse(raw) } : null
  } catch {
    return null
  }
}

export function persistDetails(form, shouldSave) {
  try {
    if (!shouldSave) {
      localStorage.removeItem(SAVED_DETAILS_KEY)
      return
    }
    const details = Object.fromEntries(SAVED_FIELDS.map((field) => [field, form[field]]))
    localStorage.setItem(SAVED_DETAILS_KEY, JSON.stringify(details))
  } catch {
    // Storage can be unavailable (private browsing); checkout still works without it.
  }
}

export function validate(form) {
  const errors = {}
  if (!/^[A-Za-z\s'-]+$/.test(form.fullName.trim())) {
    errors.fullName = 'Enter a valid name (letters only)'
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!/^[0-9]{10}$/.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number'
  if (!form.address.trim()) errors.address = 'Delivery address is required'
  if (!form.city.trim()) errors.city = 'City/town is required'
  if (!form.region) errors.region = 'Select a region'
  if (form.sendToSomeone) {
    if (!/^[A-Za-z\s'-]+$/.test(form.recipientName.trim())) {
      errors.recipientName = 'Enter the recipient name (letters only)'
    }
    if (!/^[0-9]{10}$/.test(form.recipientPhone.trim())) {
      errors.recipientPhone = 'Enter the recipient 10-digit phone number'
    }
  }
  return errors
}
