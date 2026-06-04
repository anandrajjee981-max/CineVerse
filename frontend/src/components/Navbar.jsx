import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Tv, Clapperboard, Trophy, Flame, LayoutGrid, User, Menu, X } from 'lucide-react';
import '../features/style/navbar.scss';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  const navItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'Search', icon: <Search size={20} /> },
    { name: 'TV', icon: <Tv size={20} /> },
    { name: 'Movies', icon: <Clapperboard size={20} /> },
    { name: 'Anime', icon: <Trophy size={20} /> },
    { name: 'Sparks', icon: <Flame size={20} /> },
    { name: 'Categories', icon: <LayoutGrid size={20} /> },
    { name: 'My Space', icon: <User size={20} /> },
  ];

  return (
    <>
      {/* --- DESKTOP HOTSTAR SIDEBAR --- */}
      <motion.nav 
        className={`hotstar-sidebar ${isHovered ? 'sidebar-expanded' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 240 : 80 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="brand-logo-container">
          <svg className="star-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
        </div>

        <div className="nav-links-wrapper">
          {navItems.map((item) => (
            <div
              key={item.name}
              className={`nav-item-link ${activeItem === item.name ? 'is-active' : ''}`}
              onClick={() => setActiveItem(item.name)}
            >
              <div className="icon-box">{item.icon}</div>
              <motion.span 
                className="nav-label-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.span>
            </div>
          ))}
        </div>
      </motion.nav>

      {/* --- MOBILE TOP GLASS HEADER & DROPDOWN --- */}
      <header className="mobile-premium-header">
        <div className="mobile-brand">
          <svg className="star-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
          <span className="brand-title">CineSpace</span>
        </div>

        {/* Hamburger Trigger */}
        <button 
          className="mobile-menu-trigger"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Smooth Micro-Dropdown Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div 
              className="mobile-dropdown-menu"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="dropdown-grid">
                {navItems.map((item) => (
                  <div
                    key={item.name}
                    className={`dropdown-item ${activeItem === item.name ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveItem(item.name);
                      setIsMobileOpen(false); // Action complete close
                    }}
                  >
                    <div className="dropdown-icon">{item.icon}</div>
                    <span className="dropdown-label">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;