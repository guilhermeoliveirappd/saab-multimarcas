/**
 * Otimiza fotografias reais da Robcar (estoque e fachada).
 *
 *   npm run photos:estoque            → fotos-originais/<slug>/*.{jpg,jpeg,png,webp,heic}
 *                                      → public/estoque/<slug>/<nome>-640.webp e -1280.webp
 *   npm run photos:fachada -- <arq>   → public/media/fachada-robcar-800.webp e -1600.webp
 *
 * - Remove metadados (EXIF/GPS) e corrige a orientação.
 * - Nomes de saída = nome do arquivo original normalizado (ex.: "Frente 1.JPG" → "frente-1").
 *   Use esses nomes em `imagens[].arquivo` de src/data/robcar-stock.ts.
 * - A pasta `fotos-originais/` está no .gitignore (originais não vão para o repositório).
 */
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ACCEPTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.avif'])

const normalize = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

async function writeSizes(input: string, outDir: string, base: string, widths: number[]) {
  mkdirSync(outDir, { recursive: true })
  const meta = await sharp(input).rotate().metadata()
  for (const w of widths) {
    const out = join(outDir, `${base}-${w}.webp`)
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out)
  }
  return meta
}

async function estoque() {
  const src = resolve(root, 'fotos-originais')
  if (!existsSync(src)) {
    console.error('Crie a pasta fotos-originais/<slug-do-veiculo>/ com as fotos originais.')
    process.exit(1)
  }
  for (const slug of readdirSync(src)) {
    const dir = join(src, slug)
    if (!statSync(dir).isDirectory()) continue
    const files = readdirSync(dir).filter((f) => ACCEPTED.has(extname(f).toLowerCase())).sort()
    const names: string[] = []
    for (const file of files) {
      const base = normalize(basename(file, extname(file)))
      await writeSizes(join(dir, file), resolve(root, 'public/estoque', normalize(slug)), base, [640, 1280])
      names.push(base)
    }
    console.log(`✓ ${normalize(slug)}: ${names.length} foto(s) → imagens: [${names.map((n) => `{ arquivo: '${n}' }`).join(', ')}]`)
  }
}

async function fachada(file: string | undefined) {
  if (!file || !existsSync(file)) {
    console.error('Uso: npm run photos:fachada -- caminho/da/foto-da-fachada.jpg')
    process.exit(1)
  }
  const meta = await writeSizes(file, resolve(root, 'public/media'), 'fachada-robcar', [800, 1600])
  const ratio = (meta.width ?? 0) / (meta.height ?? 1)
  const w = Math.min(1600, meta.width ?? 1600)
  console.log(`✓ Fachada gerada. Em content.location.facade use width: ${w}, height: ${Math.round(w / ratio)}`)
}

const [mode, arg] = process.argv.slice(2)
if (mode === 'fachada') await fachada(arg)
else await estoque()
