import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
  selectedCategory: 'Home', // Navbar integration ke liye helpful rahega
  loading: false,
  error: null
};

export const movieSlice = createSlice({
  name: 'movies',
  initialState, // Fixed spelling typo from 'intialstate'
  reducers: {
    // Jab user Navbar/Dropdown par click karega, tab category change karne ke liye
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    // Dummy actions filter and data pipeline setup ke liye
    fetchMoviesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMoviesSuccess: (state, action) => {
      state.loading = false;
      state.movies = action.payload;
    },
    fetchMoviesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

// Actions export kar rahe hain taaki hum components mein useDispatch use kar sakein
export const { setCategory, fetchMoviesStart, fetchMoviesSuccess, fetchMoviesFailure } = movieSlice.actions;

export default movieSlice.reducer;