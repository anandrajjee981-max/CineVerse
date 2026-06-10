import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Play, Bookmark, Star } from 'lucide-react';
import { usemovie } from './hooks/movie.auth';
import '../style/category.scss';
import '../style/allmovie.scss'; 
import Navbar from '../../components/Navbar';
import { usesave } from '../save/hooks/save.auth';

const Category = () => {
  const { handleCategory, handleallmovie } = usemovie();
  const navigate = useNavigate();
  const { handlesave, handledelete } = usesave();
  
  const moviesState = useSelector((state) => state.movies);
  const loading = moviesState?.loading;
  const error = moviesState?.error;

  const [localMovies, setLocalMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  
  const isInitialLoaded = useRef(false);

  const filterCategories = [
    { id: 'all', label: 'All Content' },
    { id: 'horror', label: 'Horror' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'drama', label: 'Drama' },
    { id: 'sci-fi', label: 'Sci-Fi' },
    { id: 'thriller', label: 'Thriller' },
    { id: 'romance', label: 'Romance' },
    { id: 'action', label: 'Action' },
    { id: 'anime', label: 'Anime' }
  ];

  const extractMoviesArray = (rawData) => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (rawData.movie && Array.isArray(rawData.movie)) return rawData.movie;
    if (rawData.movies && Array.isArray(rawData.movies)) return rawData.movies;
    if (rawData.data && Array.isArray(rawData.data)) return rawData.data;
    return [];
  };

  // 1. Initial Data Load Guarded Instance
  useEffect(() => {
    const loadInitialData = async () => {
      if (handleallmovie && !isInitialLoaded.current) {
        const res = await handleallmovie();
        if (res) {
          setLocalMovies(extractMoviesArray(res));
          isInitialLoaded.current = true;
        }
      }
    };
    loadInitialData();
  }, []);

  // 2. Controlled Redux Sync
  useEffect(() => {
    if (moviesState?.movies) {
      const extracted = extractMoviesArray(moviesState.movies);
      if (extracted.length > 0) {
        setLocalMovies(extracted);
      }
    }
  }, [moviesState]);

  // 3. Fast-Response Pill Click Handler
  const handlePillClick = async (catId) => {
    if (catId === activeCategory) return; // Same button micro-spam protection
    
    setActiveCategory(catId);
    setLocalMovies([]); // Clean screen trigger for high fps render
    
    if (catId === 'all') {
      if (handleallmovie) {
        const res = await handleallmovie();
        setLocalMovies(extractMoviesArray(res));
      }
    } else {
      if (handleCategory) {
        const res = await handleCategory(catId);
        const parsedMovies = extractMoviesArray(res);
        setLocalMovies(parsedMovies);
      }
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => { setToastMessage(""); }, 4000);
  };

  const handlePlayTrailer = (movie) => {
    if (!movie?.title) { showToast("Movie title missing!"); return; }
    localStorage.setItem("lastTrailer", JSON.stringify({
      id: movie._id,
      title: movie.title,
      poster: movie.poster_path,
      overview: movie.overview,
      year: movie.release_date?.split("-")[0] || "",
    }));
    navigate("/trailer");
  };

  const handleBookmarkClick = async (e, movie) => {
    e.stopPropagation(); // 🔥 Crucial: Stops the click from bubbling up and launching the movie trailer
    const isAlreadyBookmarked = bookmarkedIds.includes(movie._id);

    try {
      if (isAlreadyBookmarked) {
        await handledelete(movie._id);
        setBookmarkedIds((prev) => prev.filter((id) => id !== movie._id));
        showToast(`${movie.title} removed from bookmarks.`);
      } else {
        await handlesave(movie.title);
        setBookmarkedIds((prev) => [...prev, movie._id]);
        showToast(`${movie.title} bookmarked!`);
      }
    } catch (err) {
      console.error("Bookmark handling failed:", err);
      showToast("Action failed. Please try again.");
    }
  };

  if (error) {
    return <div className="premium-error-banner">Engine Error: {error}</div>;
  }

  return (
    <div className="jiohotstar-showcase-container">
      <Navbar/>
      {/* --- FILTER HORIZONTAL WRAPPER --- */}
      <div className="category-filter-wrapper">
        <div className="category-scroll-container">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => handlePillClick(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <h2 className="section-main-heading">
        {filterCategories.find(c => c.id === activeCategory)?.label} Blockbusters
      </h2>
      
      {toastMessage && (
        <div className="premium-toast-alert" style={{
          position: 'fixed', top: '30px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(20, 20, 20, 0.95)', color: '#fff', padding: '14px 28px',
          borderRadius: '12px', zIndex: 10000, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        }}>
          {toastMessage}
        </div>
      )}

      {/* --- PERFORMANCE ORIENTED LAYOUT SPACE --- */}
      {loading && localMovies.length === 0 ? (
        <div className="premium-loader-container">
          <div className="obsidian-spinner"></div>
          <p>Syncing Dynamic Layout Filters...</p>
        </div>
      ) : (
        <div className="movies-flex-wrap-grid">
          {localMovies.length === 0 ? (
            <div className="mini-loader-empty">
              No blockbusters found for this category segment.
            </div>
          ) : (
            localMovies.map((movie, index) => {
              const isBookmarked = bookmarkedIds.includes(movie._id);

              return (
                <div key={`${movie._id}-${index}`} className="movie-premium-card">
                  
                  {/* 🔥 FIXED: Clicking the poster frame wrapper now triggers the playback router */}
                  <div className="poster-frame-wrapper" onClick={() => handlePlayTrailer(movie)}>
                    <img 
                      src={movie.poster_path} 
                      alt={movie.title} 
                      loading="lazy"          
                      decoding="async"        
                      className="movie-raw-poster"
                    />
                    
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
                        <p className="hover-movie-cast">{movie.overview?.substring(0, 110)}...</p>
                        
                        <div className="hover-genre-pill-row">
                          {movie.genres?.slice(0, 2).map((g, idx) => (
                            <span key={idx} className="genre-pill">{g}</span>
                          ))}
                        </div>
                        
                        {/* Event action bubbles up beautifully into poster-frame-wrapper wrapper */}
                        <button className="premium-inline-play-btn">
                          <Play size={12} fill="currentColor" /> Watch Now
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* 🔥 FIXED: Static details on mobile are now responsive context targets */}
                  <div className="mobile-static-metadata" onClick={() => handlePlayTrailer(movie)}>
                    <h4 className="mobile-title-text">{movie.title}</h4>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default Category;