import { useEffect } from 'react'

const SITE_NAME = 'LAPRITEL'
const DEFAULT_DESCRIPTION =
  'Handmade beaded bags, crafted one bead at a time. Elegant, timeless, and made for you.'

export function usePageMeta(title, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Handmade Beaded Bags`

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)
  }, [title, description])
}
