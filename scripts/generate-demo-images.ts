/**
 * Gera ilustrações vetoriais (SVG) originais para os veículos de demonstração
 * e para o hero. Não utiliza fotografias de terceiros.
 *
 *   npm run generate:demo-images
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { demoImageSpecs } from '../src/data/demo-vehicles.ts'
import type { BodyType } from '../src/types/vehicle.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/demo/vehicles')
mkdirSync(outDir, { recursive: true })

const PAINT: Record<string, { base: string; light: string; dark: string }> = {
  Cinza: { base: '#5d636b', light: '#9aa1aa', dark: '#2a2e33' },
  Branco: { base: '#e4e6e9', light: '#ffffff', dark: '#9ea3aa' },
  Preto: { base: '#1d1f23', light: '#4a4f57', dark: '#08090a' },
  Azul: { base: '#1f3f73', light: '#4b74b5', dark: '#0d1e3a' },
  Vermelho: { base: '#8f1820', light: '#cf3a43', dark: '#4a0a0f' },
  Prata: { base: '#a7acb3', light: '#e1e4e8', dark: '#5f646b' },
}

interface Shape {
  body: string
  glass: string
  wheels: [number, number]
  wheelY: number
  tire: number
  pillars: number[]
  head: string
  tail: string
  doors: number[]
  beltY: number
  sillY: number
  /** linha inferior da carroceria (base dos arcos de roda) */
  bottom: number
  front: number
  rear: number
}

const arch = (cx: number, y: number, r: number) => `L ${cx + r} ${y} A ${r} ${r} 0 0 0 ${cx - r} ${y}`

const SHAPES: Record<Exclude<BodyType, 'outro'>, Shape> = {
  sedan: {
    body:
      'M 95 300 L 92 266 Q 95 240 130 232 L 290 214 Q 350 208 385 196 L 485 148 Q 505 140 535 140 L 665 140 Q 700 142 725 158 L 790 200 Q 860 204 885 212 Q 897 218 897 240 L 897 300 ' +
      arch(730, 300, 72) + ' ' + arch(250, 300, 72) + ' Z',
    glass: 'M 398 202 L 492 157 Q 510 150 538 150 L 662 150 Q 692 152 712 165 L 768 202 Z',
    wheels: [250, 730], wheelY: 310, tire: 56, pillars: [590], doors: [430, 600, 760],
    head: 'M 100 248 Q 120 236 170 232 L 168 244 Q 130 248 100 256 Z',
    tail: 'M 878 214 Q 893 218 896 232 L 896 244 L 872 236 Z',
    bottom: 300, beltY: 210, sillY: 288, front: 92, rear: 897,
  },
  hatch: {
    body:
      'M 92 300 L 90 262 Q 94 238 128 230 L 300 208 Q 340 202 370 188 L 470 140 Q 485 134 510 134 L 720 136 Q 760 138 775 160 L 815 215 Q 828 228 828 250 L 828 300 ' +
      arch(690, 300, 70) + ' ' + arch(240, 300, 70) + ' Z',
    glass: 'M 392 198 L 480 150 Q 492 145 512 145 L 712 147 Q 742 150 756 170 L 784 206 Z',
    wheels: [240, 690], wheelY: 310, tire: 54, pillars: [585], doors: [420, 590, 740],
    head: 'M 98 244 Q 118 233 165 229 L 163 241 Q 126 245 98 252 Z',
    tail: 'M 806 200 Q 822 214 826 232 L 812 234 L 800 210 Z',
    bottom: 300, beltY: 208, sillY: 288, front: 90, rear: 828,
  },
  suv: {
    body:
      'M 90 290 L 88 240 Q 92 215 130 208 L 330 192 Q 360 190 385 180 L 470 128 Q 480 122 500 122 L 820 122 Q 845 124 850 140 L 880 200 Q 892 210 892 230 L 892 290 ' +
      arch(740, 290, 78) + ' ' + arch(230, 290, 78) + ' Z',
    glass: 'M 402 184 L 482 136 L 812 136 Q 826 137 832 150 L 852 188 Z',
    wheels: [230, 740], wheelY: 305, tire: 62, pillars: [598, 726], doors: [440, 600, 760],
    head: 'M 94 224 Q 116 212 168 208 L 166 222 Q 126 226 94 232 Z',
    tail: 'M 872 168 Q 888 190 890 214 L 876 214 L 864 172 Z',
    bottom: 290, beltY: 196, sillY: 276, front: 88, rear: 892,
  },
  picape: {
    body:
      'M 88 292 L 86 238 Q 90 212 130 205 L 330 192 Q 360 188 385 176 L 465 128 Q 478 122 498 122 L 600 122 Q 618 122 620 140 L 622 196 L 922 196 Q 928 198 928 206 L 928 292 ' +
      arch(780, 292, 76) + ' ' + arch(230, 292, 76) + ' Z',
    glass: 'M 400 182 L 476 136 Q 484 132 498 132 L 598 132 Q 606 133 607 142 L 608 190 Z',
    wheels: [230, 780], wheelY: 306, tire: 62, pillars: [512], doors: [430, 515, 612],
    head: 'M 92 222 Q 114 210 166 206 L 164 220 Q 124 224 92 230 Z',
    tail: 'M 914 206 L 926 206 L 926 236 L 914 236 Z',
    bottom: 292, beltY: 200, sillY: 278, front: 86, rear: 928,
  },
}

