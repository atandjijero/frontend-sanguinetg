import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useApiData } from '../hooks/useApiData'
import { ApiError } from '../lib/api'
import { GROUPES_SANGUINS, GROUPE_SANGUIN_LABELS } from '../lib/constants'
import { T } from '../context/LanguageContext'
import type { Quartier } from '../lib/types'

type RegisterField = 'nom' | 'prenom' | 'email' | 'telephone' | 'motDePasse' | 'confirmationMotDePasse' | 'consentement'

function validerInscription(values: Record<RegisterField, string | boolean>) {
  const errors: Partial<Record<RegisterField, string[]>> = {}
  const ajouter = (field: RegisterField, message: string) => {
    errors[field] = [...(errors[field] ?? []), message]
  }

  if (!/^(?=.*\p{L})[\p{L} .'-]+$/u.test(String(values.nom))) {
    ajouter('nom', 'Le nom doit contenir uniquement des lettres, espaces, apostrophes ou tirets')
  }
  if (!/^(?=.*\p{L})[\p{L} .'-]+$/u.test(String(values.prenom))) {
    ajouter('prenom', 'Le prénom doit contenir uniquement des lettres, espaces, apostrophes ou tirets')
  }
  if (!/^(\+228)?[0-9]{8}$/.test(String(values.telephone))) {
    ajouter('telephone', 'Le numéro de téléphone doit être un numéro togolais valide (8 chiffres, préfixe +228 optionnel)')
  }
  if (String(values.motDePasse).length < 8 || !/[A-Za-z]/.test(String(values.motDePasse)) || !/\d/.test(String(values.motDePasse))) {
    ajouter('motDePasse', 'Le mot de passe doit contenir au moins une lettre et un chiffre')
  }
  if (values.motDePasse !== values.confirmationMotDePasse) {
    ajouter('confirmationMotDePasse', 'La confirmation ne correspond pas au mot de passe')
  }
  if (!values.consentement) ajouter('consentement', "Vous devez accepter l'utilisation de vos informations pour vous inscrire.")
  return errors
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { data: quartiers } = useApiData<Quartier[]>('/quartiers')

  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [groupeSanguin, setGroupeSanguin] = useState('')
  const [quartierId, setQuartierId] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('')
  const [accepte, setAccepte] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterField, string[]>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    const localErrors = validerInscription({ nom, prenom, email, telephone, motDePasse, confirmationMotDePasse, consentement: accepte })
    setFieldErrors(localErrors)
    if (Object.keys(localErrors).length > 0) return
    setSubmitting(true)
    try {
      await register({
        nom,
        prenom,
        email,
        telephone,
        motDePasse,
        confirmationMotDePasse,
        groupeSanguin: groupeSanguin || undefined,
        quartierId: quartierId || undefined,
        consentement: accepte,
      })
      setSubmitted(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setFieldErrors(err.fieldErrors as Partial<Record<RegisterField, string[]>>)
        setError(Object.keys(err.fieldErrors).length ? null : err.message)
      } else {
        setError("Impossible de créer votre compte, réessayez.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="pt-16 pb-20">
        <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop text-center mb-10">
          <h1 className="font-headline-lg text-headline-lg mb-3">
            <T>Devenez donneur à Lomé</T>
          </h1>
          <p className="text-secondary">
            <T>
              Rejoignez le réseau Sanguine TG pour recevoir des alertes ciblées selon votre groupe sanguin et votre
              zone, et bénéficier du suivi et du conseil santé du CNTS.
            </T>
          </p>
        </div>
        <div className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 soft-shadow">
            {submitted ? (
              <div className="text-center py-12">
                <h2 className="font-headline-md text-headline-md text-primary mb-3">
                  <T>Vérifiez votre boîte mail</T>
                </h2>
                <p className="text-secondary text-justify mb-6">
                  <T>
                    Votre compte donneur a été créé. Nous vous avons envoyé un email de vérification : cliquez sur le
                    lien qu'il contient pour activer votre compte avant de vous connecter.
                  </T>
                </p>
                <Button variant="primary" size="lg" onClick={() => navigate('/connexion')}>
                  <T>Retour à la connexion</T>
                </Button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">
                      <T>Nom</T>
                    </span>
                    <input
                      required
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      aria-invalid={Boolean(fieldErrors.nom?.length)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {fieldErrors.nom?.map((message) => <p key={message} className="mt-1 text-sm text-error"><T>{message}</T></p>)}
                  </label>
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">
                      <T>Prénom</T>
                    </span>
                    <input
                      required
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      aria-invalid={Boolean(fieldErrors.prenom?.length)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {fieldErrors.prenom?.map((message) => <p key={message} className="mt-1 text-sm text-error"><T>{message}</T></p>)}
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">Email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={Boolean(fieldErrors.email?.length)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {fieldErrors.email?.map((message) => <p key={message} className="mt-1 text-sm text-error"><T>{message}</T></p>)}
                  </label>
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">
                      <T>Téléphone</T>
                    </span>
                    <input
                      required
                      type="tel"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      placeholder="+22890123456"
                      aria-invalid={Boolean(fieldErrors.telephone?.length)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {fieldErrors.telephone?.map((message) => <p key={message} className="mt-1 text-sm text-error"><T>{message}</T></p>)}
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">
                      <T>Groupe sanguin déclaré</T>
                    </span>
                    <select
                      value={groupeSanguin}
                      onChange={(e) => setGroupeSanguin(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">
                        <T>Sélectionner</T>
                      </option>
                      {GROUPES_SANGUINS.map((group) => (
                        <option key={group} value={group}>
                          {GROUPE_SANGUIN_LABELS[group]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">
                      <T>Zone à Lomé</T>
                    </span>
                    <select
                      value={quartierId}
                      onChange={(e) => setQuartierId(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">
                        <T>Sélectionner</T>
                      </option>
                      {(quartiers ?? []).map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.nom}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">
                      <T>Mot de passe</T>
                    </span>
                    <input
                      required
                      type="password"
                      value={motDePasse}
                      onChange={(e) => setMotDePasse(e.target.value)}
                      minLength={8}
                      aria-invalid={Boolean(fieldErrors.motDePasse?.length)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {fieldErrors.motDePasse?.map((message) => <p key={message} className="mt-1 text-sm text-error"><T>{message}</T></p>)}
                  </label>
                  <label className="block">
                    <span className="text-label-md text-on-surface mb-2 block">
                      <T>Confirmer le mot de passe</T>
                    </span>
                    <input
                      required
                      type="password"
                      value={confirmationMotDePasse}
                      onChange={(e) => setConfirmationMotDePasse(e.target.value)}
                      aria-invalid={Boolean(fieldErrors.confirmationMotDePasse?.length)}
                      className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {fieldErrors.confirmationMotDePasse?.map((message) => <p key={message} className="mt-1 text-sm text-error"><T>{message}</T></p>)}
                  </label>
                </div>

                <label className="flex items-start gap-3">
                  <input
                    required
                    type="checkbox"
                    checked={accepte}
                    onChange={(e) => setAccepte(e.target.checked)}
                    className="mt-1 accent-primary"
                  />
                  <span className="text-body-md text-secondary">
                    <T>
                      J'accepte que mes informations soient utilisées par le CNTS pour me contacter lors d'urgences
                      de don de sang compatibles avec mon profil.
                    </T>
                  </span>
                  {fieldErrors.consentement?.map((message) => <p key={message} className="text-sm text-error"><T>{message}</T></p>)}
                </label>

                {error && (
                  <p className="text-sm text-error">
                    <T>{error}</T>
                  </p>
                )}

                <Button type="submit" variant="primary" size="lg" className="rounded-xl w-full" disabled={submitting}>
                  <T>Créer mon compte donneur</T>
                  <UserPlus size={16} aria-hidden />
                </Button>

                <p className="text-center text-body-md text-secondary">
                  <T>Déjà inscrit ?</T>{' '}
                  <Link to="/connexion" className="text-primary font-semibold hover:underline">
                    <T>Se connecter</T>
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
