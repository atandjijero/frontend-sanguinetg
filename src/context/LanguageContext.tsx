import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from '../lib/api'

export type Langue = 'fr' | 'en'

const LANGUE_STORAGE_KEY = 'langue'
const CACHE_STORAGE_KEY = 'traductions_en'

interface LanguageContextValue {
  langue: Langue
  setLangue: (langue: Langue) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function chargerCache(): Map<string, string> {
  try {
    const brut = localStorage.getItem(CACHE_STORAGE_KEY)
    return new Map(brut ? (JSON.parse(brut) as [string, string][]) : [])
  } catch {
    return new Map()
  }
}

function sauvegarderCache() {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(Array.from(cache.entries())))
  } catch {
    // stockage indisponible (navigation privée, quota atteint...) : le cache reste en mémoire pour cette session
  }
}

// Cache partagé (mémoire + localStorage) : chaque texte n'est envoyé qu'une fois à DeepL,
// ensuite réutilisé pour toute la session (et les suivantes) sans nouvel appel réseau.
const cache = chargerCache()

type Abonne = (traduit: string) => void
const enAttente = new Map<string, Abonne[]>()
let vidageProgramme = false

function demanderTraduction(texte: string, onResolu: Abonne) {
  const enCache = cache.get(texte)
  if (enCache !== undefined) {
    onResolu(enCache)
    return
  }
  const abonnes = enAttente.get(texte)
  if (abonnes) {
    abonnes.push(onResolu)
  } else {
    enAttente.set(texte, [onResolu])
  }
  if (!vidageProgramme) {
    vidageProgramme = true
    queueMicrotask(viderLot)
  }
}

// Regroupe tous les textes demandés dans le même tick en un seul appel /traduction,
// pour éviter une requête DeepL par élément de texte affiché.
async function viderLot() {
  vidageProgramme = false
  const lot = Array.from(enAttente.entries())
  enAttente.clear()
  if (lot.length === 0) return

  const textes = lot.map(([texte]) => texte)
  try {
    const { traductions } = await api.post<{ traductions: string[] }>('/traduction', {
      textes,
      langueCible: 'EN',
    })
    lot.forEach(([texte, abonnes], i) => {
      const traduit = traductions[i] ?? texte
      cache.set(texte, traduit)
      abonnes.forEach((cb) => cb(traduit))
    })
    sauvegarderCache()
  } catch {
    // Traduction indisponible : on retombe silencieusement sur le texte français d'origine.
    lot.forEach(([texte, abonnes]) => abonnes.forEach((cb) => cb(texte)))
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [langue, setLangueState] = useState<Langue>(() => {
    return localStorage.getItem(LANGUE_STORAGE_KEY) === 'en' ? 'en' : 'fr'
  })

  function setLangue(nouvelle: Langue) {
    setLangueState(nouvelle)
    localStorage.setItem(LANGUE_STORAGE_KEY, nouvelle)
  }

  return <LanguageContext.Provider value={{ langue, setLangue }}>{children}</LanguageContext.Provider>
}

export function useLangue() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLangue doit être utilisé à l’intérieur de LanguageProvider')
  }
  return ctx
}

/** Traduit `texte` (français) à la volée via DeepL quand la langue active est l'anglais. */
export function useTraduction(texte: string): string {
  const { langue } = useLangue()
  const [valeur, setValeur] = useState(texte)

  useEffect(() => {
    if (langue === 'fr') {
      setValeur(texte)
      return
    }
    let annule = false
    demanderTraduction(texte, (traduit) => {
      if (!annule) setValeur(traduit)
    })
    return () => {
      annule = true
    }
  }, [texte, langue])

  return langue === 'fr' ? texte : valeur
}

/** Wrapper ergonomique : `<T>Accueil</T>` traduit le texte français passé en enfant. */
export function T({ children }: { children: string }) {
  return <>{useTraduction(children)}</>
}
