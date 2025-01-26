
import React, { useState , useEffect, useRef } from "react";
import {io} from 'socket.io-client'
import "../style_css/dashboard.css" 
import { data } from "react-router-dom";
import Menu from "./menu";

export default function StoreDashboard() {

    const SocketIO = useRef(null)
    const [time, setTime] = useState(new Date());

    const [user_id, setUser_id] = useState(sessionStorage.getItem("User_id"))
    const [store_name, setStore_name] = useState(sessionStorage.getItem("Store_name"))
    const [store_status, setStore_status] = useState()

    const [order_id, setOrderid] = useState(null)
    const [orders, setOrders] = useState([]);
    const [display_menu, setDisplay_menu] = useState(false)
    const [update_food_quantity, setUpdate_food_quantity] = useState([])

    useEffect(()=>{
        SocketIO.current = io(`http://localhost:3001`);

        console.log(SocketIO.current.id)

        SocketIO.current.on('connect', ()=>{
            SocketIO.current.emit("connection", {Socket_id: SocketIO.current.id, User_id: user_id, Store_name: store_name})
        })

        SocketIO.current.on('sending_order', (order)=>{
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
        })

        

        // Handle Disconnect Socketio from Server
        SocketIO.current.on('disconnect', (reason) => {
           console.log('disconnect to SocketIO')
          });

        SocketIO.current.on('update_Store_status', (data)=>{
            setStore_status(data["Status"])
        })

        SocketIO.current.on('update_food_quantity', (data)=>{
            setUpdate_food_quantity(data)
        })

    },[])

    useEffect(()=>{
            async function Handle_Get_Food(data) {
                await fetch(`http://localhost:3000/food_list/api`,{
                    method: 'POST',
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                .then(res=>{
                    if(res.ok){
                        return res.json().then(data=>{
                            if(data){
                                console.log(data.message)
                                setUpdate_food_quantity(data.food_list)
                            }
                        })
                    }
                    if(res === 400){
                        return res.json()
                    }
                })
                .catch(error=>{
                    console.error(error)
                })
            }    
    
            let data = {
                "Request": "Get_Food_List",
                "Store_Name": store_name
            }
    
    
            Handle_Get_Food(data)
           
        },[])

    useEffect(()=>{
        async function Handle_get_today_orders(date) {
            await fetch(`http://localhost:3000/get_today_order/api`,{
                method: 'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(date)
            })
            .then(res=>{
                if(res.ok){
                    return res.json().then(data=>{
                        if(data){
                            console.log(data.order_in_today)
                            setOrders(data.order_in_today)
                            //alert(data.message)
                        }
                    })
                }
                if(res === 400){
                    return res.json()
                }
            })
            .catch(error=>{
                console.error(error)
            })
        }    

        let date = time.getFullYear() + '-' + 
          String(time.getMonth() + 1).padStart(2, '0') + '-' + 
          String(time.getDate()).padStart(2, '0'); // Format the date as YYYY-MM-DD
        

        Handle_get_today_orders({"Date": date, "User_id": user_id, "Store_name": store_name})
    },[])


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
    
    
    let date = time.getFullYear() + '-' + 
      String(time.getMonth() + 1).padStart(2, '0') + '-' + 
      String(time.getDate()).padStart(2, '0'); // Format the date as YYYY-MM-DD



    function Handle_Close_Store(){
        SocketIO.current.emit('close_store',{User_id : user_id})
    }

    function handleAccept(order_id, sender_id){
        
        SocketIO.current.emit('accept_order', {
            Order_id: order_id,
            Sender_id: sender_id
        })     
    }

    function handleCancel(order_id, sender_id){
        SocketIO.current.emit('decline_order', {
            Order_id: order_id,
            Sender_id: sender_id
        })  
        
    }


    return (
    <>
        <main className="main-container">
            <header className="header">
                <div>
                <p>UserID: {user_id}</p>
                    <h1>{store_name}</h1>
                    {   store_status == 1
                        ?<p className="store_status" >Status: <span style={{color:'green'}}>Open</span></p>
                        :<p className="store_status">Status: <span style={{color:'red'}}>Close</span></p>

                    }
                    <h3>Today: {date}</h3>
                </div>

                <h2>{formatTime(time)}</h2>
                <div>
                    <button className="close_store_button" onClick={Handle_Close_Store}>Close Store</button>
                    <a href=""><p>History orders</p></a>
                    <button className="menu_btn" onClick={()=> setDisplay_menu(true)}>Menu</button>
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
        <Menu display_menu={display_menu} SocketIO={SocketIO} store_name={store_name} onclose={()=> setDisplay_menu(false)} user_id={user_id} update_food_quantity={update_food_quantity}/>
    </>
    );
    }


