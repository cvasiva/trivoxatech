import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../images/trivoxalogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 2xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-24">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Trivoxa logo" className="h-14 sm:h-14 md:h-16 lg:h-20 w-auto" />
            </Link>
          </div>

          <nav className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-2">
            <NavLink end to="/" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Home</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>About</NavLink>
            <NavLink to="/courses" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Courses</NavLink>
            <NavLink to="/services" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Services</NavLink>
            <NavLink to="/blogs" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Blogs</NavLink>
            <NavLink to="/careers" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Careers</NavLink>
            <NavLink to="/portfolio" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Portfolio</NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Contact</NavLink>
          </nav>

          <div className="hidden lg:flex lg:items-center lg:space-x-3 xl:space-x-4">
            <Link to="/book-demo" className="px-3 xl:px-4 py-2 border border-gray-200 rounded text-xs xl:text-sm text-gray-700 hover:bg-gray-50 transition">Book Demo</Link>
            <Link to="/enroll" className="px-3 xl:px-4 py-2 bg-indigo-600 text-white rounded text-xs xl:text-sm hover:bg-indigo-700 transition">Enroll</Link>
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none p-2">
              <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-3 sm:pb-4 border-t border-gray-100">
            <div className="space-y-1 sm:space-y-2">
              <NavLink end to="/" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Home</NavLink>
              <NavLink to="/about" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>About</NavLink>
              <NavLink to="/courses" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Courses</NavLink>
              <NavLink to="/services" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Services</NavLink>
              <NavLink to="/blogs" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Blogs</NavLink>
              <NavLink to="/careers" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Careers</NavLink>
              <NavLink to="/portfolio" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Portfolio</NavLink>
              <NavLink to="/contact" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Contact</NavLink>
              <div className="pt-2 sm:pt-3 border-t border-gray-100 mt-2 sm:mt-3">
                <Link to="/book-demo" className="block text-gray-700 py-2 px-3 text-sm hover:text-indigo-600" onClick={() => setIsOpen(false)}>Book Free Demo</Link>
                <Link to="/enroll" className="block mt-2 px-3 py-2 bg-indigo-600 text-white rounded text-center text-sm hover:bg-indigo-700 transition" onClick={() => setIsOpen(false)}>Enroll Now</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
