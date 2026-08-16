import { jsPDF } from 'jspdf'
import { GROUPE_SANGUIN_LABELS, TYPE_RECOMPENSE_LABELS } from './constants'
import { PRIMARY, TEXT_DARK, MUTED, BORDER, MARGIN, CONTENT_W, FOOTER_Y, formatDate, drawFooter } from './pdfTheme'
import type { CarnetDigital, Utilisateur } from './types'

export function genererCarnetPdf(user: Utilisateur, carnets: CarnetDigital[]) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const parAncienneteAsc = [...carnets].sort((a, b) => new Date(a.dateDon).getTime() - new Date(b.dateDon).getTime())
  const plusRecent = parAncienneteAsc.at(-1) ?? null
  const eligible = plusRecent?.rappelProchaineDate ? new Date(plusRecent.rappelProchaineDate).getTime() <= Date.now() : true
  const numeroCarnet = user.id.slice(-6).toUpperCase()
  const donneurDepuis = user.dateInscription ?? user.createdAt

  // --- Carte d'identité du donneur ---
  const headerH = 42
  doc.setFillColor(...PRIMARY)
  doc.roundedRect(MARGIN, MARGIN, CONTENT_W, headerH, 3, 3, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('CARNET DE DON · CNTS LOMÉ', MARGIN + 8, MARGIN + 10)
  doc.setFontSize(16)
  doc.text(`${user.prenom} ${user.nom}`, MARGIN + 8, MARGIN + 19)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(
    donneurDepuis ? `Donneur depuis le ${formatDate(donneurDepuis, { day: '2-digit', month: '2-digit', year: 'numeric' })}` : 'Nouveau donneur',
    MARGIN + 8,
    MARGIN + 26
  )

  if (user.groupeSanguin) {
    const cx = MARGIN + CONTENT_W - 16
    const cy = MARGIN + 14
    doc.setFillColor(255, 255, 255)
    doc.circle(cx, cy, 9, 'F')
    doc.setTextColor(...PRIMARY)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text(GROUPE_SANGUIN_LABELS[user.groupeSanguin], cx, cy + 1.5, { align: 'center' })
  }

  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(0.2)
  doc.line(MARGIN + 8, MARGIN + 31, MARGIN + CONTENT_W - 8, MARGIN + 31)

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text(`N° CARNET-${numeroCarnet}`, MARGIN + 8, MARGIN + 37)
  doc.text(
    `${parAncienneteAsc.length} ${parAncienneteAsc.length > 1 ? 'dons enregistrés' : 'don enregistré'}`,
    MARGIN + CONTENT_W / 2,
    MARGIN + 37,
    { align: 'center' }
  )
  doc.text(
    eligible ? 'Disponible dès maintenant' : `Prochain don le ${formatDate(plusRecent!.rappelProchaineDate!, { day: '2-digit', month: '2-digit', year: 'numeric' })}`,
    MARGIN + CONTENT_W - 8,
    MARGIN + 37,
    { align: 'right' }
  )

  // --- Historique des dons ---
  let y = MARGIN + headerH + 12
  doc.setTextColor(...TEXT_DARK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('Historique des dons', MARGIN, y)
  y += 8

  let page = 1
  const parAncienneteDesc = [...parAncienneteAsc].reverse()

  for (const [idx, carnet] of parAncienneteDesc.entries()) {
    const numeroDon = parAncienneteAsc.length - idx
    const estLePlusRecent = carnet.id === plusRecent?.id

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const messageLines = carnet.messageRemerciement ? doc.splitTextToSize(`"${carnet.messageRemerciement}"`, CONTENT_W - 18) : []

    let entryH = 22
    if (carnet.recompense) entryH += 6
    if (messageLines.length) entryH += messageLines.length * 4.5 + 2
    if (estLePlusRecent && carnet.rappelProchaineDate) entryH += 8

    if (y + entryH > FOOTER_Y - 6) {
      doc.addPage()
      page += 1
      y = MARGIN
    }

    // tampon numéroté
    doc.setFillColor(...PRIMARY)
    doc.circle(MARGIN + 4, y + 5, 4, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.text(String(numeroDon), MARGIN + 4, y + 6.3, { align: 'center' })

    // carte de l'entrée
    const boxX = MARGIN + 11
    const boxW = CONTENT_W - 11
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.3)
    doc.roundedRect(boxX, y, boxW, entryH, 2, 2, 'S')

    let ly = y + 7
    doc.setTextColor(...TEXT_DARK)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(formatDate(carnet.dateDon), boxX + 5, ly)
    doc.setFontSize(8)
    doc.text(`Don n°${numeroDon}`, boxX + boxW - 5, ly, { align: 'right' })

    ly += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...MUTED)
    doc.text(carnet.centreDon?.nom ?? '—', boxX + 5, ly)

    if (carnet.recompense) {
      ly += 6
      const label = TYPE_RECOMPENSE_LABELS[carnet.recompense.type]
      const badgeW = doc.getTextWidth(label) + 6
      doc.setDrawColor(...BORDER)
      doc.roundedRect(boxX + 5, ly - 3.5, badgeW, 5, 1, 1, 'S')
      doc.setFontSize(8)
      doc.setTextColor(...TEXT_DARK)
      doc.text(label, boxX + 5 + badgeW / 2, ly, { align: 'center' })
    }

    if (messageLines.length) {
      ly += 6
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(8.5)
      doc.setTextColor(...MUTED)
      doc.text(messageLines, boxX + 5, ly)
      ly += (messageLines.length - 1) * 4.5
    }

    if (estLePlusRecent && carnet.rappelProchaineDate) {
      ly += 6
      doc.setDrawColor(...BORDER)
      doc.line(boxX + 5, ly - 3, boxX + boxW - 5, ly - 3)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(...PRIMARY)
      doc.text(`Prochain don possible à partir du ${formatDate(carnet.rappelProchaineDate, { day: '2-digit', month: '2-digit', year: 'numeric' })}`, boxX + 5, ly)
    }

    y += entryH + 6
  }

  const totalPages = page
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    drawFooter(doc, p, totalPages)
  }

  doc.save(`carnet-de-don-${user.prenom}-${user.nom}.pdf`.toLowerCase().replace(/\s+/g, '-'))
}
