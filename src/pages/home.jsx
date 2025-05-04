import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { API_LOCATION, SOCKETIO_LOCATION, socketConfig } from "../../config";
import { useLocation } from "react-router-dom";
import Header from "../components/header";
import LiveOrders from "./liveOrder";
import MenuPage from "./menu";




export default function Home(){

    const location = useLocation();
    const userData = location.state;
    const [storeState, setStoreState] = useState(true);

    const SocketIO = useRef(null)
    const [user, setUser] = useState({})

    useEffect(()=>{
        setUser(userData)
        console.log(userData)
        if(!SocketIO.current){
            SocketIO.current = io(SOCKETIO_LOCATION);
            console.log(SocketIO.current.id)

            SocketIO.current.on('connect', ()=>{
                SocketIO.current.emit("connection", {Socket_id: SocketIO.current.id, User: Object.keys(user).length > 0 ? User : userData});
                SocketIO.current.emit(socketConfig.updateStoreState, {Store: userData, State: storeState})
            })
        }


    },[])



    return(
        <div className="homeContainer">
            <Header SocketIO={SocketIO} user={user}/>
            <LiveOrders userData={userData} SocketIO={SocketIO}/>  
        </div>
    )
}