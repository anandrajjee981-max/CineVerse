import { configureStore } from "@reduxjs/toolkit";

import movieReducer from "../movies/slice/movies.slice"; 

export const store = configureStore({
  reducer: {
    // Key ka naam 'movies' rakho jo useSelector dhoondh raha hai
    movies: movieReducer, 
  },
});