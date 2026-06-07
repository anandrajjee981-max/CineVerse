// const axios = require('axios');
// const mongoose = require('mongoose');
// const Movie = require('../models/movie.model');
// require('dotenv').config();

// const rapidAxios = axios.create({
//   baseURL: 'https://imdb8.p.rapidapi.com',
//   headers: {
//     'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//     'x-rapidapi-host': 'imdb8.p.rapidapi.com',
//     'Content-Type': 'application/json'
//   }
// });

// const homeCategories = ['trending', 'popular', 'upcoming', 'top_rated'];
// const targetGenres = ['Action', 'Comedy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Drama'];

// // 35+ High-yield universal keywords jisse real movies ka massive collection nikal ke aayega
// const blockBusterKeywords = [
//   'the', 'man', 'love', 'dark', 'dead', 'star', 'war', 'last', 'world', 
//   'night', 'king', 'kill', 'run', 'black', 'white', 'secret', 'agent', 
//   'game', 'monster', 'city', 'house', 'blood', 'lost', 'fire', 'day', 
//   'shadow', 'avengers', 'batman', 'spider', 'alien', 'police', 'hunt', 
//   'escape', 'forever', 'furious', 'matrix', 'doctor', 'curse', 'pirates'
// ];

// const seedIMDbDatabase = async () => {
//   try {
//     if (mongoose.connection.readyState === 0) {
//       await mongoose.connect(process.env.MONGO_URI);
//       console.log("MongoDB Connected... 🔌");
//     }

//     // Purana saara mix kachra saaf karo pehle
//     await Movie.deleteMany({});
//     console.log("Old catalog cleared completely.");

//     let finalDataCluster = [];
//     let titleDuplicationSet = new Set();

//     console.log(`Starting Heavy Weight Movie-Only Search for ${blockBusterKeywords.length} batches...`);

//     for (const term of blockBusterKeywords) {
//       console.log(`Scanning IMDb auto-complete for keyword: "${term}"...`);
      
//       try {
//         const response = await rapidAxios.get(`/auto-complete?q=${term}`);
//         const entriesArray = response.data.d || [];

//         let catAssignmentCount = 0;

//         entriesArray.forEach((item) => {
//           // STRICT FILTER: item.q strictly defines the content type
//           // 'feature' = Movies, 'tvSeries' = Web Series, 'video' = Direct-to-video films
//           // Isse Aaron Taylor-Johnson jaise actors/names 100% block ho jayenge
//           const isRealMovieOrShow = item.q === 'feature' || item.q === 'tvSeries' || item.q === 'video';

//           if (isRealMovieOrShow && item.l && item.i && item.i.imageUrl && !titleDuplicationSet.has(item.l)) {
//             titleDuplicationSet.add(item.l);

//             const randomGenre = targetGenres[Math.floor(Math.random() * targetGenres.length)];
//             let homeCategory = 'none';
            
//             // Randomly assign rows for JioHotstar dynamic look
//             if (catAssignmentCount < 2) {
//               homeCategory = homeCategories[Math.floor(Math.random() * homeCategories.length)];
//               catAssignmentCount++;
//             }

//             finalDataCluster.push({
//               title: item.l, // Pure Movie Title (e.g. "The Dark Knight")
//               overview: item.s || `${item.l} is an award winning cinematic experience now available for premium streaming.`, 
//               poster_path: item.i.imageUrl, // High-res direct CDN link
//               release_date: item.y ? item.y.toString() : "2026",
//               category: homeCategory,
//               genres: [randomGenre, 'All-Featured']
//             });
//           }
//         });

//         console.log(`→ Current Real Movies Counter: ${finalDataCluster.length}`);

//         // 🔥 target lock 550+ entries taaki buffer safe rahe
//         if (finalDataCluster.length >= 550) {
//           console.log("\n🎯 Target achieved! Safe pool of 550+ pure titles secured.");
//           break;
//         }

//       } catch (innerErr) {
//         // Agar koi ek half request throttle ya crash ho, toh loop chalta rahe
//         continue;
//       }
//     }

//     // Bulk push into MongoDB
//     if (finalDataCluster.length > 0) {
//       console.log(`\nWriting exactly ${finalDataCluster.length} GENUINE movie documents into MongoDB...`);
//       await Movie.insertMany(finalDataCluster);
//       console.log("🎉 MISSION ACCOMPLISHED! Local DB is now a powerhouse with 500+ pure movies!");
//     } else {
//       console.log("Pipeline parsing error. Check connection nodes.");
//     }

//     process.exit(0);
//   } catch (error) {
//     console.error("Critical Failure:", error.message);
//     process.exit(1);
//   }
// }
// const axios = require('axios');
// const mongoose = require('mongoose');
// const Movie = require('../models/movie.model');
// require('dotenv').config();

// const seedAnimeData = async () => {
//   try {
//     if (mongoose.connection.readyState === 0) {
//       await mongoose.connect(process.env.MONGO_URI);
//       console.log("MongoDB Connected... 🔌");
//     }

//     console.log("🛡️ Append Mode Active: Keeping existing movies database safe.");

//     // Duplicates filter karne ke liye current DB load karo
//     const existingMovies = await Movie.find({}, 'title').lean();
//     let titleDuplicationSet = new Set(existingMovies.map(m => m.title));
//     console.log(`Current items count in DB before adding Anime: ${titleDuplicationSet.size}`);

