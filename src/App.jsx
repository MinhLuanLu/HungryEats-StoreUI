import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import Customize from './pages/customize';
import MenuPage from './pages/menu';
import { SocketProvider } from './context/socketContext';

import Home from './pages/home';

function App() {

  return (
    <>
    <SocketProvider>
        <BrowserRouter>
          <Routes>
              <Route index element={<Login/>}/>
              <Route path='/Login' element={<Login/>} />
              <Route path='/Home' element={<Home/>}/>
              <Route path='/Customize' element={<Customize/>}/>
              <Route path='/MenuPage' element={<MenuPage/>}/>
          </Routes>
        </BrowserRouter>
    </SocketProvider>
    </>
  )
}

export default App
