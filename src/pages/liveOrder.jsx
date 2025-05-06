import React, { useEffect, useState } from "react";
import "../style-css/liveOrder.css"; // optional external CSS
import axios from "axios";
import { API_LOCATION } from "../../config";
import { orderStatusConfig } from "../../config";
import { socketConfig } from "../../config";



const OrderCard = ({ order, stage, AcceptPendingButton, DeclinePendingButton, AcceptReadyButton, removeOrderButton }) => {
  return (
    <div className="order">
      <span><strong>ID:</strong> #{order.Order_id}</span>
      <span><strong>Name:</strong> {order.Username}</span>
      {order.Food_item.map((food, index)=>(
        <span key={index}><strong>Order:</strong> {food.Food_name} ({food.Food_quantity}x)</span>
      ))}
      {order.Drink_item != undefined && order.Drink_item.map((drink, index)=>(
        <span key={index}>{drink.Drink_name} ({drink.Drink_quantity}x)</span>
      ))}
      <span><strong>Pickup:</strong> {order.Pickup_time}</span>
      <div className="buttons">
        {stage === orderStatusConfig.pending || stage === orderStatusConfig.unprocessing ? (
          <>
            <button className="accept" onClick={()=> AcceptPendingButton(order)}>Accept</button>
            <button className="decline" onClick={()=> DeclinePendingButton(order)}>Cancel</button>
          </>
        ) : null }
        {stage === orderStatusConfig.procesing && (
          <>
            <button className="accept" onClick={()=> AcceptReadyButton(order)}>Ready</button>
          </>
        )}
        {stage === orderStatusConfig.ready && (
          <button className="decline" onClick={()=> removeOrderButton(order)}>Remove</button>
        )}
      </div>
    </div>
  );
};


const LiveOrders = ({userData, SocketIO}) => {

  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(userData)

  useEffect(() => {
    if (SocketIO.current) {
      const handleNewOrder = (order) => {
        console.log(order);
        setOrders((prevOrders) => [...prevOrders, order]);
    
        setTimeout(() => {
          console.log("Send received order confirm to server");
          SocketIO.current.emit(socketConfig.confirmRecivedOrder, order);
        }, 2000);
      };
  
      SocketIO.current.on(socketConfig.processOrder, handleNewOrder);
      return () => {
        SocketIO.current.off(socketConfig.processOrder, handleNewOrder);
      };
    }
  }, []);

  
  
  
 
  useEffect(()=>{
    async function recivedOrders() {
      try{
        const getOrder = await axios.get(`${API_LOCATION}/v1/store/orders/${userData ? userData.Store_id : user.Store_id}`);
        if(getOrder.data.success){
          console.log(getOrder.data.message);
          console.log(getOrder.data.data)
          setOrders(getOrder.data.data);
          return
        }
        console.log('No orders recived..')

      }catch(error){
        console.log(error)
      }
    }

    recivedOrders()
  },[userData])


  function AcceptPendingButton(order, request){
    let newOrderStatus; 
    
    if(request){
      newOrderStatus = order.Order_status = orderStatusConfig.procesing
      setOrders(prveOrder => 
        prveOrder.map(item =>
          item.Order_id == order.Order_id ? {...item, Order_status: orderStatusConfig.procesing} : item
        )
      )

      // emit order to user as procesing status//
      order.Order_status = orderStatusConfig.procesing
      SocketIO.current.emit(socketConfig.orderAction, order);
      //////////////////////////////////////////////////////
    }else{
      newOrderStatus = order.Order_status = orderStatusConfig.cancle;
      setOrders(prevData => prevData.filter(item => item.Order_id !== order.Order_id));

      // emit order to user as cancle status//
      order.Order_status = orderStatusConfig.cancle
      SocketIO.current.emit(socketConfig.orderAction, order);
      //////////////////////////////////////////////////////
    }

    // update order in database
  }


  function AcceptReadyButton(order){
    let newOrderStatus
    newOrderStatus = order.Order_status = orderStatusConfig.ready;
      setOrders(prveOrder => 
        prveOrder.map(item =>
          item.Order_id == order.Order_id ? {...item, Order_status: orderStatusConfig.ready} : item
        )
    );

    // emit order to user as cancle status//
    order.Order_status = orderStatusConfig.ready
    SocketIO.current.emit(socketConfig.orderAction, order);
    //////////////////////////////////////////////////////
  }


  function removeOrderButton(order){
    let newOrderStatus
    newOrderStatus = order.Order_status = orderStatusConfig.done
      setOrders(prveOrder => 
        prveOrder.map(item =>
          item.Order_id == order.Order_id ? {...item, Order_status: orderStatusConfig.done} : item
        )
    )
    
    // emit order to user as cancle status//
    order.Order_status = orderStatusConfig.done
    SocketIO.current.emit(socketConfig.orderAction, order);
    //////////////////////////////////////////////////////
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f3f3f3", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "20px" }}>Order Display</h1>
      <div className="container">
        <div className="column">
          <h2>Pending</h2>
          {orders.length != 0 &&  orders.map((order, idx) => (
            order.Order_status == orderStatusConfig.pending || order.Order_status == orderStatusConfig.unprocessing ? <OrderCard key={idx} order={order} stage={order.Order_status} AcceptPendingButton={()=> AcceptPendingButton(order, true)} DeclinePendingButton={()=> AcceptPendingButton(order, false)}/>  : null
          ))}
        </div>
        <div className="column">
          <h2>In Progress</h2>
          {orders.map((order, idx) => (
            order.Order_status == orderStatusConfig.procesing && <OrderCard key={idx} order={order} stage={order.Order_status} AcceptReadyButton={()=> AcceptReadyButton(order)} />
          ))}
        </div>
        <div className="column">
          <h2>Ready</h2>
          {orders.map((order, idx) => (
            order.Order_status == orderStatusConfig.ready && <OrderCard key={idx} order={order} stage={order.Order_status} removeOrderButton={()=> removeOrderButton(order)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveOrders;
