import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { API_LOCATION, SOCKETIO_LOCATION, socketConfig } from "../../config";
import { useLocation } from "react-router-dom";
import Header from "../components/header";
import LiveOrders from "./liveOrder";
import MenuPage from "./menu";
import "../styles/home.css"




export default function Home(){

    const location = useLocation();
    const userData = location.state;
    const [storeState, setStoreState] = useState(true);
    const [displayMenu, setDisplayMenu] = useState(false)

    const SocketIO = useRef(null)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))

    useEffect(()=>{
        
        console.log("User login: ", userData)
        console.log(user)
        if(!SocketIO.current){
            SocketIO.current = io(SOCKETIO_LOCATION);
            console.log(SocketIO.current.id)

            SocketIO.current.on('connect', ()=>{
                SocketIO.current.emit("connection", {Socket_id: SocketIO.current.id, User: Object.keys(user).length > 0 ? user : userData});
                SocketIO.current.emit(socketConfig.updateStoreState, {Store: user, State: storeState})
            })
        }


    },[])



    return(
        <div className="homeContainer">
            <Header SocketIO={SocketIO} user={userData} displayMenu={()=> setDisplayMenu(true)} displayLiveOrder={()=> setDisplayMenu(false)}/>
            {!displayMenu ?
                <LiveOrders userData={user} SocketIO={SocketIO}/>  
                :
                <MenuPage SocketIO={SocketIO}/>
            }
        </div>
    )
}