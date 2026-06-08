import { useDispatch, useSelector } from "react-redux";
import { login , register ,getme} from '../service/auth.api';
import { authStart , authFailure , authSuccess ,logout } from '../slice/auth.slice';
import { useEffect } from "react";

export function useauth(){
const dispatch = useDispatch()
const auth = useSelector(
   (state) => state.auth
)
async function handlelogin(username , password){
try{
dispatch(authStart())
const  res = await login(username , password)
dispatch(authSuccess(res))
return res

}
catch(err){
  dispatch(
        authFailure(
          err.response?.data?.message ||"Login failed"
        ))
}

}
async function handleregister(username ,email , password ){
try{
  dispatch(authStart())
    const res = await register(username , email , password)
  dispatch(authSuccess(res))
return res
  
}
catch(err){
      dispatch(
        authFailure(
          err.response?.data?.message || "register failed"
        ))
}
}
async function handlegetme(){
  try {
    dispatch(authStart())
    const res = await getme()
    
    // AGAR aapka backend { user: {...} } bhejta hai toh res.user sahi hai.
    // LEKIN agar backend direct user data bhejta hai, toh sirf res likho:
    dispatch(authSuccess(res.user || res)) 
    
    return res;
  }
  catch(err){
    dispatch(authFailure(err.response?.data?.message || "extract failed"))
  }
}




return {
handlelogin , handleregister , ... auth , handlegetme
};
    
}









