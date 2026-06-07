import { createBrowserRouter } from "react-router"
import Home from "./features/Home"
import TrailerFeed from "./features/movies/Trailer.feed"
import Category from "./features/movies/Category"
import Search from "./features/movies/Search"




export const router = createBrowserRouter([
{
    path : "/",
    element : <Home/>
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
}


])