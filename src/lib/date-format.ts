// Même seuil que le backend (SEUIL_EN_LIGNE_MS dans analytics.service.ts).
const SEUIL_EN_LIGNE_MS = 5 * 60 * 1000

function joursEcoulesDepuis(date: Date): number {
  const maintenant = new Date()
  const debutJour = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  return Math.round((debutJour(maintenant) - debutJour(date)) / 86400000)
}

export function formatSeparateurDateMessage(date: Date): string {
  const joursEcoules = joursEcoulesDepuis(date)

  if (joursEcoules === 0) return "Aujourd'hui"
  if (joursEcoules === 1) return 'Hier'
  if (joursEcoules > 1 && joursEcoules < 7) {
    const jour = date.toLocaleDateString('fr-FR', { weekday: 'long' })
    return jour.charAt(0).toUpperCase() + jour.slice(1)
  }

  const memeAnnee = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: memeAnnee ? undefined : 'numeric',
  })
}

/** Statut façon WhatsApp : « En ligne » si actif dans les 5 dernières minutes, sinon « Vu ... ». */
export function formatStatutActivite(date: Date): { enLigne: boolean; label: string } {
  if (Date.now() - date.getTime() < SEUIL_EN_LIGNE_MS) {
    return { enLigne: true, label: 'En ligne' }
  }

  const heure = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  const joursEcoules = joursEcoulesDepuis(date)

  if (joursEcoules === 0) return { enLigne: false, label: `Vu aujourd'hui à ${heure}` }
  if (joursEcoules === 1) return { enLigne: false, label: `Vu hier à ${heure}` }
  if (joursEcoules > 1 && joursEcoules < 7) {
    const jour = date.toLocaleDateString('fr-FR', { weekday: 'long' })
    return { enLigne: false, label: `Vu ${jour} à ${heure}` }
  }

  const memeAnnee = date.getFullYear() === new Date().getFullYear()
  const dateTexte = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: memeAnnee ? undefined : 'numeric',
  })
  return { enLigne: false, label: `Vu le ${dateTexte} à ${heure}` }
}
