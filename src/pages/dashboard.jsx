
import React, { useState , useEffect, useRef } from "react";
import {io} from 'socket.io-client'
import {API_LOCATION, SOCKETIO_LOCATION} from '../../config'
import axios from "axios";
import { useLocation } from "react-router-dom";
import MenuManagement from "./menuManagement";
import Header  from "../components/header";
import "../styles/dashboard.css";

export default function StoreDashboard() {
    const location = useLocation();
    const SocketIO = useRef(null)
    const [time, setTime] = useState(new Date());

    const [user_id, setUser_id] = useState(sessionStorage.getItem("User_id") != "" ? sessionStorage.getItem("User_id") : location?.state?.user_id );
    const [store_name, setStore_name] = useState(sessionStorage.getItem("Store_name") != "" ? sessionStorage.getItem("Store_name") : location?.state?.store_name);
    const [email, setEmail] = useState(sessionStorage.getItem("Email") != "" ? sessionStorage.getItem("Email") : location?.state?.email);
    
    const [store_status, setStore_status] = useState();
    const [orders, setOrders] = useState([]);
    const [displayMenu, setDisplayMenu] = useState(false);
    const [update_food_quantity, setUpdate_food_quantity] = useState([]);
    const [menu, setMenu] = useState([]);

    useEffect(()=>{
        /*
        SocketIO.current = io(SOCKETIO_LOCATION);
        console.log(SocketIO.current.id)

        SocketIO.current.on('connect', ()=>{
            SocketIO.current.emit("connection", {Socket_id: SocketIO.current.id, User_id: user_id, Store_name: store_name})
        })

        SocketIO.current.on('user.newOrderHandler.1', (order)=>{
            alert('getORder')
            setOrders((preorders)=>[...preorders, order[0]])
            for(let i = 0; i < order.length; i++){
                SocketIO.current.emit('confirm_received_order', {Order_id: order[i]["Order_id"], Sender_id: order[i]["User_id"]})
            }
            console.log("get new order from socketio")
        })

        //// Get the update order after accept order
        SocketIO.current.on('update_order', (order)=>{
            let order_id = order["Order_id"]
            // delete the order that has order number
            setOrders((prevorders) =>
                prevorders.filter((order) => order.Order_id !== order_id) 
              );
            // add a new update order to the list:
            setOrders((preorders)=>[...preorders, order])
        });

        // Handle Disconnect Socketio from Server
        SocketIO.current.on('disconnect', (reason) => {
           console.log('disconnect to SocketIO', reason)
        });

        SocketIO.current.on('update_Store_status', (data)=>{
            setStore_status(data["Status"])
        });

        SocketIO.current.on('update_food_quantity', (data)=>{
            setUpdate_food_quantity(data)
        });
        */
    },[])

    let date = time.getFullYear() + '-' + 
    String(time.getMonth() + 1).padStart(2, '0') + '-' + 
    String(time.getDate()).padStart(2, '0'); // Format the date as YYYY-MM-DD

    // Display live Time in Dashboard
    useEffect(() => {
        const timerId = setInterval(() => {
        setTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };
    

    useEffect(()=> {
        try{

            axios.post(`${API_LOCATION}/menu/api`,{
                Store_name: store_name,
                User_id: user_id
            })
            .then(respose =>{
                console.log(respose?.message);
                setMenu(respose?.data?.data)
            });

            axios.post(`${API_LOCATION}/foodList/api`,{
                Request : true,
                Store_name: store_name
            })
            .then(res =>{
                console.log(res?.data?.message);
                setUpdate_food_quantity(res?.data?.data)
            });

            axios.post(`${API_LOCATION}/get_today_order/api`,{
                Date: date, 
                User_id: user_id, 
                Store_name: store_name
            })
            .then(res =>{
                console.log(res?.data?.message);
                //setOrders(res?.data?.data)
            })
        }
        catch(error){
            console.log(error)
        }
    },[])


    function Handle_Close_Store(){
        SocketIO.current.emit('close_store',{
            User_id : user_id
        })
    };

    function handleAccept(order_id, sender_id){
        SocketIO.current.emit('accept_order', {
            Order_id: order_id,
            Sender_id: sender_id
        })     
    };

    function handleCancel(order_id, sender_id){
        SocketIO.current.emit('decline_order', {
            Order_id: order_id,
            Sender_id: sender_id
        })   
    };


    return (
    <>
        <Header displayMenu={()=> setDisplayMenu(true)} store_name={store_name} user_id={user_id} email={email}/>
        <main className="main-container">
            <header className="dashboard_header">
                <div>
                    <h1>{store_name}</h1>
                    {   store_status == 1
                        ?<p className="store_status" >Status: <span style={{color:'green'}}>Open</span></p>
                        :<p className="store_status">Status: <span style={{color:'red'}}>Close</span></p>

                    }
                    <h3>Today: {date}</h3>
                </div>

                <div>
                    <h2>{formatTime(time)}</h2>
                </div>
                
                <div className="button_Container">
                    <button className="close_store_button" onClick={Handle_Close_Store}>Close Store</button>
                </div>
            </header>

            <div className="table-container">
                <table className="table">
                <thead>
                    <tr>
                    <th>Sender</th>
                    <th>Food Name</th>
                    <th>Drink</th>
                    <th>Order At</th>
                    <th>PickUp Time</th>
                    <th className="text-right">Total Price</th>
                    <th>Order ID</th>
                    <th>Order Status</th>
                    <th>UserID</th>
                    <th className="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                    <tr>
                        <td>{order.Username}</td>
                        <td>
                            <div>
                                {JSON.parse(order.Food_item).map((food, index)=>(
                                    <span key={index}> {food.Food_name}({food.Food_Quantity}x) </span>
                                ))}
                            </div>
                        </td>

                        <td>
                            <div>
                                {JSON.parse(order.Drink_item).map((drink, id)=>(
                                    <span key={id}> {drink.Drink} ({drink.Drink_quantity}x) </span>
                                ))}
                            </div>
                        </td>
                        <td>{new Date(order.Created_at).toLocaleDateString()}</td>
                        <td>{order.Pickup_time}</td>
                        <td className="text-right">{order.Total_price} Kr</td>
                        <td>{order.Order_id}</td>
                        <td>{order.Order_status}</td>
                        <td>{order.User_id}</td>
                        <td>
                        <div className="actions">
                            <button
                            onClick={() => handleAccept(order.Order_id, order.User_id)}
                            className="button accept"
                            >
                            Accept
                            </button>
                            <button
                            onClick={() =>  handleCancel(order.Order_id, order.User_id)}
                            className="button cancel"
                            >
                            Decline
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </main>
        <MenuManagement displayMenu={displayMenu} SocketIO={SocketIO} store_name={store_name} onclose={()=> setDisplayMenu(false)} user_id={user_id} update_food_quantity={update_food_quantity} menu={menu}/>
    </>
    );
    }


