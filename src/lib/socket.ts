import { io, type Socket } from 'socket.io-client'
import { API_URL, getAccessToken } from './api'

export function connecterMessagerie(): Socket {
  return io(`${API_URL}/messagerie`, {
    auth: { token: getAccessToken() },
    transports: ['websocket', 'polling'],
  })
}