//     let animeCluster = [];
//     const homeCategories = ['trending', 'popular', 'upcoming', 'top_rated'];

//     // Quota bachane ke liye sirf 3 pages hit karenge (3 requests out of 30 daily limit)
//     const pagesToFetch = [1, 2, 3];
//     console.log("Starting batch fetch with exact 'size' parameters...");

//     for (const pageNum of pagesToFetch) {
//       console.log(`Fetching Page ${pageNum} with size 40...`);
      
//       try {
//         const response = await axios.get('https://anime-db.p.rapidapi.com/anime', {
//           params: { 
//             page: pageNum.toString(), 
//             size: '40' // Required field fixed! 40 is safe and standard max limit
//           },
//           headers: {
//             'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//             'x-rapidapi-host': 'anime-db.p.rapidapi.com'
//           }
//         });

//         const animeArray = response.data.data || response.data || [];
//         console.log(`Received ${animeArray.length} items from Page ${pageNum}`);

//         animeArray.forEach((item) => {
//           const animeTitle = item.title;
//           const animePoster = item.image;

//           if (animeTitle && animePoster && !titleDuplicationSet.has(animeTitle)) {
//             titleDuplicationSet.add(animeTitle);

//             const randomCategory = homeCategories[Math.floor(Math.random() * homeCategories.length)];

//             animeCluster.push({
//               title: animeTitle,
//               overview: item.synopsis || `${animeTitle} is a top-tier anime adventure streaming now on CineVerse.`,
//               poster_path: animePoster, 
//               release_date: item.type || "Anime",
//               category: randomCategory,
//               genres: ['Anime', 'All-Featured']
//             });
//           }
//         });

//       } catch (innerErr) {
//         console.error(`Page ${pageNum} par fail hua:`, innerErr.response ? innerErr.response.data : innerErr.message);
//         continue;
//       }
//     }

//     // Final insert pipeline
//     if (animeCluster.length > 0) {
//       console.log(`\nPushing ${animeCluster.length} pure unique Anime titles into MongoDB...`);
//       await Movie.insertMany(animeCluster);
      
//       const updatedTotal = await Movie.countDocuments();
//       console.log(`🎉 SUCCESS! Total database size grew from 162 to: ${updatedTotal}`);
//     } else {
//       console.log("No new unique anime processed.");
//     }

//     process.exit(0);
//   } catch (error) {
//     console.error("Critical Failure:", error.message);
//     process.exit(1);
//   }
// };

// seedAnimeData();
const axios = require('axios');
const mongoose = require('mongoose');
const Movie = require('../models/movie.model');
require('dotenv').config();

const seedAnimeDataNextBatch = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected... 🔌");
    }

    console.log("🛡️ Append Mode Active: Keeping your 281 movies/anime safe.");

    // Filhal DB mein jitne titles hain sabko set mein daalo taaki duplication zero ho
    const existingMovies = await Movie.find({}, 'title').lean();
    let titleDuplicationSet = new Set(existingMovies.map(m => m.title));
    console.log(`Current items count in DB before this run: ${titleDuplicationSet.size}`);

    let animeCluster = [];
    const homeCategories = ['trending', 'popular', 'upcoming', 'top_rated'];

    // 🔥 Page 4 se lekar 10 tak hit karenge naya data nikalne ke liye
    const nextPages = [4, 5, 6, 7, 8, 9, 10];
    console.log("Fetching next fresh batches (Pages 4 to 10)...");

    for (const pageNum of nextPages) {
      console.log(`Fetching Page ${pageNum} with size 40...`);
      
      try {
        const response = await axios.get('https://anime-db.p.rapidapi.com/anime', {
          params: { 
            page: pageNum.toString(), 
            size: '40'
          },
          headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'anime-db.p.rapidapi.com'
          }
        });

        const animeArray = response.data.data || response.data || [];
        console.log(`Received ${animeArray.length} items from Page ${pageNum}`);

        animeArray.forEach((item) => {
          const animeTitle = item.title;
          const animePoster = item.image;

          if (animeTitle && animePoster && !titleDuplicationSet.has(animeTitle)) {
            titleDuplicationSet.add(animeTitle);

            const randomCategory = homeCategories[Math.floor(Math.random() * homeCategories.length)];

            animeCluster.push({
              title: animeTitle,
              overview: item.synopsis || `${animeTitle} is a top-tier anime adventure streaming now on CineVerse.`,
              poster_path: animePoster, 
              release_date: item.type || "Anime",
              category: randomCategory,
              genres: ['Anime', 'All-Featured']
            });
          }
        });

      } catch (innerErr) {
        console.error(`Page ${pageNum} skip hui due to error.`);
        continue;
      }
    }

    // Insert new batch
    if (animeCluster.length > 0) {
      console.log(`\nPushing ${animeCluster.length} NEW unique Anime titles into MongoDB...`);
      await Movie.insertMany(animeCluster);
      
      const updatedTotal = await Movie.countDocuments();
      console.log(`🎉 BOOM! Mission Accomplished. Total database size is now: ${updatedTotal}`);
    } else {
      console.log("Is batch mein koi naya unique anime nahi mila.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Critical Failure:", error.message);
    process.exit(1);
  }
};



module.exports =seedAnimeDataNextBatch;