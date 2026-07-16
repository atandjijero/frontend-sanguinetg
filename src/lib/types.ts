export type Role = 'SUPERADMIN' | 'ADMIN' | 'MEDECIN' | 'AGENT_CNTS' | 'DONNEUR'

export type StatutUtilisateur = 'ACTIF' | 'INACTIF'

export type GroupeSanguin =
  | 'A_POSITIF'
  | 'A_NEGATIF'
  | 'B_POSITIF'
  | 'B_NEGATIF'
  | 'AB_POSITIF'
  | 'AB_NEGATIF'
  | 'O_POSITIF'
  | 'O_NEGATIF'

export interface Utilisateur {
  id: string
  nom: string
  prenom: string
  email: string | null
  telephone: string | null
  role: Role
  statut: StatutUtilisateur
  groupeSanguin: GroupeSanguin | null
  quartierId: string | null
  dateInscription?: string | null
  createdAt?: string
}

export interface Quartier {
  id: string
  nom: string
  latitude: number | null
  longitude: number | null
}

export interface CentreDon {
  id: string
  nom: string
  adresse: string | null
  latitude: number | null
  longitude: number | null
  quartierId: string | null
  quartier?: Quartier | null
}

export type CleImage = 'HERO' | 'INSTITUTIONAL_DOCTOR' | 'INSTITUTIONAL_VIALS' | 'ABOUT_LABORATORY'

export interface ImageAccueil {
  id: string
  cle: CleImage
  url: string
  cloudinaryId: string
  dateMiseAJour: string
}

export type StatutAlerte = 'OUVERTE' | 'FERMEE'
export type StatutReponse = 'JE_VIENS' | 'INDISPONIBLE'

export interface Alerte {
  id: string
  groupeSanguinRequis: GroupeSanguin
  quartierId: string
  quartier?: Quartier
  centreDonId?: string | null
  centreDon?: CentreDon | null
  statut: StatutAlerte
  dateCreation: string
  creePar?: { id: string; nom: string; prenom: string }
  maReponse?: StatutReponse | null
  resume?: { jeViens: number; indisponible: number }
  donneursNotifies?: number
  _count?: { reponses: number; notifications?: number }
}

export interface ReponseAvecDonneur {
  id: string
  statut: StatutReponse
  dateReponse: string
  donneur: { id: string; nom: string; prenom: string; telephone: string | null; groupeSanguin: GroupeSanguin | null }
}

export interface CarnetDigital {
  id: string
  donneurId: string
  dateDon: string
  centreDonId: string
  centreDon?: CentreDon
  messageRemerciement: string | null
  rappelProchaineDate: string | null
  reponseId?: string | null
  recompenseId?: string | null
  recompense?: Recompense | null
  donneur?: { id: string; nom: string; prenom: string }
}

export type TypeRecompense = 'BADGE' | 'CERTIFICAT' | 'VIVRES' | 'TRANSPORT' | 'AUTRE'
export type StatutRecompense = 'ATTRIBUEE' | 'UTILISEE' | 'EXPIREE'

export interface Recompense {
  id: string
  donneurId: string
  type: TypeRecompense
  description: string
  statut: StatutRecompense
  dateAttribution: string
  donneur?: { id: string; nom: string; prenom: string }
}

export type CategorieConseil = 'AVANT_DON' | 'APRES_DON' | 'ELIGIBILITE'

export interface ConseilSante {
  id: string
  titre: string
  contenu: string
  categorie: CategorieConseil
  datePublication: string
  validePar?: { id: string; nom: string; prenom: string }
}

export interface StatistiquesMobilisation {
  nombreAlertes: number
  nombreReponses: number
  delaiMoyenMinutes: number | null
  tauxCouvertureUneHeure: number | null
  donneursMobilisesParAlerte: number | null
}

export type TypeAlerteSecurite = 'BRUTE_FORCE' | 'CSP_VIOLATION' | 'SQL_INJECTION' | 'XSS_ATTEMPT'
export type GraviteAlerteSecurite = 'FAIBLE' | 'MOYEN' | 'ELEVE' | 'CRITIQUE'

export interface AlerteSecurite {
  id: string
  type: TypeAlerteSecurite
  gravite: GraviteAlerteSecurite
  message: string
  ipSource: string | null
  uri: string | null
  userAgent: string | null
  payload: unknown | null
  dateCreation: string
}

export interface AlertesSecuriteStats {
  total: number
  critiques: number
  bruteForce: number
  cspViolations: number
  sqlInjections: number
  xssAttempts: number
}

export interface FrequentationStats {
  enLigne: number
  connectes: number
  anonymes: number
}

export interface PageResultat<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type StatutMessageContact = 'NOUVEAU' | 'REPONDU'

export interface MessageContact {
  id: string
  nomComplet: string
  email: string
  sujet: string
  message: string
  statut: StatutMessageContact
  dateCreation: string
  reponse: string | null
  dateReponse: string | null
  repondPar?: { id: string; nom: string; prenom: string } | null
}

export type TypeNotification = 'SMS' | 'EMAIL' | 'PUSH'
export type StatutNotification = 'ENVOYEE' | 'RECUE' | 'LUE'

export interface NotificationDonneur {
  id: string
  type: TypeNotification
  statut: StatutNotification
  contenu: string | null
  emailEnvoye: boolean
  smsEnvoye: boolean
  dateEnvoi: string
  alerteId: string | null
  alerte?: { id: string; quartier?: { nom: string } | null; centreDon?: { nom: string } | null } | null
}
