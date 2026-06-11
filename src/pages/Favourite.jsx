import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Trash2 } from 'lucide-react'
import Moviecard from '../components/Moviecard'
import toast from 'react-hot-toast'

const Favourite = () => {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    setIsLoading(true)
    const favoritesData = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(favoritesData)
    setIsLoading(false)
  }

  const removeFromFavorites = (movieId, movieTitle) => {
    const updatedFavorites = favorites.filter(movie => movie._id !== movieId)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
    setFavorites(updatedFavorites)
    toast.success(`${movieTitle} removed from favorites`)
  }

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all movies from favorites?')) {
      localStorage.setItem('favorites', JSON.stringify([]))
      setFavorites([])
      toast.success('All favorites removed')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-6 md:px-16 lg:px-24 xl:px-44 py-20">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-4 ">❤️</div>
          <h2 className="text-2xl font-semibold text-white mb-2">No Favorite Movies</h2>
          <p className="text-gray-400 mb-6">You haven't added any movies to your favorites yet</p>
          <button 
            onClick={() => navigate('/movies')}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition"
          >
            Browse Movies
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-6 md:px-16 lg:px-24 xl:px-44 py-20">
      {/* Header Section */}
      <div className="relative mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              Your Favorite Movies
            </h1>
            <p className="text-gray-400">Movies you've saved to watch later</p>
          </div>
          <button 
            onClick={clearAllFavorites}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
        <div className="absolute -bottom-3 left-0 w-20 h-1 bg-red-500 rounded-full"></div>
      </div>
      
      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((movie) => (
          <div key={movie._id} className="relative">
            <Moviecard movie={movie} variant="default" />
            <button 
              onClick={() => removeFromFavorites(movie._id, movie.title)}
              className="absolute top-2 right-2 z-10 bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition transform hover:scale-105"
              title="Remove from favorites"
            >
              <Heart className="w-4 h-4 fill-white" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Results Count */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Showing {favorites.length} favorite movie{favorites.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}

export default Favourite