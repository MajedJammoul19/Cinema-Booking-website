import { useState, useEffect } from 'react'
import Moviecard from '../components/Moviecard'
import { useApi } from '../hooks/useApi'

const Movies = () => {
  const { publicFetch } = useApi()
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await publicFetch('/api/movies')
        const data = await res.json()
        if (data.success) setMovies(data.movies)
      } catch (error) {
        console.error('Failed to fetch movies:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovies()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading movies...</p>
        </div>
      </div>
    )
  }

  return movies.length > 0 ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-10 min-h-screen bg-linear-to-b from-gray-900 to-black">
      {/* Header Section */}
      <div className="relative mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 mt-13">Now Showing</h1>
        <p className="text-gray-400">Discover the latest movies playing in theaters near you</p>
        <div className="absolute -bottom-3 left-0 w-20 h-1 bg-red-500 rounded-full"></div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Moviecard key={movie._id} movie={movie} />
        ))}
      </div>

      {/* Results Count */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Showing {movies.length} movie{movies.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[60vh] px-6 md:px-16 lg:px-24 xl:px-44">
      <div className="text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-2xl font-semibold text-white mb-2">No Movies Available</h2>
        <p className="text-gray-400">Check back later for new releases</p>
      </div>
    </div>
  )
}

export default Movies