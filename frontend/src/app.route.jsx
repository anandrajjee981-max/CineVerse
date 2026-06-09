import { createBrowserRouter } from "react-router-dom"
import Home from "./features/Home"
import TrailerFeed from "./features/movies/Trailer.feed"
import Category from "./features/movies/Category"
import Search from "./features/movies/Search"
import Login from "./features/pages/Login"
import Register from "./features/pages/Register"
import Save from "./features/save/Save"
import Protected from "./Protected"




export const router = createBrowserRouter([
{
    path : "/home",
    element :<Protected><Home/></Protected>                
}
,
{
    path : "/trailer",
    element : <TrailerFeed/>
},
{
    path:'/category',
    element : <Category/>
},
{
    path:'/search',
    element:<Search/>
},
{
    path:'/',
    element:<Login/>
},
{
    path:'/register',
    element: <Register/>
},
{
    path : '/save' ,
    element : <Save/>
}


])