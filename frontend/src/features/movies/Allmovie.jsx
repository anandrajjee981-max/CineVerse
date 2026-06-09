import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Play, Bookmark, Star } from 'lucide-react';
import '../style/allmovie.scss';
import { usemovie } from './hooks/movie.auth';
import { useNavigate } from 'react-router-dom';
import { usesave } from '../save/hooks/save.auth';

const Allmovie = () => {
     const user = useSelector(state => state.auth.user)
 
  const { handleallmovie } = usemovie();
  const { handlesave, handledelete } = usesave();
  const { movies, loading, error } = useSelector((state) => state.movies);
  const navigate = useNavigate();
  
  const movieDataList = Array.isArray(movies) ? movies : movies?.movie || [];
  const [visibleCount, setVisibleCount] = useState(10);
  const locomotiveRef = useRef(null);
  const isFetchedRef = useRef(false);

  const [toastMessage, setToastMessage] = useState("");
 useEffect(() => {
  if (!loading && user) {
    navigate('/home');
  }
}, [loading, user, navigate]);
  // 🔥 Tracking bookmarks via local state array matching your UI structure
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => { setToastMessage(""); }, 4000);
  };

  useEffect(() => {
    if (!isFetchedRef.current) {
      handleallmovie();
      isFetchedRef.current = true;
    }
  }, []);

  useEffect(() => {
    let scrollInstance;
    const initScroll = async () => {
      try {
        const LocomotiveScrollModule = await import('locomotive-scroll');
        const LocomotiveScroll = LocomotiveScrollModule.default;
        
        scrollInstance = new LocomotiveScroll({
          autoStart: true,
          lenisOptions: {
            wrapper: window,
            content: document.documentElement,
            lerp: 0.1, 
            duration: 0.8,
            smoothWheel: true,
          }
        });
        locomotiveRef.current = scrollInstance;
      } catch (err) {
        console.error(err);
      }
    };

    initScroll();

    const handleNativeScroll = () => {
      const totalHeight = document.documentElement.scrollHeight;
      const currentDistance = window.innerHeight + window.scrollY;

      if (currentDistance >= totalHeight - 350) {
        setVisibleCount((prevCount) => {
          if (prevCount < movieDataList.length) return prevCount + 10;
          return prevCount;
        });
      }
    };

    window.addEventListener('scroll', handleNativeScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleNativeScroll);
      if (locomotiveRef.current) {
        try { locomotiveRef.current.destroy(); } catch(e) {}
      }
    };
  }, [movieDataList.length]);

  const handlePlayTrailer = async (movie) => {
    if (!movie?.title) return;
    localStorage.setItem("lastTrailer", JSON.stringify({
      title: movie.title,
      year: movie.release_date?.split("-")[0] || "",
    }));
    navigate("/trailer");
  };

  // 🔥 Operational Bookmark Click Handler
  const handleBookmarkClick = async (e, movie) => {
    e.stopPropagation(); // Stops parent grid layout hovers from breaking
    
    const isAlreadyBookmarked = bookmarkedIds.includes(movie._id);

    try {
      if (isAlreadyBookmarked) {
        // If your backend deletes using title, change this to movie.title
        await handledelete(movie._id);
        
        setBookmarkedIds((prev) => prev.filter((id) => id !== movie._id));
        showToast(`${movie.title} removed from bookmarks.`);
      } else {
        // 🚀 FIXED: Passing movie.title to match hook expectations and prevent 404 errors
        await handlesave(movie.title);
        
        setBookmarkedIds((prev) => [...prev, movie._id]);
        showToast(`${movie.title} bookmarked!`);
      }
    } catch (err) {
      console.error("Bookmark handling failed:", err);
      showToast("Action failed. Please try again.");
    }
  };

  if (loading && movieDataList.length === 0) {
    return (
      <div className="premium-loader-container">
        <div className="obsidian-spinner"></div>
        <p>Fetching Cinematic Database...</p>
      </div>
    );
  }

  if (error) return <div className="premium-error-banner">Engine Error: {error}</div>;

  return (
    <div className="jiohotstar-showcase-container">
      <h2 className="section-main-heading">All Featured Blockbusters</h2>
      
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '30px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(20, 20, 20, 0.95)', color: '#fff', padding: '14px 28px',
          borderRadius: '12px', zIndex: 10000, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        }}>
          {toastMessage}
        </div>
      )}

      <div className="movies-flex-wrap-grid">
        {movieDataList.slice(0, visibleCount).map((movie, index) => {
          
          const isBookmarked = bookmarkedIds.includes(movie._id);

          return (
            <div key={`${movie._id}-${index}`} className="movie-premium-card">
              <div className="poster-frame-wrapper">
                <img 
                  src={movie.poster_path} 
                  alt={movie.title} 
                  loading="lazy"          
                  decoding="async"        
                  className="movie-raw-poster"
                />
                
                {/* Micro-Interaction Class Injection */}
                <button 
                  className={`card-save-trigger ${isBookmarked ? 'is-bookmarked' : ''}`} 
                  onClick={(e) => handleBookmarkClick(e, movie)}
                >
                  <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
                </button>

                <div className="glass-hover-slider-panel">
                  <div className="slider-panel-content">
                    <span className="meta-release-year">
                      <Star size={12} fill="currentColor" /> {movie.release_date}
                    </span>
                    <h3 className="hover-movie-title">{movie.title}</h3>
                    <p className="hover-movie-cast">{movie.overview?.substring(0, 90)}...</p>
                    
                    <button className="premium-inline-play-btn" onClick={() => handlePlayTrailer(movie)}>
                      <Play size={12} fill="currentColor" /> Watch Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="mobile-static-metadata">
                <h4 className="mobile-title-text">{movie.title}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Allmovie;