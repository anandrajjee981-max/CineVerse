import { useDispatch } from "react-redux"; // Crucial import for Redux synchronization
import { setCategory, fetchMoviesFailure, fetchMoviesSuccess, fetchMoviesStart } from "../slice/movies.slice";
import { allmovies ,category ,search} from "../service/movies.api";

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
async function handleCategory(name){
  try{
  dispatch(setCategory("Category"));
    dispatch(fetchMoviesStart());
const res = await category(name)
  dispatch(fetchMoviesSuccess(res));
      
      return res;
  }
  catch(err){
  dispatch(fetchMoviesFailure(err?.message || "Cinematic stream fetch failure"));
  }
}
async function handleSearch(name) {
  try {
    // 1. Initialize the loading/fetching state using your slice action creator
    dispatch(fetchMoviesStart());

    // 2. Execute the asynchronous API server network call
    const res = await search(name);

    // 3. Sync the successful payload directly into your Redux global store
    dispatch(fetchMoviesSuccess(res));
      
    // 4. Return the data back so the component's local state can use it safely
    return res;

  } catch (err) {
    // 5. Catch failures and gracefully pass the string message inside the action payload
    dispatch(fetchMoviesFailure(err?.message || "Cinematic stream fetch failure"));
    return null; // Return a fallback value to protect component mapping loops
  }
}



  return { handleallmovie ,handleCategory , handleSearch}; // Returning as an object for clean extraction layouts
};