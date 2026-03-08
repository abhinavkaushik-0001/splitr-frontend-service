import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import HeaderWrapper from './component/Header/HeaderWrapper'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from './pages/Home'
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HeaderWrapper />,
      children: [
        { index:true, element: <Landing /> },
        { path: '/signup', element: <SignUp /> },
        { path: '/login', element: <Login /> },
        { path: '/home', element: <Home /> }
      ]
    }

  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
