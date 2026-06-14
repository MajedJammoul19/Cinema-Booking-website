import { useAuth } from '@clerk/clerk-react'

// In production (Vercel), set VITE_BACKEND_URL to your Render URL
// e.g. VITE_BACKEND_URL=https://your-backend.onrender.com
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

export const useApi = () => {
  const { getToken } = useAuth()

  const authFetch = async (url, options = {}) => {
    const token = await getToken()
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })
    return res
  }

  // Public fetch - no auth needed (for movies list, movie details)
  const publicFetch = async (url) => {
    const res = await fetch(`${BASE_URL}${url}`)
    return res
  }

  return { authFetch, publicFetch }
}