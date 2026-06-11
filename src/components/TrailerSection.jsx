import { useState } from 'react'
import { Play, X } from 'lucide-react'
import { dummyTrailers } from '../assets/assets'

const TrailerSection = ({ title = "Movie Trailers", trailers = dummyTrailers, limit = 5 }) => {
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Get YouTube video ID from URL
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    
    // Handle trailer click
    const handleTrailerClick = (trailer) => {
        setSelectedTrailer(trailer);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTrailer(null);
    };
    
    // Limit the number of trailers shown
    const displayedTrailers = trailers.slice(0, limit);
    const mainTrailer = displayedTrailers[0];
    const otherTrailers = displayedTrailers.slice(1);
    
    if (!trailers || trailers.length === 0) {
        return null;
    }
    
    return (
        <>
            <div className="mt-20">
                {/* Header */}
                <div className='relative flex items-center justify-between pb-10'>
                    <div className='relative'>
                        <p className='text-gray-300 font-medium text-lg'>{title}</p>
                        <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-500 rounded-full"></div>
                    </div>
                
                </div>
                
                {/* Main Trailer */}
                {mainTrailer && (
                    <div className="mb-8">
                        <div 
                            onClick={() => handleTrailerClick(mainTrailer)}
                            className="relative group cursor-pointer rounded-xl overflow-hidden shadow-2xl"
                        >
                            <img 
                                src={mainTrailer.image} 
                                alt="Main trailer thumbnail"
                                className="w-full h-100 md:h-112.5 object-cover group-hover:scale-105 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition duration-300 flex items-center justify-center">
                                <div className="bg-red-600 rounded-full p-4 md:p-6 group-hover:scale-110 transition duration-300 shadow-xl">
                                    <Play className="w-8 h-8 md:w-12 md:h-12 text-white fill-white ml-0.5" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                                <h3 className="text-white text-xl md:text-2xl font-bold mb-2">Watch Latest Trailer</h3>
                                <p className="text-gray-300 text-sm md:text-base">Click to play the official trailer</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Small Trailers Grid */}
                {otherTrailers.length > 0 && (
                    <div>
                        <h4 className="text-gray-400 text-sm font-medium mb-3">More Trailers</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            {otherTrailers.map((trailer, index) => (
                                <div 
                                    key={index}
                                    onClick={() => handleTrailerClick(trailer)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative rounded-lg overflow-hidden bg-gray-900">
                                        <img 
                                            src={trailer.image} 
                                            alt={`Trailer ${index + 2}`}
                                            className="w-full h-28 sm:h-32 md:h-36 object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                            <div className="bg-red-600 rounded-full p-2 group-hover:scale-110 transition duration-300">
                                                <Play className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-gray-400 text-xs text-center group-hover:text-white transition">
                                            Watch Trailer
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Video Modal */}
            {isModalOpen && selectedTrailer && (
                <div 
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div 
                        className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-red-600 rounded-full p-2 transition duration-300"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </button>
                        
                        {/* Video Player */}
                        <div className="relative pb-[56.25%]">
                            <iframe
                                src={`https://www.youtube.com/embed/${getYouTubeId(selectedTrailer.videoUrl)}?autoplay=1&rel=0&modestbranding=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full"
                            ></iframe>
                        </div>
                        
                        {/* Video Info */}
                        <div className="p-4 bg-gray-900">
                            <h3 className="text-white font-semibold">Official Trailer</h3>
                            <p className="text-gray-400 text-sm mt-1">Watch in full screen for the best experience</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TrailerSection;