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

// Fond "sang" : dégradé radial élégant, du rouge vif (reflet) au bordeaux profond,
// dans les tons de la couleur de marque (#9e0027).
function bloodBackground(size, id) {
  return `<defs>
    <radialGradient id="${id}" cx="35%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#d42847" />
      <stop offset="55%" stop-color="#9e0027" />
      <stop offset="100%" stop-color="#650018" />
    </radialGradient>
  </defs>`
}

// Drapeau en médaillon rond : découpé en cercle ("cover", pas "contain") sur un disque
// clair, cerclé d'un fin liseré doré — lisible même tout petit, effet "badge" soigné.
function flagMedallion(cx, cy, r) {
  const flagW = r * 3
  const x = cx - flagW / 2
  const y = cy - r
  const clipId = `clip-${Math.round(cx)}-${Math.round(cy)}-${Math.round(r)}`
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#faf9f7" />
    <clipPath id="${clipId}">
      <circle cx="${cx}" cy="${cy}" r="${r}" />
    </clipPath>
    <g clip-path="url(#${clipId})">
      ${flagGroup(x, y, flagW)}
    </g>
    <circle cx="${cx}" cy="${cy}" r="${r - size_ring(r)}" fill="none" stroke="#ffce00" stroke-width="${size_ring(r)}" />`
}
function size_ring(r) {
  return Math.max(r * 0.045, 1)
}

// Icône "any" : fond sang + coins arrondis, drapeau en médaillon rond centré.
function iconAnySvg(size) {
  const r = size * 0.18
  const gradId = `bg-any-${size}`
  const medR = size * 0.36
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bloodBackground(size, gradId)}
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#${gradId})" />
  ${flagMedallion(size / 2, size / 2, medR)}
</svg>`
}

// Icône "maskable" : fond sang plein cadre, médaillon resserré dans la zone de sécurité
// centrale (~80%) car l'OS applique son propre masque (cercle, squircle...) qui peut
// rogner les bords.
function iconMaskableSvg(size) {
  const gradId = `bg-mask-${size}`
  const medR = size * 0.3
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bloodBackground(size, gradId)}
  <rect width="${size}" height="${size}" fill="url(#${gradId})" />
  ${flagMedallion(size / 2, size / 2, medR)}
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
