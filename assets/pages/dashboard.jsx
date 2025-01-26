import { useState, useEffect } from "react";
import {io} from 'socket.io-client'
import '../../style_css/dashboard.css'




export default function DashBoard(){

    const [store_name, setStore_name] = useState('Sota Sushi')
    const [socketid, setSocketid] = useState()

    const [message, setMessage] = useState([])

    useEffect(()=>{
        const socket = io('http://localhost:3001')
        socket.on('connect', ()=>{
            setSocketid(socket.id)
            socket.emit('connected', `Connection From web: ${socket.id}`)
        })

        socket.on('order', (order)=>{
            alert('got order')
            setMessage(order)
        })
        

    },[])
    

    return(
        <div>
            <h1>Store Name: {store_name} </h1>
            <h3>SocketId: {socketid}</h3>

            {message.map(item =>(
                item.Store_name
            ))

            }
        </div>
    );

}