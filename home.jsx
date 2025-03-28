import { useState, useEffect } from "react";
import '../style_css/home.css'




export default function Home(){

    return(
        <div className="homeContainer">
            <div className="sideBar">
                <div className="titleContainer">
                    <p>Home</p>
                </div>
                <div className="titleContainer">
                    <p>Products</p>
                </div>
                <div className="titleContainer">
                    <p>Orders</p>
                </div>
                <div className="titleContainer">
                    <p>Sales</p>
                </div>
                <div className="titleContainer">
                    <p>More</p>
                </div>
            </div>
            <div className="mainPage">
                <div className="orderHeader">
                    <h1>Order</h1>
                    <div>
                        <p>search</p>
                        <button>setting</button>
                    </div>
                </div>
                <div className="orderField">
                    <div>
                        <p>email</p>
                    </div>
                    <div>
                        <p>Tlf</p>
                    </div>
                    <div>
                        <p>info</p>
                    </div>
                    <div>
                        <p>Pickup_time</p>
                    </div>
                    <div>
                        <p>orderNr</p>
                    </div>
                    <div>
                        <button>Cancel</button>
                    </div>    
                    <div>
                        <button>Accept</button>
                    </div>  
                </div>        
            </div>
        </div>
    )
}