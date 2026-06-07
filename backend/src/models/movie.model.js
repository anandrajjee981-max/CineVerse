const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  overview: { type: String, default: "Stream this premium blockbuster exclusively on CineVerse." },
  poster_path: { type: String, required: true }, // IMDb raw image link
  release_date: { type: String, default: "2026" },
  category: { 
    type: String, 
    enum: ['trending', 'popular', 'upcoming', 'top_rated', 'none'], 
    default: 'none' 
  },
  genres: [{ type: String }] // ['Comedy', 'Horror', 'Action', 'Featured']
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);