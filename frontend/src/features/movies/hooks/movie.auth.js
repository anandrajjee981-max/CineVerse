import { useDispatch } from "react-redux"; // Crucial import for Redux synchronization
import { setCategory, fetchMoviesFailure, fetchMoviesSuccess, fetchMoviesStart } from "../slice/movies.slice";
import { allmovies } from "../service/movies.api";

export const usemovie = () => {
  const dispatch = useDispatch();

  async function handleallmovie() {
    try {
      // 1. Set current stream layout path
      dispatch(setCategory("Home"));
      
      // 2. Start global skeleton loading state immediately *before* API hit
      dispatch(fetchMoviesStart());
      
      // 3. Resolve remote cinematic pipeline data stream
      const res = await allmovies();
      
      // 4. Dispatch raw response array payloads to slice store
      dispatch(fetchMoviesSuccess(res));
      
      return res;
    } catch (err) {
      // 5. Catch networking issues gracefully
      dispatch(fetchMoviesFailure(err?.message || "Cinematic stream fetch failure"));
    }
  }

  return { handleallmovie }; // Returning as an object for clean extraction layouts
};