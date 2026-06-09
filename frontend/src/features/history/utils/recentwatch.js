export default function addToRecentWatch(movie) {
  const existing = JSON.parse(localStorage.getItem("recentWatch")) || [];

  // Agar movie pehle se list mein hai toh purani hatate hain deduplication ke liye
  const filtered = existing.filter(item => item.id !== movie._id);
  
  const updated = [
    {
      id: movie._id,
      title: movie.title,
      poster: movie.poster_path,       
      poster_path: movie.poster_path,  //  Safer fallback matching backend schema
      release_date: movie.release_date,
      watchedAt: Date.now()
    },
    ...filtered
  ];

  localStorage.setItem(
    "recentWatch",
    JSON.stringify(updated.slice(0, 20)) // Maintaining top 20 limit
  );
}

export function getmoviehistory() {
  return JSON.parse(localStorage.getItem("recentWatch")) || [];
}










