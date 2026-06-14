// src/utils/api.js
import { useAuth } from '@clerk/clerk-react'

export const useApi = () => {
  const { getToken } = useAuth()

  const authFetch = async (url, options = {}) => {
    const token = await getToken()
    return fetch(`http://localhost:5000${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })
  }

  return { authFetch }
}