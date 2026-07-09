import type { CategorieConseil, GraviteAlerteSecurite, GroupeSanguin, TypeAlerteSecurite, TypeRecompense } from './types'

export const GROUPE_SANGUIN_LABELS: Record<GroupeSanguin, string> = {
  A_POSITIF: 'A+',
  A_NEGATIF: 'A-',
  B_POSITIF: 'B+',
  B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+',
  AB_NEGATIF: 'AB-',
  O_POSITIF: 'O+',
  O_NEGATIF: 'O-',
}

export const GROUPES_SANGUINS: GroupeSanguin[] = [
  'O_NEGATIF',
  'O_POSITIF',
  'A_NEGATIF',
  'A_POSITIF',
  'B_NEGATIF',
  'B_POSITIF',
  'AB_NEGATIF',
  'AB_POSITIF',
]

export const CATEGORIE_CONSEIL_LABELS: Record<CategorieConseil, string> = {
  AVANT_DON: 'Avant le don',
  APRES_DON: 'Après le don',
  ELIGIBILITE: 'Éligibilité',
}

export const TYPE_RECOMPENSE_LABELS: Record<TypeRecompense, string> = {
  BADGE: 'Badge',
  CERTIFICAT: 'Certificat',
  VIVRES: 'Vivres',
  TRANSPORT: 'Transport',
  AUTRE: 'Autre',
}

export const TYPE_ALERTE_SECURITE_LABELS: Record<TypeAlerteSecurite, string> = {
  BRUTE_FORCE: 'Brute Force',
  CSP_VIOLATION: 'Violation CSP',
  SQL_INJECTION: 'Injection SQL',
  XSS_ATTEMPT: 'Attaque XSS',
}

export const GRAVITE_ALERTE_SECURITE_LABELS: Record<GraviteAlerteSecurite, string> = {
  FAIBLE: 'Faible',
  MOYEN: 'Moyen',
  ELEVE: 'Élevé',
  CRITIQUE: 'Critique',
}
