/** Fenêtre glissante de N jours (aujourd'hui inclus), pour les petits graphiques de tendance du dashboard. */
export function derniersJours(n: number): { cle: string; label: string }[] {
  const jours: { cle: string; label: string }[] = []
  const aujourdhui = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), aujourdhui.getDate() - i)
    jours.push({
      cle: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    })
  }
  return jours
}

export function cleJour(date: string | Date): string {
  return new Date(date).toISOString().slice(0, 10)
}
