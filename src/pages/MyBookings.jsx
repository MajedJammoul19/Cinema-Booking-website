import  { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Ticket, Eye, X, Trash2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBookings = () => {
      setIsLoading(true)
      const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]')
      userBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
      setBookings(userBookings)
      setIsLoading(false)
    }
    
    loadBookings()
    
    window.addEventListener('storage', loadBookings)
    return () => window.removeEventListener('storage', loadBookings)
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatBookingDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedBooking(null)
  }

  const cancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const updatedBookings = bookings.filter(booking => booking._id !== bookingId)
      setBookings(updatedBookings)
      localStorage.setItem('userBookings', JSON.stringify(updatedBookings))
      toast.success('Booking cancelled successfully')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-900 to-black px-6 md:px-16 lg:px-24 xl:px-44 py-20">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-2xl font-semibold text-white mb-2">No Bookings Found</h2>
          <p className="text-gray-400 mb-6">You haven't booked any tickets yet</p>
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
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black px-6 md:px-16 lg:px-24 xl:px-44 py-20">
      {/* Header */}
      <div className="relative mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Bookings</h1>
        <p className="text-gray-400">View and manage your booked tickets</p>
        <div className="absolute -bottom-3 left-0 w-20 h-1 bg-red-500 rounded-full"></div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div 
            key={booking._id}
            className="bg-gray-800/50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-700"
          >
            <div className="flex flex-col md:flex-row">
              {/* Movie Poster */}
              <div className="md:w-48 h-48 md:h-auto">
                <img 
                  src={booking.movie.poster_path} 
                  alt={booking.movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Booking Details */}
              <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2">{booking.movie.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(booking.show.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{booking.show.formattedTime || formatTime(booking.show.time)}</span>
                      </div>
                    </div>
                    
                    {/* Seats */}
                    <div className="flex items-center gap-2 mb-3">
                      <Ticket className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-wrap gap-2">
                        {booking.bookedSeats.map((seat, idx) => (
                          <span 
                            key={idx}
                            className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price and Status */}
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-gray-500 text-xs">Total Amount</p>
                        <p className="text-white font-semibold">${booking.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Booking Date</p>
                        <p className="text-gray-400 text-sm">{formatBookingDate(booking.bookingDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Status</p>
                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                          booking.isPaid 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          <CheckCircle className="w-3 h-3" />
                          {booking.isPaid ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button 
                      onClick={() => viewBookingDetails(booking)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                    <button 
                      onClick={() => cancelBooking(booking._id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Booking Stats */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold text-white">{bookings.length}</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">Total Spent</p>
          <p className="text-2xl font-bold text-white">
            ${bookings.reduce((total, booking) => total + booking.amount, 0)}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-sm">Total Tickets</p>
          <p className="text-2xl font-bold text-white">
            {bookings.reduce((total, booking) => total + booking.bookedSeats.length, 0)}
          </p>
        </div>
      </div>
      
      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Booking Details</h2>
              
              <div className="space-y-4">
                {/* Movie Info */}
                <div className="flex gap-4">
                  <img 
                    src={selectedBooking.movie.poster_path} 
                    alt={selectedBooking.movie.title}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedBooking.movie.title}</h3>
                    <p className="text-gray-500 text-xs mt-2">Booking ID: {selectedBooking.bookingId}</p>
                  </div>
                </div>
                
                {/* Show Information */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-semibold mb-2">Show Information</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      <span className="inline-block w-24">Date:</span>
                      <span className="text-white">{formatDate(selectedBooking.show.date)}</span>
                    </p>
                    <p className="text-gray-400">
                      <span className="inline-block w-24">Time:</span>
                      <span className="text-white">{selectedBooking.show.formattedTime || formatTime(selectedBooking.show.time)}</span>
                    </p>
                    <p className="text-gray-400">
                      <span className="inline-block w-24">Duration:</span>
                      <span className="text-white">{selectedBooking.movie.runtime} min</span>
                    </p>
                  </div>
                </div>
                
                {/* Seat Details */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-semibold mb-2">Seat Details</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.bookedSeats.map((seat, idx) => (
                      <span key={idx} className="bg-red-500/20 text-red-400 px-3 py-1 rounded text-sm font-medium">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Payment Summary */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-semibold mb-2">Payment Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ticket Price:</span>
                      <span className="text-white">$12.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Number of Tickets:</span>
                      <span className="text-white">{selectedBooking.bookedSeats.length}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-700">
                      <span className="text-white font-semibold">Total Amount:</span>
                      <span className="text-red-500 font-bold text-lg">${selectedBooking.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={selectedBooking.isPaid ? 'text-green-400' : 'text-yellow-400'}>
                        {selectedBooking.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    closeModal()
                    navigate(`/movies/${selectedBooking.movie._id}`)
                  }}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  Book More Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings