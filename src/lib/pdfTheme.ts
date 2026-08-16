export const PRIMARY: [number, number, number] = [158, 0, 39]
export const TEXT_DARK: [number, number, number] = [26, 28, 27]
export const MUTED: [number, number, number] = [91, 64, 64]
export const BORDER: [number, number, number] = [229, 220, 220]

export const PAGE_W = 210
export const PAGE_H = 297
export const MARGIN = 15
export const CONTENT_W = PAGE_W - MARGIN * 2
export const FOOTER_Y = PAGE_H - 10

export function formatDate(iso: string, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' }) {
  return new Date(iso).toLocaleDateString('fr-FR', options)
}

export function drawFooter(
  doc: import('jspdf').jsPDF,
  page: number,
  totalPages: number,
  pageW: number = PAGE_W,
  pageH: number = PAGE_H
) {
  const footerY = pageH - 10
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.text('Sanguine TG · CNTS Lomé — document généré numériquement', MARGIN, footerY)
  doc.text(`Page ${page}/${totalPages}`, pageW - MARGIN, footerY, { align: 'right' })
}
