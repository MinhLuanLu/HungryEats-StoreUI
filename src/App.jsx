import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider } from './context/user_Context'
import Login from './pages/login'
import StoreDashboard from './pages/dashboard'

function App() {

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
              <Route index element={<Login/>}/>
              <Route path='/Login' element={<Login/>} />
              <Route path='/DashBoard' element={<StoreDashboard/>}/>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
