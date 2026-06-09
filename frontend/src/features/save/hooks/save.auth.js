import { save, allsave, deletesave } from "../service/save.api";
import { useDispatch } from "react-redux";
import {
  fetchSaveStart,
  fetchSaveFailure,
  fetchSaveSuccess
} from "../slice/save.slice";

export function usesave() {
  const dispatch = useDispatch();

  async function handlesave(name) {
    try {
      dispatch(fetchSaveStart());
      const res = await save(name);
      dispatch(fetchSaveSuccess(res));
      return res;
    } catch (err) {
      dispatch(fetchSaveFailure(err.message));
    }
  }

  async function handledelete(name) {
    try {
      dispatch(fetchSaveStart());
      const res = await deletesave(name);
      dispatch(fetchSaveSuccess(res));
      
      return res;
    } catch (err) {
      dispatch(fetchSaveFailure(err.message));
    }
  }

  async function handleallsave() {
    try {
      dispatch(fetchSaveStart());
      const res = await allsave();
      dispatch(fetchSaveSuccess(res));
      console.log("ALL SAVE API RESPONSE:", res);
      return res;
    } catch (err) {
      dispatch(fetchSaveFailure(err.message));
    }
  }

  return { handlesave, handledelete, handleallsave };
}