import React, { useState } from 'react';
import { Play, Bookmark, Heart, ChevronDown, ChevronUp, Calendar, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../style/sparks.scss';
import Navbar from '../../components/Navbar';

const SPARKS_DATA = [
  {
    id: "spk_1",
    title: "Inception - Official Mind-Bending Trailer",
    youtubeId: "YoHD9XEInc0",
    movieRef: {
      _id: "mov_inc_101",
      title: "Inception",
      poster_path: "https://images7.alphacoders.com/518/518783.jpg",
      overview: "Cobb, a skilled thief who steals corporate secrets through use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.",
      release_date: "2010-07-16"
    }
  },
  {
    id: "spk_2",
    title: "Interstellar - Final Masterpiece Trailer",
    youtubeId: "zSWdZVtXT7E",
    movieRef: {
      _id: "mov_int_102",
      title: "Interstellar",
      poster_path: "https://rukminim2.flixcart.com/image/480/480/juk4gi80/poster/s/g/3/large-newposter8503-movie-interstellar-hd-wallpaper-background-original-imaf5ttsfnfgt2zh.jpeg?q=90",
      overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
      release_date: "2014-11-07"
    }
  },
  {
    id: "spk_3",
    title: "The Dark Knight - The Joker Hype Clip",
    youtubeId: "EXeTwQWrcwY",
    movieRef: {
      _id: "mov_tdk_103",
      title: "The Dark Knight",
      poster_path: "https://wallpapercat.com/w/full/e/5/1/37793-3840x2160-desktop-4k-the-dark-knight-wallpaper-photo.jpg",
      overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
      release_date: "2008-07-18"
    }
  },
  {
    id: "spk_4",
    title: "Avengers: Endgame - Assemble IMAX Trailer",
    youtubeId: "TcMBFSGVi1c",
    movieRef: {
      _id: "mov_avg_104",
      title: "Avengers: Endgame",
      poster_path: "https://images.alphacoders.com/100/1002901.jpg",
      overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions.",
      release_date: "2019-04-26"
    }
  },
  {
    id: "spk_5",
    title: "Oppenheimer - Official Cinematic Teaser",
    youtubeId: "uYPbbksFsQo",
    movieRef: {
      _id: "mov_opp_105",
      title: "Oppenheimer",
      poster_path: "https://w0.peakpx.com/wallpaper/305/387/HD-wallpaper-oppenheimer-cillian-murphy-2023-films-poster.jpg",
      overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
      release_date: "2023-07-21"
    }
  },
  {
    id: "spk_6",
    title: "Dune: Part Two - Epic Desert War Trailer",
    youtubeId: "Way9Dexny3w",
    movieRef: {
      _id: "mov_dun_106",
      title: "Dune: Part Two",
      poster_path: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/1948bf40-183f-46db-9c61-86ea495ce475.__CR0,0,970,600_PT0_SX970_V1___.jpg",
      overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
      release_date: "2024-03-01"
    }
  },
  {
    id: "spk_7",
    title: "Spider-Man: No Way Home - Multiverse Hype",
    youtubeId: "JfVOs4VSpmA",
    movieRef: {
      _id: "mov_spm_107",
      title: "Spider-Man: No Way Home",
      poster_path: "https://images.hdqwalls.com/wallpapers/marvel-spider-man-no-way-home-4k-ua.jpg",
      overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange, the stakes become even more dangerous.",
      release_date: "2021-12-17"
    }
  },
  {
    id: "spk_8",
    title: "Avatar: The Way of Water - Pandora Visuals",
    youtubeId: "d9MyW72ELq0",
    movieRef: {
      _id: "mov_ava_108",
      title: "Avatar: The Way of Water",
      poster_path: "https://cdn2.highdefdigest.com/uploads/2023/03/29/avatar-the-way-of-water-4kultrahd-streaming-review-2.jpeg",
      overview: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri.",
      release_date: "2022-12-16"
    }
  },
  {
    id: "spk_9",
    title: "Top Gun: Maverick - High Velocity Action",
    youtubeId: "giXco2jaZ_4",
    movieRef: {
      _id: "mov_top_109",
      title: "Top Gun: Maverick",
      poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHEV3hjx6yVE-nYtTg7IPMLYbs8yL6d8jJKw&s",
      overview: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot.",
      release_date: "2022-05-27"
    }
  },
  {
    id: "spk_10",
    title: "The Batman - Dark Vengeance Trailer",
    youtubeId: "mqqft2x_Aa4",
    movieRef: {
      _id: "mov_bat_110",
      title: "The Batman",
      poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTDQB4b2aByLJC7f0cMsRTbWKdTitNqoqurA&s",
      overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
      release_date: "2022-03-04"
    }
  }
];

const Sparks = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();
  const currentSpark = SPARKS_DATA[activeIndex];

  const handleWatchFullMovie = () => {
    if (!currentSpark?.movieRef) return;
    
    const movieYear = currentSpark.movieRef.release_date 
      ? currentSpark.movieRef.release_date.split("-")[0] 
      : "N/A";

    localStorage.setItem("lastTrailer", JSON.stringify({
      id: currentSpark.movieRef._id,
      title: currentSpark.movieRef.title,
      poster: currentSpark.movieRef.poster_path,
      overview: currentSpark.movieRef.overview,
      year: movieYear
    }));
    navigate("/trailer");
  };

  const handleNext = () => {
    if (activeIndex < SPARKS_DATA.length - 1) {
      setActiveIndex(prev => prev + 1);
      setLiked(false);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
      setLiked(false);
    }
  };

  return (
    <div className="sparks-page-wrapper">
      {/* Immersive Ambient Glow Backdrop */}
      <Navbar/>
      <div 
        className="ambient-bg" 
        style={{ backgroundImage: `url(${currentSpark.movieRef.poster_path})` }}
      ></div>

      <div className="sparks-main-container">
        
        {/* Left Side: Premium Modern Movie Poster Card */}
        <div className="poster-showcase-card">
          <div className="poster-image-wrapper">
            <img 
              src={currentSpark.movieRef.poster_path} 
              alt={currentSpark.movieRef.title} 
              className="premium-poster"
            />
            <div className="poster-vignette"></div>
          </div>
          
          <div className="poster-meta-details">
            <div className="brand-badge">cineVerse SPARKS</div>
            <h1 className="movie-main-title">{currentSpark.movieRef.title}</h1>
            <div className="quick-tags">
              <span><Calendar size={14} /> {currentSpark.movieRef.release_date.split("-")[0]}</span>
              <span><Film size={14} /> 4K Ultra HD</span>
            </div>
            <p className="movie-overview-snippet">{currentSpark.movieRef.overview}</p>
          </div>
        </div>

        {/* Right Side: Ultra-Wide Trailer Stage */}
        <div className="video-card-frame">
          <iframe
            key={currentSpark.id}
            className="spark-youtube-embed"
            src={`https://www.youtube.com/embed/${currentSpark.youtubeId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0`}
            title={currentSpark.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>

          {/* Integrated Sleek Control Bar inside Content Frame */}
          <div className="glass-action-footer">
            <div className="meta-text-group">
              <span className="live-tag">⚡ NOW STREAMING TRAILER</span>
              <h3 className="spark-clip-title">{currentSpark.title}</h3>
            </div>
            
            <div className="action-button-cluster">
              <button 
                className={`control-pill ${liked ? 'liked' : ''}`} 
                onClick={() => setLiked(!liked)}
              >
                <Heart size={18} fill={liked ? "#ff4757" : "none"} />
                <span>{liked ? 'Liked' : 'Like'}</span>
              </button>

              <button 
                className={`control-pill ${bookmarked ? 'bookmarked' : ''}`} 
                onClick={() => setBookmarked(!bookmarked)}
              >
                <Bookmark size={18} fill={bookmarked ? "#00d2d3" : "none"} />
                <span>Watchlist</span>
              </button>

              <button className="primary-cta-btn" onClick={handleWatchFullMovie}>
                <Play size={16} fill="currentColor" />
                <span>Watch Full Movie</span>
              </button>
            </div>
          </div>
        </div>

        {/* Structural Navigation Dock */}
        <div className="sparks-navigation-dock">
          <button onClick={handlePrev} disabled={activeIndex === 0} className="dock-arrow">
            <ChevronUp size={20} />
          </button>
          <div className="dock-counter">
            <span className="current">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="divider">/</span>
            <span className="total">{String(SPARKS_DATA.length).padStart(2, '0')}</span>
          </div>
          <button onClick={handleNext} disabled={activeIndex === SPARKS_DATA.length - 1} className="dock-arrow">
            <ChevronDown size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Sparks;