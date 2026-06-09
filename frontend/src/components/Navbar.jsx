import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom'; // 🔥 Imported useLocation
import { Home, Search, Tv, Clapperboard, Trophy, Flame, LayoutGrid, User, Menu, X } from 'lucide-react';
import '../features/style/navbar.scss';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Home'); // Default fallback
  
  const navigate = useNavigate();
  const location = useLocation(); // 🔥 Get current URL location instance

  const navItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/home' },
    { name: 'Search', icon: <Search size={20} />, path: '/search' },

    { name: 'Sparks', icon: <Flame size={20} />, path: '/sparks' },
    { name: 'Categories', icon: <LayoutGrid size={20} />, path: '/category', defaultFilter: 'all' },
    { name: 'My Space', icon: <User size={20} />, path: '/save' },
  ];

  //  URL Route Change Detector Effect
  useEffect(() => {
    const currentPath = location.pathname;
    const currentState = location.state;

    
    const matchedItem = navItems.find((item) => {
      if (item.path === currentPath) {
      
        if (currentPath === '/category' && item.defaultFilter) {
          return currentState?.filter === item.defaultFilter;
        }
        return true;
      }
      return false;
    });

    if (matchedItem) {
      setActiveItem(matchedItem.name);
    }
  }, [location]); 


  const handleNavigation = (item) => {
    setIsMobileOpen(false); // Close mobile menu

    if (item.path) {
      if (item.defaultFilter) {
        navigate(item.path, { state: { filter: item.defaultFilter } });
      } else {
        navigate(item.path);
      }
    }
  };

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
        <div className="brand-logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <svg className="star-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
        </div>

        <div className="nav-links-wrapper">
          {navItems.map((item) => (
            <div
              key={item.name}
              className={`nav-item-link ${activeItem === item.name ? 'is-active' : ''}`}
              onClick={() => handleNavigation(item)}
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
        <div className="mobile-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <svg className="star-logo" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
          </svg>
          <span className="brand-title">CineVerse</span>
        </div>

        <button 
          className="mobile-menu-trigger"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

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
                    onClick={() => handleNavigation(item)}
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