type Scene = 'dark' | 'light'

function wheel(cx: number, cy: number, r: number, id: string) {
  const rim = r * 0.66
  const spokes = Array.from({ length: 5 }, (_, i) => {
    const a = (i * 72 * Math.PI) / 180
    const x = cx + Math.cos(a) * rim * 0.92
    const y = cy + Math.sin(a) * rim * 0.92
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="url(#rim-${id})" stroke-width="${(r * 0.16).toFixed(1)}" stroke-linecap="round"/>`
  }).join('')
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#121315"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="#2a2c30" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${rim}" fill="#1c1e21"/>
    <circle cx="${cx}" cy="${cy}" r="${rim}" fill="none" stroke="url(#rim-${id})" stroke-width="3"/>
    ${spokes}
    <circle cx="${cx}" cy="${cy}" r="${r * 0.14}" fill="#c9ccd1"/>
  </g>`
}

function carSvg(shape: Shape, color: string, scene: Scene, viewBox = '20 -70 960 600', id = 'v') {
  const paint = PAINT[color] ?? PAINT.Cinza
  const bg =
    scene === 'dark'
      ? `<radialGradient id="bg-${id}" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#3a3d42"/><stop offset=".55" stop-color="#17181b"/><stop offset="1" stop-color="#0a0a0b"/></radialGradient>
         <linearGradient id="floor-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1c1f"/><stop offset="1" stop-color="#0b0b0c"/></linearGradient>`
      : `<radialGradient id="bg-${id}" cx="50%" cy="35%" r="80%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eceef0"/><stop offset="1" stop-color="#d5d8dc"/></radialGradient>
         <linearGradient id="floor-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3e5e8"/><stop offset="1" stop-color="#cfd2d6"/></linearGradient>`
  const [w1, w2] = shape.wheels
  const ground = shape.wheelY + shape.tire
  const doorLines = shape.doors
    .map((x) => `<line x1="${x}" y1="${shape.beltY + 4}" x2="${x - 4}" y2="${shape.sillY - 6}" stroke="${paint.dark}" stroke-opacity=".55" stroke-width="1.6"/>`)
    .join('')
  const handles = shape.doors.slice(0, -1)
    .map((x) => `<rect x="${x + 38}" y="${shape.beltY + 18}" width="26" height="5" rx="2.5" fill="${paint.dark}" fill-opacity=".7"/>`)
    .join('')
  const pillars = shape.pillars
    .map((x) => `<rect x="${x - 6}" y="120" width="12" height="90" fill="${paint.dark}"/>`)
    .join('')

  const archR = shape.tire + 16
  const wells = shape.wheels
    .map((cx) => `<path d="M ${cx + archR} ${shape.bottom} A ${archR} ${archR} 0 0 0 ${cx - archR} ${shape.bottom} Z" fill="#0b0c0d"/>`)
    .join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" role="img">
  <defs>
    ${bg}
    <linearGradient id="paint-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${paint.light}"/>
      <stop offset=".38" stop-color="${paint.base}"/>
      <stop offset=".72" stop-color="${paint.base}"/>
      <stop offset="1" stop-color="${paint.dark}"/>
    </linearGradient>
    <linearGradient id="sheen-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset=".45" stop-color="#fff" stop-opacity="${scene === 'dark' ? '.22' : '.35'}"/>
      <stop offset=".55" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="glass-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b3138"/>
      <stop offset=".5" stop-color="#0e1114"/>
      <stop offset="1" stop-color="#1d2329"/>
    </linearGradient>
    <linearGradient id="rim-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e7e9ec"/><stop offset="1" stop-color="#7c8189"/>
    </linearGradient>
    <radialGradient id="shadow-${id}" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#000" stop-opacity="${scene === 'dark' ? '.85' : '.45'}"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="clip-${id}"><path d="${shape.body}"/></clipPath>
    <clipPath id="gclip-${id}"><path d="${shape.glass}"/></clipPath>
  </defs>
  <rect x="-200" y="-200" width="1400" height="900" fill="url(#bg-${id})"/>
  <rect x="-200" y="${ground - 4}" width="1400" height="${700 - ground}" fill="url(#floor-${id})"/>
  <ellipse cx="${(shape.front + shape.rear) / 2}" cy="${ground}" rx="${(shape.rear - shape.front) / 2 + 30}" ry="16" fill="url(#shadow-${id})"/>
  <g>
    ${wells}
    <path d="${shape.body}" fill="url(#paint-${id})"/>
    <g clip-path="url(#clip-${id})">
      <rect x="0" y="100" width="1000" height="${shape.beltY - 96}" fill="url(#sheen-${id})"/>
      <rect x="0" y="${shape.sillY}" width="1000" height="40" fill="${paint.dark}" fill-opacity=".55"/>
      <line x1="${shape.front + 40}" y1="${shape.beltY + 6}" x2="${shape.rear - 20}" y2="${shape.beltY + 2}" stroke="#fff" stroke-opacity="${scene === 'dark' ? '.28' : '.5'}" stroke-width="2"/>
    </g>
    <path d="${shape.glass}" fill="url(#glass-${id})"/>
    <g clip-path="url(#gclip-${id})">${pillars}</g>
    ${doorLines}
    ${handles}
    <path d="${shape.head}" fill="#f3f6f9" opacity=".95"/>
    <path d="${shape.tail}" fill="#b3121d"/>
    ${wheel(w1, shape.wheelY, shape.tire, id)}
    ${wheel(w2, shape.wheelY, shape.tire, id)}
  </g>
</svg>`
}

const VIEWS: { scene: Scene; viewBox?: string }[] = [
  { scene: 'dark' },
  { scene: 'light' },
  { scene: 'dark', viewBox: '40 100 448 280' },
]

let count = 0
for (const spec of demoImageSpecs) {
  const shape = SHAPES[spec.bodyType === 'outro' ? 'sedan' : spec.bodyType]
  VIEWS.forEach((view, i) => {
    const svg = carSvg(shape, spec.color, view.scene, view.viewBox, `${i}`)
    writeFileSync(resolve(outDir, `${spec.slug}-${i + 1}.svg`), svg.replace(/\n\s*/g, '\n'))
    count++
  })
}

// Hero: sedã escuro em estúdio, enquadramento amplo
const hero = carSvg(SHAPES.sedan, 'Cinza', 'dark', '-620 -60 1700 760', 'h')
writeFileSync(resolve(root, 'public/demo/hero-car.svg'), hero.replace(/\n\s*/g, '\n'))
console.log(`Geradas ${count} ilustrações de veículos + hero.`)
