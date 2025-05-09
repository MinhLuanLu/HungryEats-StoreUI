import React from "react";
import { useState, useEffect, useContext } from "react";
import { Home, Settings, Menu, Palette, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { socketConfig } from "../../config";
import "../styles/header.css";
import { SocketContext } from "../context/socketContext";



export default function Header({SocketIO}) {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))
    const [storeState, setStoreState] = useState(true);
    const { PublicSocketIO, setPublicSocketIO } = useContext(SocketContext);
   
    const handleNavigationCustomize = (e) => {
        e.preventDefault(); 
      };

    function changeStoreState(){
        if(storeState){
            setStoreState(false)
        }else{
            setStoreState(true)
        }

        console.log(user)

        SocketIO.current.emit(socketConfig.updateStoreState, {Store: user, State: !storeState})
    }

    function handleSetSocketIO(){
        if(SocketIO){
            setPublicSocketIO(SocketIO)
        }
    }
    
    
    return (
        <header className="header-container">
        <button onClick={()=> changeStoreState()}>Close</button>
        <div className="header-inner">
            {/* Logo Section */}
            <div className="header-logo">
            <span className="header-logo-text">Logo</span>
            </div>
            
            {/* Navigation Section */}
            <nav className="header-nav">
            <a href="#" className="header-nav-link" onClick={()=> {navigate("/Home")}}>
                <Home size={18} />
                <span>Dashboard</span>
            </a>
            <a href="#" className="header-nav-link" onClick={()=> {navigate("/MenuPage"), handleSetSocketIO()}}>
                <Menu size={18} />
                <span>Menu</span>
            </a>
            <a href="#" className="header-nav-link" onClick={()=> {navigate("/Customize"), handleSetSocketIO()}}>
                <Palette size={18} />
                <span>Customize</span>
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
