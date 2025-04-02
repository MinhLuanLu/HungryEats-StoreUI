import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider } from './context/user_Context'
import Login from './pages/login'
import Customize from './pages/customize';

import Home from './pages/home';

function App() {

  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
              <Route index element={<Login/>}/>
              <Route path='/Login' element={<Login/>} />
              <Route path='/Home' element={<Home/>}/>
              <Route path='/Customize' element={<Customize/>}/>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </>
  )
}

export default App
