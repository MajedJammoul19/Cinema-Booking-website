import { Calendar, Clock, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat' // Adjust the import path

const Moviecard = ({ movie, variant = 'default' }) => {
    const navigate = useNavigate();
    
    const handleViewDetails = () => {
        navigate(`/movies/${movie._id}`);
    };
    
    const handleBookTickets = () => {
        navigate(`/movies/${movie._id}`);
    };
    
    return (
        <div className={`group relative bg-linear-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
            variant === 'featured' ? 'ring-2 ring-red-500' : ''
        }`}>
            {/* Poster Section */}
            <div className="relative group/image cursor-pointer overflow-hidden">
                <img 
                    src={movie.poster_path} 
                    alt={movie.title}
                    className="w-full h-72 object-cover group-hover/image:scale-110 transition duration-500"
                    loading="lazy"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button 
                        onClick={handleViewDetails}
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-4 py-2 rounded-lg transform -translate-y-2 group-hover/image:translate-y-0 transition-all duration-300"
                    >
                        View Details
                    </button>
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-semibold">
                        {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                </div>
                
                {/* Tagline (if available) */}
                {movie.tagline && (
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-3">
                        <p className="text-white text-xs italic line-clamp-1">
                            "{movie.tagline}"
                        </p>
                    </div>
                )}
            </div>
            
            {/* Movie Info Section */}
            <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-1" title={movie.title}>
                    {movie.title}
                </h3>
                
                {/* Movie Meta Info */}
                <div className="flex items-center gap-3 text-gray-400 text-sm mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{timeFormat(movie.runtime)}</span>
                    </div>
                </div>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {movie.genres?.slice(0, 3).map((genre) => (
                        <span 
                            key={genre.id}
                            className="text-xs text-gray-300 bg-gray-800 px-2 py-1 rounded-full"
                        >
                            {genre.name}
                        </span>
                    ))}
                    {movie.genres?.length > 3 && (
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                            +{movie.genres.length - 3}
                        </span>
                    )}
                </div>
                
                {/* Overview */}
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                    {movie.overview || 'No description available.'}
                </p>
            
                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button 
                        onClick={handleBookTickets}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-300"
                    >
                        Book Tickets
                    </button>
                    <button 
                        onClick={handleViewDetails}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-300"
                        title="View Details"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Featured Badge (Optional) */}
            {variant === 'featured' && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                    FEATURED
                </div>
            )}
        </div>
    )
}

export default Moviecard