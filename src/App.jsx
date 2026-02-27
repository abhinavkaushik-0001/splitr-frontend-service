import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
function App() {
  const router = createBrowserRouter([
    {path: '/', element: <Home />},
    {path: '/signup', element: <SignUp />},
    {path: '/login', element: <Login />}
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
