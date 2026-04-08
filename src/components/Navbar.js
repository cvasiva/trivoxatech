import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../images/trivoxalogo.png';

const portfolioSubMenu = [
  { label: 'UI/UX Design', filter: 'ui-ux-design' },
  { label: 'Frontend Development', filter: 'web-development' },
  { label: 'Digital Marketing', filter: 'digital-marketing' },
  { label: 'Full Stack', filter: 'full-stack' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);
  const portfolioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (portfolioRef.current && !portfolioRef.current.contains(e.target)) {
        setPortfolioOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToForm = () => {
    navigate('/contact');
    setTimeout(() => {
      const el = document.getElementById('contact-form');
      if (el) {
        const offset = 100;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 150);
  };

  const handleBookDemo = () => { setIsOpen(false); scrollToForm(); };
  const handleEnroll = () => { setIsOpen(false); scrollToForm(); };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-20">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Trivoxa logo" className="w-[120px] min-[1020px]:w-[200px]" />
            </Link>
          </div>

          <nav className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-2">
            <NavLink end to="/" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Home</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>About</NavLink>
            <NavLink to="/services" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Services</NavLink>

            {/* Portfolio Dropdown */}
            <div className="relative" ref={portfolioRef}>
              <button
                onClick={() => setPortfolioOpen(!portfolioOpen)}
                className="flex items-center gap-1 text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base"
              >
                Portfolio
                <svg className={`w-3 h-3 transition-transform ${portfolioOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {portfolioOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-2">
                  <NavLink to="/portfolio" onClick={() => setPortfolioOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium border-b border-gray-100 mb-1">
                    All Projects
                  </NavLink>
                  {portfolioSubMenu.map((item) => (
                    <button key={item.filter}
                      onClick={() => { navigate(`/portfolio/${item.filter}`); setPortfolioOpen(false); }}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition">
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/courses" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Courses</NavLink>
            <NavLink to="/blogs" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Blogs</NavLink>
            <NavLink to="/careers" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Careers</NavLink>
            <NavLink to="/contact" className={({isActive}) => isActive ? 'px-3 xl:px-4 py-2 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm xl:text-base' : 'text-gray-700 hover:text-indigo-600 px-3 xl:px-4 py-2 text-sm xl:text-base'}>Contact</NavLink>
          </nav>

          <div className="hidden lg:flex lg:items-center lg:space-x-3 xl:space-x-4">
            <button onClick={handleBookDemo} className="px-3 xl:px-4 py-2 border border-gray-200 rounded text-xs xl:text-sm text-gray-700 hover:bg-gray-50 transition">Book Demo</button>
            <button onClick={handleEnroll} className="px-3 xl:px-4 py-2 bg-indigo-600 text-white rounded text-xs xl:text-sm hover:bg-indigo-700 transition">Enroll</button>
          </div>

          <div className="lg:hidden">
            <button onClick={() => { setIsOpen(!isOpen); if (isOpen) setMobilePortfolioOpen(false); }} className="text-gray-700 focus:outline-none p-2">
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
              <NavLink to="/services" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Services</NavLink>
              {/* Portfolio mobile submenu */}
              <div>
                <div className="flex items-center justify-between">
                  <NavLink
                    to="/portfolio"
                    onClick={() => { setIsOpen(false); setMobilePortfolioOpen(false); }}
                    className={({ isActive }) => isActive ? 'flex-1 px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'flex-1 px-3 py-2 text-sm text-gray-700'}>
                    Portfolio
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => setMobilePortfolioOpen((v) => !v)}
                    className="px-4 py-3 text-gray-500">
                    <svg className={`w-3 h-3 transition-transform ${mobilePortfolioOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {mobilePortfolioOpen && (
                  <div className="ml-3 border-l-2 border-indigo-100">
                    {portfolioSubMenu.map((item) => (
                      <Link
                        key={item.filter}
                        to={`/portfolio/${item.filter}`}
                        onClick={() => { setIsOpen(false); setMobilePortfolioOpen(false); }}
                        className="block px-4 py-3 text-sm text-gray-600 active:bg-indigo-50 active:text-indigo-600">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <NavLink to="/courses" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Courses</NavLink>
              <NavLink to="/blogs" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Blogs</NavLink>
              <NavLink to="/careers" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Careers</NavLink>
              <NavLink to="/contact" className={({isActive}) => isActive ? 'block px-3 py-2 border-l-2 border-indigo-600 text-indigo-600 font-semibold text-sm' : 'block text-gray-700 px-3 py-2 text-sm'} onClick={() => setIsOpen(false)}>Contact</NavLink>
              <div className="pt-2 sm:pt-3 border-t border-gray-100 mt-2 sm:mt-3">
                <button onClick={handleBookDemo} className="block text-gray-700 py-2 px-3 text-sm hover:text-indigo-600">Book Free Demo</button>
                <button onClick={handleEnroll} className="block mt-2 px-3 py-2 bg-indigo-600 text-white rounded text-center text-sm hover:bg-indigo-700 transition">Enroll Now</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
