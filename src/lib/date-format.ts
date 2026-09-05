export function formatSeparateurDateMessage(date: Date): string {
  const maintenant = new Date()
  const debutJour = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const joursEcoules = Math.round((debutJour(maintenant) - debutJour(date)) / 86400000)

  if (joursEcoules === 0) return "Aujourd'hui"
  if (joursEcoules === 1) return 'Hier'
  if (joursEcoules > 1 && joursEcoules < 7) {
    const jour = date.toLocaleDateString('fr-FR', { weekday: 'long' })
    return jour.charAt(0).toUpperCase() + jour.slice(1)
  }

  const memeAnnee = date.getFullYear() === maintenant.getFullYear()
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: memeAnnee ? undefined : 'numeric',
  })
}
