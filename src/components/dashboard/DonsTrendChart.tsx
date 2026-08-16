import { useMemo } from 'react'
import { TrendLineChart } from './TrendLineChart'
import { CATEGORICAL_LIGHT } from '../../lib/chart-colors'
import { derniersJours, cleJour } from '../../lib/trend'
import { T } from '../../context/LanguageContext'
import type { CarnetDigital } from '../../lib/types'

export function DonsTrendChart({ carnets }: { carnets: CarnetDigital[] }) {
  const data = useMemo(() => {
    const jours = derniersJours(14)
    const parJour = new Map(jours.map((j) => [j.cle, { label: j.label, dons: 0 }]))
    for (const carnet of carnets) {
      const bucket = parJour.get(cleJour(carnet.dateDon))
      if (bucket) bucket.dons += 1
    }
    return [...parJour.values()]
  }, [carnets])

  return (
    <TrendLineChart
      title={<T>Dons enregistrés — 14 derniers jours</T>}
      data={data}
      series={[{ key: 'dons', label: 'Dons', color: CATEGORICAL_LIGHT[4] }]}
    />
  )
}
