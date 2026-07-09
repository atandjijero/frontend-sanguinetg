import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { Role } from '../../lib/types'

interface ProtectedRouteProps {
  roles?: Role[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-secondary">
        Chargement...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location }} />
  }

  const estAutorise = !roles || user.role === 'SUPERADMIN' || roles.includes(user.role)

  if (!estAutorise) {
    const accueil = user.role === 'DONNEUR' ? '/espace-donneur' : '/admin'
    return <Navigate to={accueil} replace />
  }

  return <Outlet />
}
