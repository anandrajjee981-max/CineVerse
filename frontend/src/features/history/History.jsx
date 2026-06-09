import React, { useEffect, useState } from 'react'
import { getmoviehistory } from './utils/recentwatch'
import { useNavigate } from 'react-router-dom' // 👈 Navigation hook import kiya
import '../style/history.scss'

const History = () => {
  const [historyList, setHistoryList] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate() // 👈 Initialize router navigation

  useEffect(() => {
    const data = getmoviehistory() || []
    setHistoryList(data)
    setLoading(false)
  }, [])

  // 🔥 Click Handler: History se wapas trailer page par bhejne ke liye
  const handleCardClick = (movie) => {
    if (!movie?.title) return;

    // trailer engine page ke liye data sync kiya
    localStorage.setItem("lastTrailer", JSON.stringify({
      id: movie.id || movie._id,
      title: movie.title,
      poster: movie.poster || movie.poster_path,
      overview: movie.overview || "",
      year: movie.release_date?.split("-")[0] || "",
    }));

    // Redirect to trailer player
    navigate("/trailer");
  };

  if (loading) {
    return (
      <div className="history-page loading-state">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <h1 className="page-title">Watch History</h1>

        {/* Condition check */}
        {historyList.length === 0 ? (
          <div className="empty-history-card">
            <div className="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2>No recently watched items</h2>
            <p>Your watch history is clear. Movies you stream will show up here.</p>
          </div>
        ) : (
          <div className="history-grid">
            {historyList.map((movie) => {
              // Both keys handled to ensure zero image breakage
              const finalPoster = movie.poster || movie.poster_path;

              return (
                <div 
                  className="movie-history-card" 
                  key={`${movie.id}-${movie.watchedAt}`}
                  onClick={() => handleCardClick(movie)} // 👈 Poore card par click functional kiya
                  style={{ cursor: 'pointer' }}
                >
                  <div className="poster-wrapper">
                    <img 
                      src={finalPoster ? finalPoster : '/fallback-poster.jpg'} 
                      alt={movie.title} 
                      loading="lazy"
                    />
                    <div className="card-overlay">
                      <button className="play-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="card-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="meta-info">
                      <span className="release-year">{movie.release_date?.split('-')[0] || 'N/A'}</span>
                      <span className="dot">•</span>
                      <span className="watched-date">
                        {new Date(movie.watchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default History