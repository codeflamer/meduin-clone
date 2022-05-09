import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header className="flex items-center justify-between p-5 max-w-7xl mx-auto">
        <div className='flex items-center space-x-5'>
            <Link href="/">
                <img 
                    className="w-44 object-contain cursor-pointer "
                    src="https://links.papareact.com/yvf" 
                    alt=""/>
            </Link>
            <div className="hidden md:inline-flex space-x-5">
                <h3>About</h3>
                <h3>Contact</h3>
                <h3 className="text-white bg-green-600 px-4 py-1 rounded-full cursor-pointer">Follow</h3>
            </div>
        </div>
        <div className="space-x-5 flex text-green-600 items-center">
            <h3>Sign in</h3>
            <h3 className="border-green-600 border px-4 py-1 rounded-full cursor-pointer">Get Started</h3>
        </div>
    </header>
  )
}

export default Header