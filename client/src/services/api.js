const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function request(path, options = {}) {
  // Skip the JSON content-type for FormData bodies — the browser sets the
  // multipart boundary itself, and overriding it here would break the upload.
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: isFormData
      ? options.headers
      : { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Something went wrong. Please try again.'
    throw new Error(message)
  }

  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  upload: (path, formData) => request(path, { method: 'POST', body: formData }),
}
