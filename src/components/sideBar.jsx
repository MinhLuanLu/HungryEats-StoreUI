import React from "react";
import '../style-css/sideBar.css'
import { useEffect, useState } from "react";
import {currentDateTime} from '../../dateTime';



import homeIcon from '../assets/icons/home.png';
import ordersIcon from '../assets/icons/orders.png';
import productIcon from '../assets/icons/product.png';
import salesIcon from '../assets/icons/sales.png';
import moreIcon from '../assets/icons/more.png';
import openIcon from '../assets/icons/open.png';
import closeIcon from '../assets/icons/closed.png';


const Sidebar = () => {

    const [storeState, setStoreState] = useState(true)


  return (
    <div className="sideBar">
      <div className="titleContainer">
        <img src={storeState ? openIcon : closeIcon} className="icon" width="50" height="50" alt="store state" />
        <p className="title">{currentDateTime()}</p>
      </div>
      <div className="titleContainer">
        <img src={homeIcon} className="icon" width="20" height="20" alt="home" />
        <p className="title">Home</p>
      </div>
      <div className="titleContainer">
        <img src={ordersIcon} className="icon" width="20" height="20" alt="menu" />
        <p className="title">Menu</p>
      </div>
      <div className="titleContainer">
        <img src={productIcon} className="icon" width="20" height="20" alt="products" />
        <p className="title">Products</p>
      </div>
      <div className="titleContainer">
        <img src={salesIcon} className="icon" width="20" height="20" alt="sales" />
        <p className="title">Sales</p>
      </div>
      <div className="titleContainer">
        <img src={moreIcon} className="icon" width="20" height="20" alt="more" />
        <p className="title">More</p>
      </div>
    </div>
  );
};

export default Sidebar;
