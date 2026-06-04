import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './style/home.scss';
import Navbar from '../components/Navbar';
import Allmovie from './movies/Allmovie';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const movies = [
    {
      image: "https://static.wixstatic.com/media/e4c430_290f6e0b1bd74c698a0393514ad073b8~mv2.jpg/v1/fill/w_1920,h_675,al_c/e4c430_290f6e0b1bd74c698a0393514ad073b8~mv2.jpg",
      title: "Neon Cosmos",
      tags: "Sci-Fi • Action • 2026",
      description: "A neon-soaked journey through a rogue cyberpunk galaxy where data is the ultimate currency.",
      link: "https://youtu.be/YDE97KrYDuU?si=uO1OrKeQlhHCctR9"
    },
    {
      image: "https://wallpapers.com/images/hd/1982-blade-runner-poster-harrison-ford-al2adk5j2j4hm9le.jpg",
      title: "Blade Runner: Legacy",
      tags: "Thriller • Cyberpunk • Cinematic",
      description: "Experience the dark, rain-slicked future of Neo-Noir as hidden truths finally unravel.",
      link: "https://youtu.be/P78pl1FUXfA?si=f-kmRz3fc7vc_J23"
    },
    {
      image: "https://images.squarespace-cdn.com/content/v1/5bdc87e4b1059895b40f204d/1541744626410-4JF643P7V9A8HGZST3J2/RUNNER-title-card-WS.jpg",
      title: "The Evil Runner",
      tags: "Horror • Thriller • Suspense",
      description: "Enter a parallel world of psychological chaos and rogue biological cybernetics.",
      link: "https://youtu.be/AQ1hzzWJUYo?si=5Bmd9sAEvoWQ3BRJ"
    },
    {
      image: "https://i.ytimg.com/vi/lpV4oT2G5Ak/maxresdefault.jpg",
      title: "Dune Saga: Part III",
      tags: "Epic • Adventure • Sci-Fi",
      description: "The majestic conflict on the desert planet Arrakis reaches a devastating cosmic climax.",
      link: "https://youtu.be/_KL8ab5f8NE?si=Sa-Tkdu3OPKsIZX8"
    },
    {
      image: "https://i.pinimg.com/webp/1200x/bf/32/c5/bf32c59a2162b3a83c78c2e5dac96446.webp",
      title: "Space Odyssey",
      tags: "Adventure • Mystery • IMAX",
      description: "A visually stunning masterpiece pushing human consciousness past the edge of the universe.",
      link: "https://youtu.be/oR_e9y-bka0?si=FTundG0KdeNg5ymE"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const backdropVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] }
    })
  };

  return (
  <>
    <div className="premium-cinema-container">
      <Navbar/>
      {/* Background Graphic Engine */}
      <div className="backdrop-viewport">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            className="cinema-backdrop"
            style={{ backgroundImage: `url(${movies[currentIndex].image})` }}
            variants={backdropVariants}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>
        <div className="vignette-cinematic-mask" />
      </div>

      {/* Responsive Content Core */}
      <div className="cinema-interface-layer">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            className="glass-card-showcase"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <motion.span className="meta-badge" custom={1} variants={contentVariants}>
              {movies[currentIndex].tags}
            </motion.span>
            
            <motion.h1 className="epic-title" custom={2} variants={contentVariants}>
              {movies[currentIndex].title}
            </motion.h1>
            
            <motion.p className="epic-description" custom={3} variants={contentVariants}>
              {movies[currentIndex].description}
            </motion.p>
            
            <motion.div className="button-action-row" custom={4} variants={contentVariants}>
              <motion.a 
                href={movies[currentIndex].link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary-glow"
                whileTap={{ scale: 0.97 }}
              >
                <Play size={16} fill="currentColor" /> Watch Now
              </motion.a>
              
              <motion.button 
                className="btn-secondary-glass"
                whileTap={{ scale: 0.97 }}
              >
                <Plus size={16} /> Watchlist
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Controls Integrated Into Fluid Flow */}
        <div className="cinema-controls-wrapper">
          <div className="pagination-indicator-dots">
            {movies.map((_, i) => (
              <div 
                key={i} 
                className={`pill-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>

          <div className="arrow-nav-group">
            <button onClick={handlePrev} className="arrow-btn" aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleNext} className="arrow-btn" aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
    <Allmovie/>
  
  </>
  );
};

export default Home;