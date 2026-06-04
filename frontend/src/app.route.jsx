import { createBrowserRouter } from "react-router"
import Home from "./features/Home"
import TrailerFeed from "./features/movies/Trailer.feed"




export const router = createBrowserRouter([
{
    path : "/",
    element : <Home/>
}
,
{
    path : "/trailer",
    element : <TrailerFeed/>
}


])