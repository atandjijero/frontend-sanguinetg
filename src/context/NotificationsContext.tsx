import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

interface NotificationsContextValue {
  refreshKey: number
  notifyRefresh: () => void
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0)

  const notifyRefresh = useCallback(() => {
    setRefreshKey((key) => key + 1)
  }, [])

  const value = useMemo(() => ({ refreshKey, notifyRefresh }), [refreshKey, notifyRefresh])

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotifications doit être utilisé à l\'intérieur de <NotificationsProvider>')
  }
  return context
}
