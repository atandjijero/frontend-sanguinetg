import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui-shadcn/ui/card'
import { Badge } from '../../components/ui-shadcn/ui/badge'
import { useAuth } from '../../context/AuthContext'
import { T } from '../../context/LanguageContext'

const GROUPE_LABELS: Record<string, string> = {
  A_POSITIF: 'A+',
  A_NEGATIF: 'A-',
  B_POSITIF: 'B+',
  B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+',
  AB_NEGATIF: 'AB-',
  O_POSITIF: 'O+',
  O_NEGATIF: 'O-',
}

export default function ProfilPage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>
          <T>Mon profil</T>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">
              <T>Nom</T>
            </div>
            <div className="font-medium">
              {user.prenom} {user.nom}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">
              <T>Rôle</T>
            </div>
            <div className="font-medium">{user.role}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Email</div>
            <div className="font-medium">{user.email ?? '—'}</div>
          </div>
          <div>
            <div className="text-muted-foreground">
              <T>Téléphone</T>
            </div>
            <div className="font-medium">{user.telephone ?? '—'}</div>
          </div>
          {user.role === 'DONNEUR' && (
            <div>
              <div className="text-muted-foreground">
                <T>Groupe sanguin</T>
              </div>
              <div className="font-medium">
                {user.groupeSanguin ? (
                  <Badge variant="outline">{GROUPE_LABELS[user.groupeSanguin]}</Badge>
                ) : (
                  <T>Non renseigné</T>
                )}
              </div>
            </div>
          )}
          <div>
            <div className="text-muted-foreground">
              <T>Statut</T>
            </div>
            <Badge variant={user.statut === 'ACTIF' ? 'default' : 'destructive'}>{user.statut}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
