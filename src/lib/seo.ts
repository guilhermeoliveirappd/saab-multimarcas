import { useEffect } from 'react'
import { env } from '../config/env'
import { siteConfig } from '../config/site'
import { type PageMeta, absoluteUrl, fullTitle } from './seo-meta'

const siteUrl = () => env.siteUrl || window.location.origin

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function setJsonLd(data: Record<string, unknown> | null | undefined) {
  const id = 'page-jsonld'
  document.getElementById(id)?.remove()
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

/** Atualiza title, description, canonical, Open Graph e JSON-LD da página atual. */
export function useSeo(meta: PageMeta): void {
  const { title, description, path, image, type, noindex, jsonLd } = meta
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''
  useEffect(() => {
    const t = fullTitle(title)
    const d = description ?? siteConfig.seo.defaultDescription
    const url = absoluteUrl(siteUrl(), path)
    const img = absoluteUrl(siteUrl(), image ?? siteConfig.seo.ogImage)
    document.title = t
    setMeta('name', 'description', d)
    setMeta('name', 'robots', noindex || !env.allowIndexing ? 'noindex, nofollow' : 'index, follow')
    setMeta('property', 'og:title', t)
    setMeta('property', 'og:description', d)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('property', 'og:type', type ?? 'website')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setCanonical(url)
    setJsonLd(jsonLdKey ? (JSON.parse(jsonLdKey) as Record<string, unknown>) : null)
  }, [title, description, path, image, type, noindex, jsonLdKey])
}
