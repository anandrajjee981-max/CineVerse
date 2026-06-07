import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Play, Bookmark, Star, Search as SearchIcon, X } from 'lucide-react';
import { usemovie } from './hooks/movie.auth';
import '../style/search.scss';
import Navbar from '../../components/Navbar';

const Search = () => {
  const { handleSearch } = usemovie();
  const navigate = useNavigate();

  const moviesState = useSelector((state) => state.movies);
  const loading = moviesState?.loading;
  const error = moviesState?.error;

  const [query, setQuery] = useState('');
  const [localMovies, setLocalMovies] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const extractMoviesArray = (rawData) => {
    if (!rawData) return [];
    if (Array.isArray(rawData)) return rawData;
    if (rawData.movie) return [rawData.movie]; // Agar object hai toh array bana do mapping ke liye
    if (rawData.movies && Array.isArray(rawData.movies)) return rawData.movies;
    if (rawData.data && Array.isArray(rawData.data)) return rawData.data;
    return [];
  };

  // 🔥 Trigger API search call only on user submission
  const executeSearchAction = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const res = await handleSearch(query.trim());
    if (res) {
      setLocalMovies(extractMoviesArray(res));
    } else {
      setLocalMovies([]); // Clear screen on 404/Not Found
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

  const clearSearch = () => {
    setQuery('');
    setLocalMovies([]);
  };

  return (
    <div className="jiohotstar-showcase-container">
      <Navbar />

      {/* --- SUBMIT FORM ON ENTER --- */}
      <form onSubmit={executeSearchAction} className="search-bar-filter-wrapper">
        <div className="search-input-relative-container">
          <SearchIcon 
            className="search-input-left-icon" 
            size={20} 
            onClick={executeSearchAction}
            style={{ cursor: 'pointer' }}
          />
          <input
            type="text"
            className="premium-search-input-field"
            placeholder="Type full movie name & press Enter..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button type="button" className="search-clear-action-trigger" onClick={clearSearch}>
              <X size={18} />
            </button>
          )}
        </div>
      </form>

      {query.trim() && localMovies.length > 0 && (
        <h2 className="section-main-heading">
          Search Results for: <span className="query-highlight-text">"{query}"</span>
        </h2>
      )}

      {toastMessage && (
        <div className="premium-toast-alert">{toastMessage}</div>
      )}

      {/* --- ERROR OR FALLBACK HANDLING --- */}
      {error && !loading && (
        <div className="mini-loader-empty" style={{ color: '#e50914' }}>
          No blockbusters found for exact phrase context.
        </div>
      )}

      {loading ? (
        <div className="premium-loader-container">
          <div className="obsidian-spinner"></div>
          <p>Querying Vault Engine...</p>
        </div>
      ) : (
        <div className="movies-flex-wrap-grid">
          {localMovies.length === 0 ? (
            <div className="mini-loader-empty">
              {query.trim() === '' 
                ? "Type exact movie title above to discover cinematic masterpieces." 
                : "No blockbusters found matching that exact title."}
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

export default Search;