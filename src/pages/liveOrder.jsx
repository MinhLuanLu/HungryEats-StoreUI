import React, { useEffect, useState , useRef} from "react";
import "../styles/liveOrder.css"; // optional external CSS
import axios from "axios";
import { API_LOCATION } from "../../config";
import { orderStatusConfig } from "../../config";
import { socketConfig } from "../../config";
import NotificationMessage from "../components/notificationMessage";
import sound from "../assets/audio/orderSound.mp3"
import OrderCard from "../components/orderCard";
import { Header } from "semantic-ui-react";


const LiveOrders = ({userData, SocketIO}) => {

  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(userData);
  const [newOrderEvent, setNewOrderEvent] = useState(false)


  useEffect(() => {
    if (SocketIO.current) {
      const handleNewOrder = (order) => {
        console.log(order);
        setNewOrderEvent(true)
        handlePlay()
        setOrders((prevOrders) => [order, ...prevOrders]);
  
        setTimeout(() => {
          console.log("Send received order confirm to server");
          SocketIO.current.emit(socketConfig.confirmRecivedOrder, order);
          setNewOrderEvent(false)
        }, 2500);
        
      };
  
      SocketIO.current.on(socketConfig.processOrder, handleNewOrder);
      return () => {
        SocketIO.current.off(socketConfig.processOrder, handleNewOrder);
      };
    }
  }, []);

  
  const handlePlay = () => {
    new Audio(sound).play()
  };
  
 
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
    <>
      <div className="NotificationContainer">
          {newOrderEvent ? <NotificationMessage message="New order recived"/> : null}
      </div>
      <div style={{ padding: "20px", backgroundColor: "#f3f3f3", minHeight: "100vh", fontFamily: "sans-serif", marginTop:"50px"}}>
        <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "20px" }}>Order Display</h1>
        <div className="container">
          <div className="column">
            <Header as='h2' dividing>
              Pending
            </Header>
            {orders.length != 0 &&  orders.map((order, idx) => (
              order.Order_status == orderStatusConfig.pending || order.Order_status == orderStatusConfig.unprocessing ? <OrderCard key={idx} order={order} stage={order.Order_status} AcceptPendingButton={()=> AcceptPendingButton(order, true)} DeclinePendingButton={()=> AcceptPendingButton(order, false)}/>  : null
            ))}
          </div>
          <div className="column">
            <Header as='h2' dividing>
              In Progress
            </Header>
            {orders.map((order, idx) => (
              order.Order_status == orderStatusConfig.procesing && <OrderCard key={idx} order={order} stage={order.Order_status} AcceptReadyButton={()=> AcceptReadyButton(order)} />
            ))}
          </div>
          <div className="column">
            <Header as='h2' dividing>
              Ready
            </Header>
            {orders.map((order, idx) => (
              order.Order_status == orderStatusConfig.ready && <OrderCard key={idx} order={order} stage={order.Order_status} removeOrderButton={()=> removeOrderButton(order)} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveOrders;
