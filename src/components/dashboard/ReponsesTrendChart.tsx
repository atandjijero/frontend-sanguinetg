import { useMemo } from 'react'
import { TrendLineChart } from './TrendLineChart'
import { CATEGORICAL_LIGHT } from '../../lib/chart-colors'
import { derniersJours, cleJour } from '../../lib/trend'
import { T } from '../../context/LanguageContext'
import type { Alerte } from '../../lib/types'

/**
 * Réponses cumulées des alertes créées chaque jour (les réponses individuelles ne sont
 * pas exposées globalement à l'admin — seul `resume` par alerte l'est).
 */
export function ReponsesTrendChart({ alertes }: { alertes: Alerte[] }) {
  const data = useMemo(() => {
    const jours = derniersJours(14)
    const parJour = new Map(jours.map((j) => [j.cle, { label: j.label, jeViens: 0, indisponible: 0 }]))
    for (const alerte of alertes) {
      const bucket = parJour.get(cleJour(alerte.dateCreation))
      if (bucket && alerte.resume) {
        bucket.jeViens += alerte.resume.jeViens
        bucket.indisponible += alerte.resume.indisponible
      }
    }
    return [...parJour.values()]
  }, [alertes])

  return (
    <TrendLineChart
      title={<T>Réponses aux alertes — 14 derniers jours</T>}
      data={data}
      series={[
        { key: 'jeViens', label: 'Je viens', color: CATEGORICAL_LIGHT[0] },
        { key: 'indisponible', label: 'Indisponible', color: CATEGORICAL_LIGHT[5] },
      ]}
    />
  )
}
