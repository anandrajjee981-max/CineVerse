import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import './style/home.scss';
import Navbar from '../components/Navbar';
import Allmovie from './movies/Allmovie';
import History from './history/History';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const movies = [
    {
      image: "https://img10.hotstar.com/image/upload/f_auto,q_auto/sources/r1/cms/prod/6970/1778334026970-i",
      title: "vaazba",
      tags: "Comedy • Action • 2026",
      description: "Four friends labeled as losers and troublemakers embark on an emotional journey of self-discovery as they face mounting social pressure. They learn to embrace their responsibilities and find success on their own terms",
      link: "https://youtu.be/USxwrVBOMPM?si=KAUnGtqBaSqyeIfH"
    },
    {
      image: "https://img10.hotstar.com/image/upload/f_auto,q_auto/sources/r1/cms/prod/1400/1779172341400-i",
      title: "hoppers",
      tags: "Thriller • Cyberpunk • Cinematic",
      description: "A 19-year-old animal lover uses technology that places her consciousness into a robotic beaver to uncover mysteries within the animal world beyond her imagination",
      link: "https://youtu.be/hJnAHzo4-KI?si=ssjUUobIT9YwCUnq"
    },
    {
      image: "https://m.media-amazon.com/images/M/MV5BYjg4MDkyYzgtMWM3NS00Mzg4LThmNTctZjc0MzhlNGM0ODIwXkEyXkFqcGc@._V1_QL75_UX801_.jpg",
      title: "Minions & Monsters",
      tags: "comedy • Thriller • Suspense",
      description: "Follows the Minions in 1920s Hollywood as they search for frightening creatures for their monster movie, partner with a green creature, and must save the planet after unleashing monsters.",
      link: "https://youtu.be/_IeLmfsjno8?si=crfEy5AvLdMC1VkZ"
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
    <History/>
    <Allmovie/>
  
  </>
  );
};

export default Home;