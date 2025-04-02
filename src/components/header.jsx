import React from "react";
import { Home, Settings, Menu, Palette, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css"

export default function Header({displayMenu, store_name, user_id, email}) {
    const navigate = useNavigate()
    
    const handleNavigationCustomize = (e) => {
        e.preventDefault(); 
        navigate('/Customize', { state: {store_name, email, user_id} });
      };
    return (
        <header className="header-container">
        <div className="header-inner">
            {/* Logo Section */}
            <div className="header-logo">
            <span className="header-logo-text">Logo</span>
            </div>
            
            {/* Navigation Section */}
            <nav className="header-nav">
            <a href="#" className="header-nav-link" onClick={()=> navigate('/Dashboard')}>
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
