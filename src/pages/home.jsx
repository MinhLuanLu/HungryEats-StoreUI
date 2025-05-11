import { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { API_LOCATION, SOCKETIO_LOCATION, socketConfig } from "../../config";
import { useLocation } from "react-router-dom";
import Header from "../components/header";
import LiveOrders from "./liveOrder";
import "../styles/home.css";
import { SocketContext } from "../context/socketContext";




export default function Home(){

    const location = useLocation();
    const userData = location.state;


    const { PublicSocketIO, setPublicSocketIO } = useContext(SocketContext);

    const SocketIO = useRef(null)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")))

    useEffect(()=>{
        console.log("User login: ", userData)
        if(!SocketIO.current){
            SocketIO.current = io(SOCKETIO_LOCATION);
            console.log(SocketIO.current.id)

            SocketIO.current.on('connect', ()=>{
                SocketIO.current.emit("connection", {Socket_id: SocketIO.current.id, User: Object.keys(user).length > 0 ? user : userData});
                SocketIO.current.emit(socketConfig.updateStoreState, {Store: user, State: storeState})
            })

            setPublicSocketIO(SocketIO)
        }

    },[])



    return(
        <div>
            <Header SocketIO={SocketIO} user={userData}/>
            <LiveOrders userData={user} SocketIO={SocketIO}/>  
        </div>
    )
}