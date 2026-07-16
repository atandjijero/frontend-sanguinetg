import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')
mkdirSync(publicDir, { recursive: true })

// Géométrie du drapeau togolais (identique à src/components/icons/TogoFlag.tsx), redessinée
// centrée dans un canevas carré pour servir d'icône d'application.
function flagGroup(x, y, w) {
  const h = (w * 160) / 240
  const s = w / 240
  return `
    <g transform="translate(${x}, ${y})">
      <rect width="${w}" height="${h}" fill="#006a4e" />
      <rect y="${32 * s}" width="${w}" height="${32 * s}" fill="#ffce00" />
      <rect y="${96 * s}" width="${w}" height="${32 * s}" fill="#ffce00" />
      <rect width="${96 * s}" height="${96 * s}" fill="#d21034" />
      <polygon
        fill="#ffffff"
        points="${[
          [48, 20], [54.29, 39.35], [74.63, 39.35], [58.17, 51.31], [64.45, 70.65],
          [48, 58.7], [31.55, 70.65], [37.83, 51.31], [21.37, 39.35], [41.71, 39.35],
        ]
          .map(([px, py]) => `${px * s},${py * s}`)
          .join(' ')}"
      />
    </g>`
}

// Icône "any" : fond clair + coins arrondis, drapeau centré avec une marge confortable.
function iconAnySvg(size) {
  const flagW = size * 0.78
  const flagH = (flagW * 160) / 240
  const x = (size - flagW) / 2
  const y = (size - flagH) / 2
  const r = size * 0.18
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#faf9f7" />
  ${flagGroup(x, y, flagW)}
</svg>`
}

// Icône "maskable" : le drapeau doit rester dans la zone de sécurité centrale (~80%) car
// l'OS applique son propre masque (cercle, squircle...) qui peut rogner les bords.
function iconMaskableSvg(size) {
  const flagW = size * 0.58
  const flagH = (flagW * 160) / 240
  const x = (size - flagW) / 2
  const y = (size - flagH) / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#faf9f7" />
  ${flagGroup(x, y, flagW)}
</svg>`
}

const targets = [
  { name: 'pwa-192x192.png', svg: iconAnySvg(192), size: 192 },
  { name: 'pwa-512x512.png', svg: iconAnySvg(512), size: 512 },
  { name: 'pwa-maskable-512x512.png', svg: iconMaskableSvg(512), size: 512 },
  { name: 'apple-touch-icon.png', svg: iconAnySvg(180), size: 180 },
  { name: 'favicon-32x32.png', svg: iconAnySvg(32), size: 32 },
]

for (const target of targets) {
  await sharp(Buffer.from(target.svg)).resize(target.size, target.size).png().toFile(path.join(publicDir, target.name))
  console.log('generated', target.name)
}

// Favicon vectoriel (navigateurs modernes) : même dessin que iconAnySvg, sans rastérisation.
const fs = await import('fs/promises')
await fs.writeFile(path.join(publicDir, 'favicon.svg'), iconAnySvg(64))
console.log('generated favicon.svg')
