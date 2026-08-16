import { useMemo } from 'react'
import { TrendLineChart } from './TrendLineChart'
import { CATEGORICAL_LIGHT } from '../../lib/chart-colors'
import { derniersJours, cleJour } from '../../lib/trend'
import { T } from '../../context/LanguageContext'
import type { SessionRecente } from '../../lib/types'

export function VisiteursTrendChart({ sessions }: { sessions: SessionRecente[] }) {
  const data = useMemo(() => {
    const jours = derniersJours(14)
    const parJour = new Map(jours.map((j) => [j.cle, { label: j.label, visiteurs: 0, connectes: 0 }]))
    for (const session of sessions) {
      const bucket = parJour.get(cleJour(session.premiereActivite))
      if (!bucket) continue
      bucket.visiteurs += 1
      if (session.utilisateurId) bucket.connectes += 1
    }
    return [...parJour.values()]
  }, [sessions])

  return (
    <TrendLineChart
      title={<T>Visiteurs — 14 derniers jours</T>}
      data={data}
      series={[
        { key: 'visiteurs', label: 'Total', color: CATEGORICAL_LIGHT[0] },
        { key: 'connectes', label: 'Connectés', color: CATEGORICAL_LIGHT[7] },
      ]}
    />
  )
}
