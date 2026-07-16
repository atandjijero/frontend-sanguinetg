import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

const API_URL = process.env.VITE_API_URL ?? 'http://localhost:4000'

// CSP permissive en dev (HMR de Vite a besoin de 'unsafe-eval'/'unsafe-inline', Radix UI
// injecte des styles inline pour le positionnement) mais réelle : toute violation est
// bloquée par le navigateur et remontée au backend pour être journalisée et visible par
// le SUPERADMIN dans le tableau de bord Sécurité.
const CONTENT_SECURITY_POLICY = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' data: https://fonts.gstatic.com`,
  `img-src 'self' data: https:`,
  `connect-src 'self' ${API_URL} https://fonts.googleapis.com https://maps.googleapis.com ws:`,
  // La page Contact embarque un iframe Google Maps (maps/embed) pour localiser le CNTS.
  `frame-src 'self' https://www.google.com`,
  `report-uri ${API_URL}/security/csp-report`,
].join('; ')

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Désactivé en dev (`vite`/`npm run dev`) : c'est justement un service worker resté actif
      // depuis un ancien `npm start` (CRA, port 3000) qui causait les erreurs "%PUBLIC_URL%"
      // et les réponses servies depuis un cache obsolète. Le PWA ne s'active qu'au build/preview.
      devOptions: { enabled: false },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32x32.png', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Sanguine TG',
        short_name: 'Sanguine TG',
        description: 'Plateforme du CNTS pour la mobilisation des donneurs de sang au Togo',
        lang: 'fr',
        theme_color: '#9e0027',
        background_color: '#faf9f7',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Toujours prendre le contrôle immédiatement et nettoyer les caches d'une version
        // précédente, pour ne jamais reproduire le service worker "collé" à l'origine du bug.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5371,
    headers: {
      'Content-Security-Policy': CONTENT_SECURITY_POLICY,
    },
  },
  preview: {
    headers: {
      'Content-Security-Policy': CONTENT_SECURITY_POLICY,
    },
  },
})
