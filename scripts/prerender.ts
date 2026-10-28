/**
 * Pós-build: gera HTML por rota com metadados próprios (title, description,
 * canonical, Open Graph, JSON-LD), além de sitemap.xml e robots.txt.
 *
 * Motivo: o site é uma SPA (renderização no cliente). Robôs de redes sociais
 * (WhatsApp, Facebook) não executam JavaScript; com este passo, cada anúncio
 * compartilhado exibe título, descrição e imagem corretos. O Google renderiza
 * JavaScript, mas também se beneficia do HTML inicial já com os metadados.
 *
 * Veículos: buscados do Supabase no momento do build (se configurado); senão,
 * usa os dados de demonstração. Veículos cadastrados depois do deploy continuam
 * acessíveis (fallback da SPA) — um novo deploy atualiza os metadados estáticos.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import { siteConfig } from '../src/config/site.ts'
import { demoVehicles } from '../src/data/demo-vehicles.ts'
import { STATIC_PAGES, absoluteUrl, dealerJsonLd, fullTitle, vehicleJsonLd, vehicleMeta, type PageMeta } from '../src/lib/seo-meta.ts'
import { VEHICLE_COLUMNS, fromRow, type VehicleRow } from '../src/services/vehicles/mapper.ts'
import type { Vehicle } from '../src/types/vehicle.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const env = { ...loadEnv('production', root, 'VITE_'), ...process.env }

const vercelUrl = env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : ''
const siteUrl = (env.VITE_SITE_URL || vercelUrl).replace(/\/$/, '')
const allowIndexing = env.VITE_ALLOW_INDEXING === 'true'

if (!siteUrl) console.warn('⚠ VITE_SITE_URL não definido: canonical/og:url ficarão relativos.')

async function loadVehicles(): Promise<{ vehicles: Vehicle[]; source: string }> {
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return { vehicles: demoVehicles, source: 'demonstração' }
  try {
    const res = await fetch(`${url}/rest/v1/vehicles?select=${VEHICLE_COLUMNS}&published=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const rows = (await res.json()) as VehicleRow[]
    return { vehicles: rows.map(fromRow), source: 'Supabase' }
  } catch (err) {
    // Não falha o deploy: as páginas continuam funcionando via SPA
    console.warn(`⚠ Não foi possível buscar veículos no Supabase (${String(err)}). Páginas de veículos não serão pré-geradas.`)
    return { vehicles: [], source: 'Supabase (falhou)' }
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headTags(meta: PageMeta, opts: { canonical: boolean }): string {
  const title = fullTitle(meta.title)
  const description = meta.description ?? siteConfig.seo.defaultDescription
  const url = siteUrl ? absoluteUrl(siteUrl, meta.path) : meta.path
  const image = siteUrl ? absoluteUrl(siteUrl, meta.image ?? siteConfig.seo.ogImage) : (meta.image ?? siteConfig.seo.ogImage)
  const robots = allowIndexing && !meta.noindex ? 'index, follow' : 'noindex, nofollow'
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    opts.canonical ? `<link rel="canonical" href="${esc(url)}" />` : '',
    `<meta property="og:site_name" content="${esc(siteConfig.name)}" />`,
    `<meta property="og:locale" content="${siteConfig.seo.locale}" />`,
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    opts.canonical ? `<meta property="og:url" content="${esc(url)}" />` : '',
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    meta.jsonLd ? `<script type="application/ld+json" id="page-jsonld">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ]
  return tags.filter(Boolean).join('\n    ')
}

function render(template: string, meta: PageMeta, canonical = true): string {
  return template.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${headTags(meta, { canonical })}\n    <!--seo:end-->`)
}

function write(path: string, html: string) {
  const file = path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${path}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

async function main() {
  const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
  const { vehicles, source } = await loadVehicles()
  const { services } = siteConfig

  const staticPaths = Object.keys(STATIC_PAGES).filter(
    (p) => !(p === '/financiamento' && !services.financing) && !(p === '/venda-ou-troca' && !services.sell && !services.trade),
  )

  // index.html também é o fallback da SPA para qualquer rota: sem canonical fixo
  write('/', render(template, { ...STATIC_PAGES['/'], path: '/', jsonLd: dealerJsonLd(siteUrl) }, false))
  for (const path of staticPaths.filter((p) => p !== '/')) write(path, render(template, { ...STATIC_PAGES[path], path }))

  for (const v of vehicles) {
    const path = `/veiculos/${v.slug}`
    write(path, render(template, { ...vehicleMeta(v), path, noindex: v.isDemo, jsonLd: vehicleJsonLd(v, siteUrl) }))
  }

  // Sitemap: somente páginas reais (veículos de demonstração nunca entram)
  const today = new Date().toISOString().slice(0, 10)
  const urls = [
    ...staticPaths.filter((p) => !STATIC_PAGES[p].noindex).map((p) => ({ loc: p, lastmod: today })),
    ...vehicles.filter((v) => !v.isDemo && v.status !== 'vendido').map((v) => ({ loc: `/veiculos/${v.slug}`, lastmod: v.createdAt.slice(0, 10) })),
  ]
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(siteUrl ? absoluteUrl(siteUrl, u.loc) : u.loc)}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
  writeFileSync(resolve(dist, 'sitemap.xml'), sitemap)

  const robots = allowIndexing
    ? `User-agent: *\nAllow: /\nDisallow: /admin\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`
    : `# Indexação desativada (VITE_ALLOW_INDEXING != "true") — site em demonstração/homologação.\nUser-agent: *\nDisallow: /\n`
  writeFileSync(resolve(dist, 'robots.txt'), robots)

  console.log(
    `✓ Pré-renderização: ${staticPaths.length} páginas + ${vehicles.length} veículos (${source}). ` +
      `Indexação ${allowIndexing ? 'ATIVADA' : 'desativada'}. Sitemap com ${urls.length} URLs.`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
