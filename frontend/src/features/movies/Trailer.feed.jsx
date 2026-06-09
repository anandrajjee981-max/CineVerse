// TrailerFeed.jsx — drop-in replacement

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_YT_API_KEY;

const TrailerFeed = () => {
  const [videoId, setVideoId]   = useState(null);
  const [status, setStatus]     = useState("loading"); // loading | found | error
  const [movieTitle, setMovieTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("lastTrailer");
    // Support both old (embed URL) and new (JSON) formats
    let title = "", year = "";

    try {
      const parsed = JSON.parse(raw);
      title = parsed.title || "";
      year  = parsed.year  || "";
    } catch {
      // fallback: old format tha toh seedha skip
      setStatus("error");
      return;
    }

    setMovieTitle(title);
    fetchTrailer(title, year);
  }, []);

  const fetchTrailer = async (title, year) => {
    const query = `${title} ${year} official trailer`;
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=1&maxResults=5&key=${API_KEY}`
      );
      const data = await res.json();

      if (data.error) {
        console.error("YT API Error:", data.error.message);
        setStatus("error");
        return;
      }

      // First valid videoId lo
      const item = data.items?.find(i => i.id?.videoId);
      if (!item) { setStatus("error"); return; }

      setVideoId(item.id.videoId);
      setStatus("found");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 0%, #16181f 0%, #0a0b0f 80%)",
      backgroundColor: "#0a0b0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      color: "#ffffff",
      position: "relative",
    }}>

      {/* Premium Glassmorphism Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute", 
          top: "30px", 
          left: "30px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#e1e6f0", 
          padding: "10px 20px",
          borderRadius: "30px", 
          cursor: "pointer",
          backdropFilter: "blur(16px)", 
          WebkitBackdropFilter: "blur(16px)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
        onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>

      {/* Loading State */}
      {status === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <div style={{ 
            width: "50px", height: "50px", 
            border: "3px solid rgba(255,255,255,0.1)", 
            borderTopColor: "#0078FF", // Jio/Hotstar blue accent
            borderRadius: "50%", 
            animation: "spin 1s linear infinite" 
          }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
          <p style={{ color: "#8f98a9", fontSize: "16px", letterSpacing: "0.5px" }}>Loading trailer...</p>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div style={{ 
          textAlign: "center", 
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          padding: "40px 60px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff4545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px" }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p style={{ fontSize: "22px", fontWeight: "600", margin: "0 0 8px 0" }}>Trailer Unavailable</p>
          <p style={{ fontSize: "14px", color: "#8f98a9", margin: "0 0 24px 0", maxWidth: "250px" }}>
            We couldn't fetch this trailer. Please check your API quota or network.
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "#ffffff",
              color: "#0a0b0f", 
              border: "none",
              padding: "12px 28px", 
              borderRadius: "30px",
              cursor: "pointer", 
              fontSize: "15px",
              fontWeight: "600",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Return to Explore
          </button>
        </div>
      )}

      {/* Found State - Cinematic Player */}
      {status === "found" && videoId && (
        <div style={{
          width: "100%", 
          maxWidth: "1100px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          animation: "fadeIn 0.8s ease-out"
        }}>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          
          <div style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: "16px", 
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#000",
            position: "relative"
          }}>
            <iframe
              style={{ width: "100%", height: "100%" }}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
              title={movieTitle}
              frameBorder="0"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>

          {movieTitle && (
            <div style={{ padding: "0 10px" }}>
              <h1 style={{ 
                margin: "0", 
                fontSize: "28px", 
                fontWeight: "700", 
                letterSpacing: "0.5px",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)"
              }}>
                {movieTitle}
              </h1>
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "12px", 
                marginTop: "12px" 
              }}>
                <span style={{ 
                  background: "rgba(255,255,255,0.1)", 
                  padding: "4px 10px", 
                  borderRadius: "4px", 
                  fontSize: "12px", 
                  fontWeight: "600",
                  color: "#a1aabf"
                }}>
                  TRAILER
                </span>
                <span style={{ color: "#8f98a9", fontSize: "14px" }}>
                  Official YouTube Release
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrailerFeed;