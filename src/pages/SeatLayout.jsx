import  { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { dummyShowsData, dummyDateTimeData, assets } from '../assets/assets'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]
  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [movie, setMovie] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Find the movie by id
    const foundMovie = dummyShowsData.find(movie => movie._id === id)
    setMovie(foundMovie)
  }, [id])

  // Get available timings for the selected date
  const availableTimings = dummyDateTimeData[date] || []

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast.error("Please select a time first")
    }
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(seat => seat !== seatId))
    } else {
      if (selectedSeats.length >= 5) {
        return toast.error("You can only select up to 5 seats")
      }
      setSelectedSeats(prev => [...prev, seatId])
    }
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className='flex gap-2 mt-2'>
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`
          return (
            <button 
              key={seatId} 
              onClick={() => handleSeatClick(seatId)}
              className={`w-8 h-8 text-xs rounded bg-primary/20 border border-primary/50 transition-colors ${
                selectedSeats.includes(seatId) ? 'bg-red-500 text-white' : 'hover:bg-primary/30'
              }`}
            >
              {seatId}
            </button>
          )
        })}
      </div>
    </div>
  )

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      return toast.error("Please select at least one seat")
    }
    if (!selectedTime) {
      return toast.error("Please select a time")
    }

    setIsProcessing(true)

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{"name": "Guest User", "email": "guest@example.com"}')
    
    // Create new booking object
    const newBooking = {
      _id: Date.now().toString(),
      bookingId: `BK${Date.now()}`,
      user: { 
        name: currentUser.name,
        email: currentUser.email,
        userId: currentUser.userId || 'guest'
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        poster_path: movie.poster_path,
        runtime: movie.runtime,
      },
      show: {
        date: date,
        time: selectedTime.time,
        formattedTime: new Date(selectedTime.time).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        showId: selectedTime.showId
      },
      amount: selectedSeats.length * 12,
      bookedSeats: selectedSeats,
      isPaid: true,
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    }

    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]')
    
    // Add new booking
    existingBookings.push(newBooking)
    
    // Save back to localStorage
    localStorage.setItem('userBookings', JSON.stringify(existingBookings))
    
    toast.success(`Booking confirmed! ${selectedSeats.length} seat(s) booked.`)
    setIsProcessing(false)
    
    // Navigate to my-bookings after short delay
    setTimeout(() => {
      navigate('/my-bookings')
    }, 1500)
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-gray-900 to-black">
        <div className="text-center">
          <div className="text-4xl mb-4">🎬</div>
          <p className="text-white">Loading show details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black">
      <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:py-20">
        {/* available timings */}
        <div className="w-64 bg-primary/10 border border-primary/20 rounded-lg py-6 h-max md:sticky md:top-30">
          <p className="px-4 font-semibold text-white mb-2">Available Timings</p>
          <p className="px-4 text-xs text-gray-400 mb-4">
            {new Date(date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="mt-2">
            {availableTimings.length > 0 ? (
              availableTimings.map((item) => (
                <div 
                  key={item.time}
                  onClick={() => setSelectedTime(item)}
                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg cursor-pointer transition ${
                    selectedTime?.time === item.time 
                      ? 'bg-red-500 text-white shadow-lg' 
                      : 'hover:bg-primary/20 text-gray-300'
                  }`}
                >
                  <ClockIcon className="w-4 h-4" />
                  <p className="text-sm font-medium">
                    {new Date(item.time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm px-4">No timings available for this date</p>
            )}
          </div>
        </div>
        
        <div className="relative flex-1 flex flex-col items-center max-md:mt-10">
          <BlurCircle top='-100px' left='-100px' />
          <BlurCircle top='100px' right='0' />
          
          <h1 className="text-2xl font-bold text-white mb-4">Select Your Seats</h1>
          <p className="text-gray-400 text-sm mb-2">Screen Side</p>
          <img src={assets.screenImage} alt="screen" className="w-full max-w-2xl mb-2" />
          
          <div className='flex flex-col items-center mt-6 text-xs text-gray-300'>
            {/* First row group - A and B */}
            <div className='grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-3 mb-6'>
              {groupRows[0].map((row) => (
                <div key={row}>
                  {renderSeats(row)}
                </div>
              ))}
            </div>
            
            {/* Remaining row groups - C to J */}
            <div className='grid grid-cols-2 gap-8'>
              {groupRows.slice(1).map((group, groupIdx) => (
                <div key={`group-${groupIdx}`}>
                  {group.map((row) => (
                    <div key={row}>
                      {renderSeats(row)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
         
          {/* Booking Summary */}
          <div className="mt-8 p-4 bg-primary/10 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Selected Seats:</span>
              <span className="text-white font-semibold">
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Ticket Price:</span>
              <span className="text-white">$12.00</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-primary/30">
              <span className="text-white font-semibold">Total Amount:</span>
              <span className="text-red-500 font-bold text-lg">${(selectedSeats.length * 12).toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isProcessing || selectedSeats.length === 0}
            className={`flex items-center gap-2 mt-6 px-8 py-3 text-sm rounded-full font-medium cursor-pointer transition ${
              isProcessing || selectedSeats.length === 0
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-red-500 hover:bg-red-600 active:scale-95'
            } text-white`}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                Proceed to Checkout 
                <ArrowRightIcon strokeWidth={3} className='w-4 h-4'/>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SeatLayout