import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { API_LOCATION, SOCKETIO_LOCATION, socketConfig } from "../../config";
import {currentDateTime} from '../../dateTime'
import { useLocation } from "react-router-dom";
import '../styles/home.css'


import homeIcon from '../assets/icons/home.png';
import ordersIcon from '../assets/icons/orders.png';
import productIcon from '../assets/icons/product.png';
import salesIcon from '../assets/icons/sales.png';
import moreIcon from '../assets/icons/more.png';
import settingIcon from '../assets/icons/settings.png';
import openIcon from '../assets/icons/open.png';
import closeIcon from '../assets/icons/closed.png';




export default function Home(){
    const location = useLocation();
    const SocketIO = useRef(null)
    const userData = location.state;
    const [storeState, setStoreState] = useState(true)
    const [menuList, setMenuList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [foodList, setFoodList] = useState([])
    const [user, setUser] = useState({})


    useEffect(()=>{
        setUser(userData)
        console.log(userData)
        getStoreInfo()
        if(!SocketIO.current){
            SocketIO.current = io(SOCKETIO_LOCATION);
            console.log(SocketIO.current.id)

            SocketIO.current.on('connect', ()=>{
                SocketIO.current.emit("connection", {Socket_id: SocketIO.current.id, User: Object.keys(user).length > 0 ? user : userData});
                SocketIO.current.emit(socketConfig.updateStoreState, {Store: userData, State: storeState})
            })

            SocketIO.current.on(socketConfig.processOrder, (order)=>{
                setOrderList((preOrder)=>[...preOrder, order]);
                
                
                setTimeout(() => {
                    console.log('Send recived confirm to server')
                    SocketIO.current.emit(socketConfig.confirmRecivedOrder, order)
                }, 2000);
                
            });
        }
    },[])

    useEffect(() =>{
        console.log(orderList)
    },[orderList])

    async function getStoreInfo() {
        try{

            await axios.post(`${API_LOCATION}/foodList/api`,{
                Request : true,
                Store_name: user.store_name
            })
            .then(res =>{
                console.log(res?.data?.message);
                setFoodList(res?.data?.data)
            });
        }
        catch(error){
            console.log(error)
        }
    }

    function changeStoreState(){
        if(storeState){
            setStoreState(false)
        }else{
            setStoreState(true)
        }

        SocketIO.current.emit(socketConfig.updateStoreState, {Store: user, State: !storeState})
    }

    
    return(
        <div className="homeContainer">
            <div className="sideBar">
                <div className="titleContainer">
                    <img src={storeState ? openIcon : closeIcon} className="icon" width='50' height="50" />
                    <p className="title">{currentDateTime()}</p>
                </div>
                <div className="titleContainer">
                    <img src={homeIcon} className="icon" width='20' height="20" />
                    <p className="title">Home</p>
                </div>
                <div className="titleContainer">
                    <img src={ordersIcon} className="icon" width='20' height="20" />
                    <p className="title">Menu</p>
                </div>
                <div className="titleContainer">
                    <img src={productIcon} className="icon" width='20' height="20"  />
                    <p className="title">Products</p>
                </div>
                <div className="titleContainer">
                    <img src={salesIcon} className="icon" width='20' height="20" />
                    <p className="title">Sales</p>
                </div>
                <div className="titleContainer">
                    <img src={moreIcon} className="icon" width='20' height="20" />
                    <p className="title">More</p>
                </div>
            </div>
            <div className="mainPage">
                <div className="orderHeader">
                    <h1 style={{marginLeft:'20px'}}>Orders</h1>
                    <div style={{display:"flex",flexDirection:'row', justifyContent:'flex-end', alignItems:'center', flex:1}}>
                        {storeState 
                        ?
                        <button onClick={()=> changeStoreState()} style={{height:'40px', width:'100px', backgroundColor:'red', color:'#ffffff'}}>Close Store</button>
                        :<button onClick={()=> changeStoreState()} style={{height:'40px', width:'100px', backgroundColor:'#008080', color:'#ffffff'}}>Open Store</button>
                        }
                        <div style={{margin:'10px',width:'40px', height:'40px', backgroundColor:'#E0E0E0', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', borderRadius:20}}>
                            <img src={settingIcon} alt="" width='20' height='20'/>
                        </div>
                    </div>
                </div>

                <div className="order-container">
                    <div className="order-header">
                        <div className="field"><p>Tlf</p></div>
                        <div className="field"><p>Food</p></div>
                        <div className="field"><p>Drink</p></div>
                        <div className="field"><p>pickup time</p></div>
                        <div className="field"><p>OrderID</p></div>
                        <div className="field"><p>Action</p></div>
                    </div>
                    
                    {orderList.map((item, index) => (
                        <div key={index} className="order-row">
                            <div className="field"><p>{item.User.Phone_number}</p></div>
                            <div className="field"><p>{item.food}</p></div>
                            <div className="field"><p>{item.drink}</p></div>
                            <div className="field"><p>{item.Pickup_time}</p></div>
                            <div className="field"><p>{item.Order_id}</p></div>
                            <div className="buttonField">
                                <button className="action-button">Accept</button>
                                <button className="action-button">Decline</button>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
            
        </div>
    )
}