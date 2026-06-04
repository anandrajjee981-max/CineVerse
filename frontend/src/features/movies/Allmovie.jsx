import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Play, Bookmark, Star, X } from 'lucide-react';

import YouTube from 'react-youtube';

import '../style/allmovie.scss';
import { usemovie } from './hooks/movie.auth';
import { useNavigate } from 'react-router';

const Allmovie = () => {
  const { handleallmovie } = usemovie();
  const { movies, loading, error } = useSelector((state) => state.movies);
 const navigate = useNavigate()
  const API_KEY = import.meta.env.VITE_YT_API_KEY;
  const movieDataList = Array.isArray(movies) ? movies : movies?.movie || [];
  const [visibleCount, setVisibleCount] = useState(10);
  const locomotiveRef = useRef(null);

  // States for Trailer & Custom Notifications
  const [trailerUrl, setTrailerUrl] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Helper function to show non-blocking custom alerts
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 4000); // 4 seconds baad automatic gayab ho jayega
  };

  useEffect(() => {
    handleallmovie();
  }, []);

  // Initialize Locomotive Scroll v5 (Lenis based architecture)
  useEffect(() => {
    let scrollInstance;

    import('locomotive-scroll').then((LocomotiveScrollModule) => {
      const LocomotiveScroll = LocomotiveScrollModule.default;
      
      scrollInstance = new LocomotiveScroll({
        autoStart: true,
        lenisOptions: {
          wrapper: window,
          content: document.documentElement,
          lerp: 0.05,
          duration: 1.2,
          smoothWheel: true,
        }
      });

      locomotiveRef.current = scrollInstance;

      const handleNativeScroll = () => {
        const totalHeight = document.documentElement.scrollHeight;
        const currentDistance = window.innerHeight + window.scrollY;

        if (currentDistance >= totalHeight - 200) {
          setVisibleCount((prevCount) => {
            if (prevCount < movieDataList.length) {
              return prevCount + 10;
            }
            return prevCount;
          });
        }
      };

      window.addEventListener('scroll', handleNativeScroll);
      scrollInstance.userData = { scrollHandler: handleNativeScroll };
    });

    return () => {
      if (locomotiveRef.current) {
        if (locomotiveRef.current.userData?.scrollHandler) {
          window.removeEventListener('scroll', locomotiveRef.current.userData.scrollHandler);
        }
        locomotiveRef.current.destroy();
      }
    };
  }, [movieDataList.length]);
  const getYoutubeEmbedSearchUrl = (title, year) => {
  const query = encodeURIComponent(
    `${title} ${year} official trailer`
  );

  // 🔥 stable YouTube embed search feed
  return `https://www.youtube.com/embed?listType=search&list=${query}`;
};

const handlePlayTrailer = async (movie) => {
  if (!movie?.title) { showToast("Movie title missing!"); return; }

  const year = movie.release_date?.split("-")[0] || "";

  // ✅ JSON format mein save karo, embed URL nahi
  localStorage.setItem("lastTrailer", JSON.stringify({
    title: movie.title,
    year,
  }));

  navigate("/trailer");
};
  // YouTube Player Options
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  if (loading && movieDataList.length === 0) {
    return (
      <div className="premium-loader-container">
        <div className="obsidian-spinner"></div>
        <p>Fetching Cinematic Database...</p>
      </div>
    );
  }

  if (error) {
    return <div className="premium-error-banner">Engine Error: {error}</div>;
  }

  const displayedMovies = movieDataList.slice(0, visibleCount);

  return (
    <div className="jiohotstar-showcase-container">
      <h2 className="section-main-heading">All Featured Blockbusters</h2>
      
      {/* --- CUSTOM NON-BLOCKING TOAST NOTIFICATION --- */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(20, 20, 20, 0.95)',
          color: '#fff',
          padding: '14px 28px',
          borderRadius: '12px',
          zIndex: 10000,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          fontSize: '14px',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          letterSpacing: '0.5px'
        }}>
          {toastMessage}
        </div>
      )}

      {/* 100% Flex Wrap Native Layer */}
      <div className="movies-flex-wrap-grid">
        {displayedMovies.map((movie, index) => (
          <div key={`${movie._id}-${index}`} className="movie-premium-card">
            
            <div className="poster-frame-wrapper">
              <img 
                src={movie.poster_path} 
                alt={movie.title} 
                loading="lazy" 
                className="movie-raw-poster"
              />
              
              {/* WATCHLIST BUTTON (Fixed Alert) */}
              <button 
                className="card-save-trigger" 
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`${movie.title} added to watchlist!`);
                }}
                aria-label="Save to Watchlist"
              >
                <Bookmark size={15} className="save-icon-svg" />
              </button>

              {/* Glassmorphic Layer */}
              <div className="glass-hover-slider-panel">
                <div className="slider-panel-content">
                  <span className="meta-release-year">
                    <Star size={12} fill="currentColor" /> {movie.release_date} • {movie.category}
                  </span>
                  <h3 className="hover-movie-title">{movie.title}</h3>
                  <p className="hover-movie-cast">{movie.overview}</p>
                  <div className="hover-genre-pill-row">
                    {movie.genres?.map((g, idx) => (
                      <span key={idx} className="genre-pill">{g}</span>
                    ))}
                  </div>
                  
                  {/* WATCH NOW BUTTON TRIGGER */}
                  <button 
                    className="premium-inline-play-btn"
                    onClick={() => handlePlayTrailer(movie)}
                  >
                    <Play size={12} fill="currentColor" /> Watch Now
                  </button>
                </div>
              </div>

            </div>

            <div className="mobile-static-metadata">
              <h4 className="mobile-title-text">{movie.title}</h4>
            </div>

          </div>
        ))}
      </div>

      {loading && visibleCount < movieDataList.length && (
        <div className="mini-loader">Loading more blockbusters...</div>
      )}

      {/* --- YOUTUBE TRAILER MODAL --- */}
 
      
    </div>
  );
};

export default Allmovie;