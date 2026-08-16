import { jsPDF } from 'jspdf'
import { GROUPE_SANGUIN_LABELS } from './constants'
import { PRIMARY, TEXT_DARK, MUTED, BORDER, formatDate, drawFooter } from './pdfTheme'
import type { GroupeSanguin, Recompense } from './types'

const PAGE_W = 297
const PAGE_H = 210
const MARGIN = 15

type Donneur = { nom: string; prenom: string; groupeSanguin?: GroupeSanguin | null }

function nomComplet(donneur: Donneur) {
  return `${donneur.prenom} ${donneur.nom}`
}

function dessinerMedaillon(doc: jsPDF, cx: number, cy: number, groupeSanguin?: GroupeSanguin | null) {
  doc.setFillColor(...PRIMARY)
  doc.circle(cx, cy, 16, 'F')
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(0.6)
  doc.circle(cx, cy, 12.5, 'S')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(groupeSanguin ? GROUPE_SANGUIN_LABELS[groupeSanguin] : 'CNTS', cx, cy + 1.5, { align: 'center' })
}

function dessinerCertificat(doc: jsPDF, donneur: Donneur, recompense: Recompense) {
  const contentW = PAGE_W - MARGIN * 2
  const numero = recompense.id.slice(-6).toUpperCase()

  doc.setDrawColor(...PRIMARY)
  doc.setLineWidth(1.2)
  doc.roundedRect(MARGIN, MARGIN, contentW, PAGE_H - MARGIN * 2, 4, 4, 'S')
  doc.setLineWidth(0.3)
  doc.roundedRect(MARGIN + 3, MARGIN + 3, contentW - 6, PAGE_H - MARGIN * 2 - 6, 3, 3, 'S')

  let y = MARGIN + 18
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('CNTS LOMÉ · SANGUINE TG', PAGE_W / 2, y, { align: 'center' })

  y += 14
  doc.setTextColor(...PRIMARY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.text('CERTIFICAT DE RECONNAISSANCE', PAGE_W / 2, y, { align: 'center' })

  y += 16
  doc.setTextColor(...TEXT_DARK)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.text('Ce certificat est décerné à', PAGE_W / 2, y, { align: 'center' })

  y += 14
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text(nomComplet(donneur), PAGE_W / 2, y, { align: 'center' })

  y += 12
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.3)
  doc.line(PAGE_W / 2 - 40, y, PAGE_W / 2 + 40, y)

  y += 12
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...MUTED)
  const motif = recompense.critereAttribution ? `${recompense.description} — ${recompense.critereAttribution}` : recompense.description
  const motifLignes = doc.splitTextToSize(motif, contentW - 60)
  doc.text(motifLignes, PAGE_W / 2, y, { align: 'center' })

  const bas = PAGE_H - MARGIN - 16
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text(`Fait à Lomé, le ${formatDate(recompense.dateAttribution)}`, MARGIN + 12, bas)
  doc.text(`N° CERTIFICAT-${numero}`, MARGIN + 12, bas + 6)

  doc.setDrawColor(...BORDER)
  doc.line(PAGE_W - MARGIN - 60, bas - 4, PAGE_W - MARGIN - 12, bas - 4)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...TEXT_DARK)
  doc.text(
    recompense.attribuePar ? `${recompense.attribuePar.prenom} ${recompense.attribuePar.nom}` : 'Le Directeur du CNTS Lomé',
    PAGE_W - MARGIN - 36,
    bas,
    { align: 'center' }
  )
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text('CNTS Lomé', PAGE_W - MARGIN - 36, bas + 5, { align: 'center' })

  drawFooter(doc, 1, 1, PAGE_W, PAGE_H)
}

function dessinerBadge(doc: jsPDF, donneur: Donneur, recompense: Recompense) {
  const numero = recompense.id.slice(-6).toUpperCase()
  const cardW = 150
  const cardH = 95
  const cardX = (PAGE_W - cardW) / 2
  const cardY = (PAGE_H - cardH) / 2 - 5

  doc.setDrawColor(...PRIMARY)
  doc.setLineWidth(0.8)
  doc.roundedRect(cardX, cardY, cardW, cardH, 4, 4, 'S')
  doc.setDrawColor(...BORDER)
  doc.setLineWidth(0.3)
  doc.roundedRect(cardX + 3, cardY + 3, cardW - 6, cardH - 6, 3, 3, 'S')

  const cx = PAGE_W / 2
  let y = cardY + 20
  dessinerMedaillon(doc, cx, y, donneur.groupeSanguin)

  y += 24
  doc.setTextColor(...PRIMARY)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('BADGE DE RECONNAISSANCE', cx, y, { align: 'center' })

  y += 10
  doc.setTextColor(...TEXT_DARK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text(nomComplet(donneur), cx, y, { align: 'center' })

  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(...MUTED)
  const lignes = doc.splitTextToSize(recompense.description, cardW - 24)
  doc.text(lignes, cx, y, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...MUTED)
  doc.text(`N° BADGE-${numero} · ${formatDate(recompense.dateAttribution, { day: '2-digit', month: '2-digit', year: 'numeric' })}`, cx, cardY + cardH - 8, {
    align: 'center',
  })

  drawFooter(doc, 1, 1, PAGE_W, PAGE_H)
}

export function genererRecompensePdf(donneur: Donneur, recompense: Recompense) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'landscape' })

  if (recompense.type === 'CERTIFICAT') {
    dessinerCertificat(doc, donneur, recompense)
  } else {
    dessinerBadge(doc, donneur, recompense)
  }

  const prefixe = recompense.type === 'CERTIFICAT' ? 'certificat' : 'badge'
  doc.save(`${prefixe}-${donneur.prenom}-${donneur.nom}.pdf`.toLowerCase().replace(/\s+/g, '-'))
}
