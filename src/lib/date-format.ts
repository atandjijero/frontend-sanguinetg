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

export function formatStatutActivite(date: Date, enLigne: boolean): { enLigne: boolean; label: string } {
  if (enLigne) {
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

export function calculerAge(dateNaissance: string, maintenant = new Date()): number {
  const naissance = new Date(dateNaissance)
  let age = maintenant.getFullYear() - naissance.getFullYear()
  const anniversairePasse =
    maintenant.getMonth() > naissance.getMonth() ||
    (maintenant.getMonth() === naissance.getMonth() && maintenant.getDate() >= naissance.getDate())
  if (!anniversairePasse) age -= 1
  return age
}

export function dateIlYA(annees: number): string {
  const date = new Date()
  date.setFullYear(date.getFullYear() - annees)
  return date.toISOString().slice(0, 10)
}
