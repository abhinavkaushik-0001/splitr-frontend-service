import React from 'react'
import { Link } from 'react-router'
import logo from '../../assets/images/logo.png'
function Header() {
  return (
    <div className="fixed left-0 top-0 w-full border-b border-gray-200 bg-white/95 backdrop-blur z-50 supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <nav className=' w-full flex justify-between'>
          <img src={logo} className="h-11 w-auto object-contain" />
          <div className="hidden md:flex items-center gap-6">
            <span className="text-lg font-medium hover:text-green-600 transition">Features</span>
            <span className="text-lg font-medium hover:text-green-600 transition">How It Works</span>
          </div>
          <div className='flex items-center'>
            <span className='text-lg font-medium'>Sign In</span>
          </div>
        </nav>

      </div>
    </div>
  )
}

export default Header