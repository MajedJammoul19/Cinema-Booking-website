import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useApi } from '../hooks/useApi'
import { useUser } from '@clerk/clerk-react'

const SeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]
  const { id, date } = useParams()
  const navigate = useNavigate()
  const { authFetch, publicFetch } = useApi()
  const { user } = useUser()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [movie, setMovie] = useState(null)
  const [availableTimings, setAvailableTimings] = useState([])
  const [bookedSeats, setBookedSeats] = useState([]) // seats already taken
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch movie + showtimes for this date
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, timingsRes] = await Promise.all([
          publicFetch(`/api/movies/${id}`),
          publicFetch(`/api/movies/${id}/showtimes/${date}`),
        ])
        const movieData = await movieRes.json()
        const timingsData = await timingsRes.json()

        if (movieData.success) setMovie(movieData.movie)
        if (timingsData.success) setAvailableTimings(timingsData.timings)
      } catch (error) {
        console.error('Failed to fetch movie data:', error)
      }
    }
    fetchData()
  }, [id, date])

  // When user selects a time, fetch already booked seats for that show
  useEffect(() => {
    if (!selectedTime) return
    const fetchBookedSeats = async () => {
      try {
        const res = await publicFetch(
          `/api/bookings/${id}/booked-seats?date=${date}&time=${encodeURIComponent(selectedTime.time)}`
        )
        const data = await res.json()
        if (data.success) setBookedSeats(data.bookedSeats)
      } catch (error) {
        console.error('Failed to fetch booked seats:', error)
      }
    }
    fetchBookedSeats()
    setSelectedSeats([]) // reset seat selection on time change
  }, [selectedTime])

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast.error('Please select a time first')
    if (bookedSeats.includes(seatId)) return toast.error('This seat is already booked')

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId))
    } else {
      if (selectedSeats.length >= 5) return toast.error('You can only select up to 5 seats')
      setSelectedSeats(prev => [...prev, seatId])
    }
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className='flex gap-2 mt-2'>
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`
          const isBooked = bookedSeats.includes(seatId)
          const isSelected = selectedSeats.includes(seatId)
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              disabled={isBooked}
              className={`w-8 h-8 text-xs rounded border transition-colors ${
                isBooked
                  ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                  : isSelected
                  ? 'bg-red-500 border-red-400 text-white'
                  : 'bg-primary/20 border-primary/50 hover:bg-primary/30'
              }`}
            >
              {seatId}
            </button>
          )
        })}
      </div>
    </div>
  )

  const handleCheckout = async () => {
    if (!user) return toast.error('Please login to book tickets')
    if (selectedSeats.length === 0) return toast.error('Please select at least one seat')
    if (!selectedTime) return toast.error('Please select a time')

    setIsProcessing(true)
    try {
      const res = await authFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          movieId: id,
          show: {
            date,
            time: selectedTime.time,
            formattedTime: new Date(selectedTime.time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            showId: selectedTime.showId,
          },
          bookedSeats: selectedSeats,
          amount: selectedSeats.length * 12,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        // Handle seat conflict (409)
        return toast.error(data.message || 'Booking failed')
      }

      toast.success(`Booking confirmed! ${selectedSeats.length} seat(s) booked.`)
      setTimeout(() => navigate('/my-bookings'), 1500)
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Checkout error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-gray-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-white mt-4">Loading show details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black">
      <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:py-20">

        {/* Available timings */}
        <div className="w-64 bg-primary/10 border border-primary/20 rounded-lg py-6 h-max md:sticky md:top-30">
          <p className="px-4 font-semibold text-white mb-2">Available Timings</p>
          <p className="px-4 text-xs text-gray-400 mb-4">
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
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
                    {new Date(item.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm px-4">No timings available</p>
            )}
          </div>
        </div>

        {/* Seat map */}
        <div className="relative flex-1 flex flex-col items-center max-md:mt-10">
          <BlurCircle top='-100px' left='-100px' />
          <BlurCircle top='100px' right='0' />

          <h1 className="text-2xl font-bold text-white mb-4">Select Your Seats</h1>
          <p className="text-gray-400 text-sm mb-2">Screen Side</p>
          <img src={assets.screenImage} alt="screen" className="w-full max-w-2xl mb-2" />

          {/* Seat legend */}
          <div className="flex items-center gap-6 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-primary/20 border border-primary/50 inline-block"></span> Available</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-red-500 inline-block"></span> Selected</span>
            <span className="flex items-center gap-1"><span className="w-4 h-4 rounded bg-gray-700 inline-block"></span> Booked</span>
          </div>

          <div className='flex flex-col items-center mt-2 text-xs text-gray-300'>
            <div className='grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-3 mb-6'>
              {groupRows[0].map((row) => <div key={row}>{renderSeats(row)}</div>)}
            </div>
            <div className='grid grid-cols-2 gap-8'>
              {groupRows.slice(1).map((group, idx) => (
                <div key={idx}>
                  {group.map((row) => <div key={row}>{renderSeats(row)}</div>)}
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
            {isProcessing ? 'Processing...' : <> Proceed to Checkout <ArrowRightIcon strokeWidth={3} className='w-4 h-4' /> </>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SeatLayout