import { configureStore } from "@reduxjs/toolkit";

import movieReducer from "../movies/slice/movies.slice"; 
import authreducer from '../pages/slice/auth.slice'
import savereducer from '../save/slice/save.slice'

export const store = configureStore({
  reducer: {
    // Key ka naam 'movies' rakho jo useSelector dhoondh raha hai
    movies: movieReducer, 
    auth : authreducer,
    save : savereducer
  },
});