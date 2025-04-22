import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-primary text-2xl font-bold">
              Bite<span className="text-accent">on</span>Wheels
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-supportive hover:text-primary transition-colors">Home</Link>
            <Link to="/restaurants" className="text-supportive hover:text-primary transition-colors">Restaurants</Link>
            <Link to="/cart" className="text-supportive hover:text-primary transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={toggleDropdown} className="text-2xl text-supportive focus:outline-none">
                  <FaUserCircle />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-supportive hover:bg-gray-100">Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-supportive hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-supportive hover:text-primary">Login</Link>
                <Link to="/register" className="text-supportive hover:text-primary">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-supportive focus:outline-none"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pb-3">
              <Link to="/" className="text-supportive hover:text-primary" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/restaurants" className="text-supportive hover:text-primary" onClick={() => setIsMenuOpen(false)}>Restaurants</Link>
              <Link to="/cart" className="text-supportive hover:text-primary flex items-center" onClick={() => setIsMenuOpen(false)}>
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="ml-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-supportive hover:text-primary" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left text-supportive hover:text-primary">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-supportive hover:text-primary" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="text-supportive hover:text-primary" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
