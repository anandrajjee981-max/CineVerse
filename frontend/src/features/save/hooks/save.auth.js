import { save , allsave ,deletesave } from "../service/save.api";
import { setCategory ,fetchMoviesStart,fetchMoviesFailure,fetchMoviesSuccess } from "../../movies/slice/movies.slice";
import { useDispatch, useSelector } from "react-redux";

export function usesave(){
  const dispatch = useDispatch();
  const movie = useSelector(state => state.movie);

  async function handlesave(name){
    dispatch(setCategory("save"));
    dispatch(fetchMoviesStart());
    const res = await save(name);
    dispatch(fetchMoviesSuccess(res));
    return res; 
  }

  async function handledelete(name){
    dispatch(setCategory("save"));
    dispatch(fetchMoviesStart());
    const res = await deletesave(name);
    dispatch(fetchMoviesSuccess(res));
    return res; 
  }

  async function handleallsave(){
    dispatch(setCategory("save"));
    dispatch(fetchMoviesStart());
    const res = await allsave();
    dispatch(fetchMoviesSuccess(res));
    return res; 
  }

  
  return { 
    handlesave, 
    handledelete, 
    handleallsave 
  };
}