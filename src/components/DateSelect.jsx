import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import BlurCircle from './BlurCircle'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
const DateSelect = ({ dateTime = {} , id}) => {  
    const navigate=useNavigate()
const [selected,setSelected]=useState(null)

const onBookHandler=()=>{
    if(!selected){
        return toast.error("Please select a date and time")
    }
   navigate(`/movies/${id}/${selected}`)
   scrollTo(0,0)
}

  if (!dateTime || Object.keys(dateTime).length === 0) {
    return (
      <div id='dateSelect' className='pt-30'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>
          <BlurCircle top='-100px' left='-100px'/>
          <BlurCircle top='100px' right='0'/>
          <div>
            <p className="text-lg font-semibold">Choose Date</p>
            <div className='flex items-center gap-6 text-sm mt-5'>
              <p className="text-gray-400">No dates available</p>
            </div>
          </div>
          <button className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>
            Book Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div id='dateSelect' className='pt-30'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>
        <BlurCircle top='-100px' left='-100px'/>
        <BlurCircle top='100px' right='0'/>
        
        <div>
          <p className="text-lg font-semibold">Choose Date</p>
          <div className='flex items-center gap-6 text-sm mt-5'>
            <button className="hover:bg-primary/20 p-1 rounded-full transition">
              <ChevronLeftIcon width={28} />
            </button>
            
            <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
              {Object.keys(dateTime).map((date) => (
                <button 
                onClick={()=>{setSelected(date)}}
                  key={date} 
                  className={`px-4 py-2 bg-primary/20 rounded-lg cursor-pointer
                    transition-colors 
                   duration-300 text-left min-w-17.5 ${selected === date ? 'bg-red-300 text-white' : 'border border-primary/70'}`}>
                  <div className="font-bold">{new Date(date).getDate()}</div>
                  <div className="text-xs">{new Date(date).toLocaleDateString("en-US", { month: "short" })}</div>
                </button>
              ))}
            </span>
            
            <button className="hover:bg-primary/20 p-1 rounded-full transition">
              <ChevronRightIcon width={28} />
            </button>
          </div>
        </div>
        
        <button 
        onClick={onBookHandler}
        className='bg-primary text-white px-8 py-2 rounded hover:bg-primary/90 transition-all cursor-pointer'>
          Book Now
        </button>
      </div>
    </div>
  )
}

export default DateSelect