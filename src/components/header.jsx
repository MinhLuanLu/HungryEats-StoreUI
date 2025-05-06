import React from "react";
import { useState, useEffect } from "react";
import { Home, Settings, Menu, Palette, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { socketConfig } from "../../config";
import "../styles/header.css"
import MenuPage from "../pages/menu";

export default function Header({SocketIO, user, displayMenu, displayLiveOrder}) {
    const navigate = useNavigate();
    const [storeState, setStoreState] = useState(true);
   
    const handleNavigationCustomize = (e) => {
        e.preventDefault(); 
      };

    function changeStoreState(){
        if(storeState){
            setStoreState(false)
        }else{
            setStoreState(true)
        }

        SocketIO.current.emit(socketConfig.updateStoreState, {Store: user, State: !storeState})
    }

    
    
    return (
        <header className="header-container">
        <div className="header-inner">
            {/* Logo Section */}
            <div onClick={()=> changeStoreState()}>Close</div>
            <div className="header-logo">
            <span className="header-logo-text">Logo</span>
            </div>
            
            {/* Navigation Section */}
            <nav className="header-nav">
            <a href="#" className="header-nav-link" onClick={()=> displayLiveOrder()}>
                <Home size={18} />
                <span>Dashboard</span>
            </a>
            <a href="#" className="header-nav-link" onClick={handleNavigationCustomize}>
                <Palette size={18} />
                <span>Customize</span>
            </a>
            <a href="#" className="header-nav-link" onClick={()=> displayMenu()}>
                <Menu size={18} />
                <span>Menu</span>
            </a>
            <a href="#" className="header-nav-link">
                <Settings size={18} />
                <span>Setting</span>
            </a>
            </nav>
            
            {/* Logout Section */}
            <button className="header-logout-btn" onClick={()=> navigate("/Login")}>
            <LogOut size={18} />
            <span>Logout</span>
            </button>
        </div>
        </header>
    );
}
