import { useMemo } from 'react'
import { TrendLineChart } from './TrendLineChart'
import { SEQUENTIAL_BLUE } from '../../lib/chart-colors'
import { derniersJours, cleJour } from '../../lib/trend'
import { T } from '../../context/LanguageContext'
import type { Alerte } from '../../lib/types'

export function AlertesTrendChart({ alertes }: { alertes: Alerte[] }) {
  const data = useMemo(() => {
    const jours = derniersJours(14)
    const parJour = new Map(jours.map((j) => [j.cle, { label: j.label, alertes: 0 }]))
    for (const alerte of alertes) {
      const bucket = parJour.get(cleJour(alerte.dateCreation))
      if (bucket) bucket.alertes += 1
    }
    return [...parJour.values()]
  }, [alertes])

  return (
    <TrendLineChart
      title={<T>Alertes créées — 14 derniers jours</T>}
      data={data}
      series={[{ key: 'alertes', label: 'Alertes', color: SEQUENTIAL_BLUE[450] }]}
    />
  )
}
