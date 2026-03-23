import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/trivoxalogo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 2xl:px-16 py-8 sm:py-10 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div>
            <div className="mb-4 sm:mb-5 md:mb-6">
              <img src={logo} alt="Trivoxa logo" className="h-16 sm:h-20 md:h-24 w-auto object-contain" />
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">Building talent and products for the future of technology.</p>
            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-5">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition text-xs sm:text-sm font-medium">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition text-xs sm:text-sm font-medium">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition text-xs sm:text-sm font-medium">Facebook</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-5 text-sm md:text-base">Courses</h4>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 text-xs sm:text-sm">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition">Full Stack Web</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition">Product Design</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition">Digital Marketing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition">Cloud & DevOps</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-5 text-sm md:text-base">Company</h4>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 text-xs sm:text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-indigo-400 transition">About Us</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-indigo-400 transition">Services</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition">Blog</a></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 sm:mb-4 md:mb-5 text-sm md:text-base">Stay Updated</h4>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 md:mb-5 leading-relaxed">Subscribe to our newsletter for latest updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 border border-gray-700 bg-gray-800 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button className="bg-indigo-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-indigo-700 transition text-xs sm:text-sm font-medium whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8 md:pt-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Trivoxa Technologies. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-indigo-400 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
