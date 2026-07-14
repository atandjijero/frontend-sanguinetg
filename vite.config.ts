import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3001,
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
