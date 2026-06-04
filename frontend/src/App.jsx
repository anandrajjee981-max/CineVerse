import React from 'react'
import Home from './features/Home'
import Homecomponent from './components/Homecomponent'
import Navbar from './components/Navbar'
import { Provider } from 'react-redux'
import { store } from './features/redux/Auth.store'
import { RouterProvider } from 'react-router'
import { router } from './app.route'

const App = () => {
  return (
   <Provider store={store}>

<RouterProvider router={router}/>
   </Provider>
  )
}

export default App
