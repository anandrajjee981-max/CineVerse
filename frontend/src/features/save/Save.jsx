import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Trash2, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usesave } from '../save/hooks/save.auth';
import '../style/allmovie.scss';
import Navbar from '../../components/Navbar'

const Save = () => {
  const { handleallsave, handledelete } = usesave();
const { saved, loading, error } = useSelector((state) => state.save);
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => { setToastMessage(""); }, 4000);
  };

  useEffect(() => {
    handleallsave();
  }, []);


const savedDataList = Array.isArray(saved)
  ? saved
  : saved?.save || [];

  const handlePlayTrailer = (movie) => {
    if (!movie?.title) return;
    localStorage.setItem("lastTrailer", JSON.stringify({
      title: movie.title,
      year: movie.release_date || "",
    }));
    navigate("/trailer");
  };

  const handleRemoveBookmark = async (e, movieTitle) => {
    e.stopPropagation(); 
    try {
      // 🚀 FIXED: यहाँ अब सीधा मूवी का नाम (title) जा रहा है
      await handledelete(movieTitle); 
      showToast(`${movieTitle} removed from your bookmarks.`);
      await handleallsave(); 
    } catch (err) {
      console.error("Delete structural fail:", err);
      showToast("Failed to remove bookmark. Try again.");
    }
  };

  if (loading && savedDataList.length === 0) {
    return (
      <div className="premium-loader-container">
        <div className="obsidian-spinner"></div>
        <p>Loading your saved bookmarked content...</p>
      </div>
    );
  }

  if (error) return <div className="premium-error-banner">Engine Error: {error}</div>;

  return (
    <div className="jiohotstar-showcase-container">
    <Navbar/>
      <h2 className="section-main-heading">My Bookmarked Collection</h2>
      
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '30px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: 'rgba(20, 20, 20, 0.95)', color: '#fff', padding: '14px 28px',
          borderRadius: '12px', zIndex: 10000, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        }}>
          {toastMessage}
        </div>
      )}

      {savedDataList.length === 0 ? (
        <div className="premium-loader-container" style={{ height: '40vh' }}>
          <p style={{ fontSize: '18px', color: '#8c8c93' }}>No bookmarked content found inside your collection.</p>
        </div>
      ) : (
        <div className="movies-flex-wrap-grid">
          {savedDataList.map((item, index) => {
            const movie = item?.movie;
            if (!movie) return null;

            return (
              <div key={`${item._id}-${index}`} className="movie-premium-card">
                <div className="poster-frame-wrapper">
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title} 
                    loading="lazy"          
                    decoding="async"        
                    className="movie-raw-poster"
                  />
                  
                  {/* 🚀 FIXED: onClick में अब सीधा movie.title पास हो रहा है */}
                  <button 
                    className="card-save-trigger" 
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                    onClick={(e) => handleRemoveBookmark(e, movie.title)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} color="#e50914" />
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
      )}
    </div>
  );
};

export default Save;