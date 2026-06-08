import React, { useEffect } from 'react'
import Home from './features/Home'
import Homecomponent from './components/Homecomponent'
import Navbar from './components/Navbar'
import { Provider } from 'react-redux'
import { store } from './features/redux/Auth.store'
import { RouterProvider } from 'react-router'
import { router } from './app.route'
import { useauth } from './features/pages/hooks/use.auth'


const App = () => {
const { handlegetme } = useauth() 

  useEffect(() => {
    handlegetme()
  }, []) 
  return (


<RouterProvider router={router}/>
  
  )
}

export default App
