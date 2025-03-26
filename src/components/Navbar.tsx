import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';

interface NavbarProps {
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Key Generation', path: '/key-generation' },
    { name: 'Encryption', path: '/encryption' },
    { name: 'Decryption', path: '/decryption' },
    { name: 'Meet The Team', path: '/team' },
    { name: isLoggedIn ? 'My Account' : 'Sign Up/In', path: isLoggedIn ? '/account' : '/auth' },
  ];

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/20 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:opacity-90 transition-opacity duration-200"
          >
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">RSA Shield</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-md text-white/80 transition-all duration-200 relative
                  after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 
                  after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300
                  hover:text-white hover:bg-white/10 hover:after:scale-x-100 hover:after:origin-bottom-left
                  ${location.pathname === link.path ? 'text-white bg-white/10 after:scale-x-100' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-white/5 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="glass-panel rounded-b-2xl py-2 mt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-200 ${
                    location.pathname === link.path ? 'text-white bg-white/5' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
