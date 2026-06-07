import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Play, Bookmark, Star } from 'lucide-react';
import { usemovie } from './hooks/movie.auth';
import '../style/category.scss';
import '../style/allmovie.scss'; 
import Navbar from '../../components/Navbar';

const Category = () => {
  const { handleCategory, handleallmovie } = usemovie();
  const navigate = useNavigate();
  
  const moviesState = useSelector((state) => state.movies);
  const loading = moviesState?.loading;
  const error = moviesState?.error;

  const [localMovies, setLocalMovies] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState("");
  
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
      title: movie.title,
      year: movie.release_date || "",
    }));
    navigate("/trailer");
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
        <div className="premium-toast-alert">
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
            localMovies.map((movie, index) => (
              <div key={`${movie._id}-${index}`} className="movie-premium-card">
                
                <div className="poster-frame-wrapper">
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title} 
                    loading="lazy"          
                    decoding="async"        
                    className="movie-raw-poster"
                  />
                  
                  <button 
                    className="card-save-trigger" 
                    onClick={(e) => {
                      e.stopPropagation();
                      showToast(`${movie.title} added to watchlist!`);
                    }}
                  >
                    <Bookmark size={15} />
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Category;