import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Star, Play, Users, Film, Heart } from 'lucide-react'
import Moviecard from '../components/Moviecard'
import { useState, useEffect } from 'react'
import DateSelect from '../components/DateSelect'
import toast from 'react-hot-toast'
import { useApi } from '../hooks/useApi'

const MovieDetails = () => {
  const smoothScrollToElement = (targetId, offset = 80) => {
    const target = document.getElementById(targetId)
    if (!target) return
    const distance = target.getBoundingClientRect().top - offset
    const startPosition = window.pageYOffset
    const duration = 800
    let startTime = null
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      window.scrollTo(0, startPosition + distance * easeInOutCubic(progress))
      if (currentTime - startTime < duration) requestAnimationFrame(animation)
    }
    requestAnimationFrame(animation)
  }

  const { id } = useParams()
  const navigate = useNavigate()
  const { publicFetch } = useApi()

  const [movie, setMovie] = useState(null)
  const [similarMovies, setSimilarMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true)
        // Fetch this movie (includes dateTime)
        const res = await publicFetch(`/api/movies/${id}`)
        const data = await res.json()

        if (!data.success) {
          setMovie(null)
          return
        }

        setMovie(data.movie)

        // Check favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        setIsFavorite(favorites.some(fav => fav._id === data.movie._id))

        // Fetch all movies for "similar" section
        const allRes = await publicFetch('/api/movies')
        const allData = await allRes.json()
        if (allData.success) {
          setSimilarMovies(allData.movies.filter(m => m._id !== id).slice(0, 4))
        }
      } catch (error) {
        console.error('Failed to fetch movie:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovie()
  }, [id])

  const toggleFavorite = () => {
    if (!movie) return
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (isFavorite) {
      localStorage.setItem('favorites', JSON.stringify(favorites.filter(f => f._id !== movie._id)))
      setIsFavorite(false)
      toast.success(`${movie.title} removed from favorites`)
    } else {
      favorites.push({
        _id: movie._id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        overview: movie.overview,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        runtime: movie.runtime,
        release_date: movie.release_date,
        genres: movie.genres,
        tagline: movie.tagline,
        addedToFavorites: new Date().toISOString(),
      })
      localStorage.setItem('favorites', JSON.stringify(favorites))
      setIsFavorite(true)
      toast.success(`${movie.title} added to favorites`)
    }
  }

  const formatRuntime = (minutes) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading movie...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-semibold text-white mb-2">Movie Not Found</h2>
          <p className="text-gray-400 mb-6">The movie you're looking for doesn't exist</p>
          <button onClick={() => navigate('/movies')} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition">
            Back to Movies
          </button>
        </div>
      </div>
    )
  }

  // dateTime from MongoDB is a Map — convert to plain object for DateSelect
  const dateTime = movie.dateTime instanceof Map
    ? Object.fromEntries(movie.dateTime)
    : movie.dateTime || {}

  return (
    <div className="min-h-screen mt-30 bg-gradient-to-b from-gray-900 to-black">

      {/* Movie Details Section */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 pb-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Left Side - Poster */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <img src={movie.poster_path} alt={movie.title} className="w-full rounded-xl shadow-2xl" />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Play className="w-5 h-5 fill-white" /> Watch Trailer
                </button>
                <button
                  onClick={toggleFavorite}
                  className={`p-3 rounded-lg transition ${isFavorite ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="lg:w-2/3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-gray-400 text-lg italic mb-4">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{movie.vote_average?.toFixed(1)}</span>
                <span className="text-gray-500">({movie.vote_count?.toLocaleString()} votes)</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Film className="w-4 h-4" />
                <span>{movie.original_language?.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 bg-gray-800/50 rounded-lg">
              {movie.release_date && (
                <div>
                  <p className="text-gray-500 text-sm">Release Date</p>
                  <p className="text-white font-medium">
                    {new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
              {movie.runtime && (
                <div>
                  <p className="text-gray-500 text-sm">Runtime</p>
                  <p className="text-white font-medium">{formatRuntime(movie.runtime)}</p>
                </div>
              )}
              {movie.original_language && (
                <div>
                  <p className="text-gray-500 text-sm">Original Language</p>
                  <p className="text-white font-medium">{movie.original_language.toUpperCase()}</p>
                </div>
              )}
              {movie.vote_average && (
                <div>
                  <p className="text-gray-500 text-sm">Rating</p>
                  <p className="text-white font-medium">{movie.vote_average.toFixed(1)} / 10</p>
                </div>
              )}
            </div>

            <button
              onClick={() => smoothScrollToElement('dateSelect', 80)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg transition"
            >
              Buy Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {movie.casts && movie.casts.length > 0 && (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 mt-12">
          <div className="relative mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Users className="w-6 h-6" /> Cast & Crew
            </h2>
            <div className="absolute -bottom-2 left-0 w-16 h-1 bg-red-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movie.casts.slice(0, 12).map((cast, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition duration-300">
                <img src={cast.profile_path} alt={cast.name} className="w-full h-48 object-cover" />
                <div className="p-2 text-center">
                  <p className="text-white text-sm font-medium truncate">{cast.name}</p>
                  <p className="text-gray-400 text-xs">Actor</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date Select - passes dateTime from MongoDB */}
      <DateSelect dateTime={dateTime} id={id} />

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 mt-16 pb-12">
          <div className="relative mb-6">
            <h2 className="text-2xl font-semibold text-white">You May Also Like</h2>
            <div className="absolute -bottom-2 left-0 w-16 h-1 bg-red-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarMovies.map((m) => (
              <Moviecard key={m._id} movie={m} />
            ))}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {isTrailerOpen && movie.trailer_url && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setIsTrailerOpen(false)}>
          <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsTrailerOpen(false)} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-red-600 rounded-full p-2 transition">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative pb-[56.25%]">
              <iframe
                src={movie.trailer_url}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovieDetails