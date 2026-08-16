import { useMemo } from 'react'
import { TrendLineChart } from './TrendLineChart'
import { CATEGORICAL_LIGHT } from '../../lib/chart-colors'
import { derniersJours, cleJour } from '../../lib/trend'
import { T } from '../../context/LanguageContext'
import type { Utilisateur } from '../../lib/types'

export function DonneursTrendChart({ donneurs }: { donneurs: Utilisateur[] }) {
  const data = useMemo(() => {
    const jours = derniersJours(14)
    const parJour = new Map(jours.map((j) => [j.cle, { label: j.label, inscriptions: 0 }]))
    for (const donneur of donneurs) {
      const date = donneur.dateInscription ?? donneur.createdAt
      if (!date) continue
      const bucket = parJour.get(cleJour(date))
      if (bucket) bucket.inscriptions += 1
    }
    return [...parJour.values()]
  }, [donneurs])

  return (
    <TrendLineChart
      title={<T>Nouveaux donneurs — 14 derniers jours</T>}
      data={data}
      series={[{ key: 'inscriptions', label: 'Inscriptions', color: CATEGORICAL_LIGHT[3] }]}
    />
  )
}
