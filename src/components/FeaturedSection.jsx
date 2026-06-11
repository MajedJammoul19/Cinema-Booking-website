import { useState } from 'react'
import { ArrowRightIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import Moviecard from './Moviecard'
import { dummyShowsData } from '../assets/assets'

const FeaturedSection = () => {
    const navigate = useNavigate();
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    
    // Calculate pagination
    const totalPages = Math.ceil(dummyShowsData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMovies = dummyShowsData.slice(startIndex, endIndex);
    
    // Handle page change
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    
    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
            <div className='relative flex items-center justify-between pt-20 pb-10'>
                <BlurCircle top='0' right='-80px'/>
                <p className='text-gray-300 font-medium text-lg'>Now Showing</p>
                <button onClick={()=>{navigate('/movies')}} className="group flex items-center gap-2 text-sm text-gray-300">
                    View All 
                    <ArrowRightIcon className="group-hover:translate-x-0.5 transition w-4.5 h-4.5" /> 
                </button>
            </div>
            
            {/* Movie Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentMovies.map((movie, index) => (
                    <Moviecard 
                        key={movie._id} 
                        movie={movie}
                        variant={index === 0 ? 'featured' : 'default'}
                    />
                ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center gap-2 ${
                            currentPage === 1
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white'
                        }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>
                    
                    <span className="text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-6 py-2 rounded-lg font-medium transition duration-300 flex items-center gap-2 ${
                            currentPage === totalPages
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-gray-800 text-gray-300 hover:bg-red-600 hover:text-white'
                        }`}
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
            
            {/* Page Info */}
            <div className="text-center mt-4 text-gray-500 text-sm">
                Showing {startIndex + 1} - {Math.min(endIndex, dummyShowsData.length)} of {dummyShowsData.length} movies
            </div>
        </div>
    )
}

export default FeaturedSection; 