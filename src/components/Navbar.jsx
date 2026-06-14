import { Link , useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import {useUser,useClerk, UserButton} from '@clerk/clerk-react'
const Navbar = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
const {user}=useUser();
const {openSignIn}=useClerk();
const TestButton = () => {
  const { getToken } = useAuth()

  const testApi = async () => {
    const token = await getToken()
    const res = await fetch('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    console.log(data)
  }

  return <button onClick={testApi}>Test API</button>
}

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
     
      <Link className='max-md:flex-1' to="/">
        <img src={assets.logo} alt="" className="w-36 h-auto" />
      </Link>
      
      <div className={`
        max-md:absolute max-md:top-0 max-md:left-0
        max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 
        max-md:h-screen max-md:w-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 rounded-4xl
        overflow-hidden transition-all duration-300
        ${isMenuOpen ? 'max-md:flex' : 'max-md:hidden'}
        md:flex
      `}>
        <XIcon 
          onClick={() => setIsMenuOpen(false)}
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer "
        />
        <Link onClick={() => setIsMenuOpen(false)} to="/">Home</Link>
        <Link onClick={() => setIsMenuOpen(false)} to="/movies">Movies</Link>
        <Link onClick={() => setIsMenuOpen(false)} to="/favourites">Favourites</Link>
      </div>

      <div className='flex items-center gap-8'>
        <SearchIcon className="hidden md:inline-block w-6 h-6 mr-4 cursor-pointer"/>
        {
          !user ? (
        <button onClick={openSignIn} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-4xl">Login</button>
          ):(
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15}/>} onClick={()=>{
                  navigate('/my-bookings');
                }}/>
              </UserButton.MenuItems>
            </UserButton>
          )
        }
      </div>
      
      <MenuIcon 
        onClick={() => setIsMenuOpen(true)}
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
      />
    </div>
  )
}

export default Navbar