import React from "react";
import { useState, useEffect , useContext} from "react";
import axios from "axios";
import Header from "../components/header";
import "../styles/menu.css";
import { API_LOCATION } from "../../config";
import { useNavigate } from "react-router-dom";
import { socketConfig } from "../../config";
import Food from "./food";
import { SocketContext } from "../context/socketContext";
import NotificationMessage from "../components/notificationMessage";


function MenuPage() {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [menuFood, setMenuFood] = useState([]);
  const [selectFood, setSelectFood] = useState({})
  const [displayFoodDetail, setDisplayFoodDetaile] = useState(false);
  const { PublicSocketIO, setPublicSocketIO } = useContext(SocketContext);
  const [saveChangeStatus, setSaveChangeStatus] = useState(false)

  useEffect(()=>{
    async function getMenuFood() {
      try{
        const getMenuFood = await axios.get(`${API_LOCATION}/v1/store/menufood/${user.Store_id}`);
        if(getMenuFood.data.success){
          console.log(getMenuFood.data.message);
          setMenuFood(getMenuFood.data.data);
          console.log(getMenuFood.data.data)
  
        }
  
      }catch(error){
        console.log(error)
      }
    }
    getMenuFood()
  },[])


  function handleEditFood(food){
    console.log(food)
    setDisplayFoodDetaile(true)
    setSelectFood(food)
  }


  function saveChangeHandler(food) {
  console.log("Food data updated:", food);
  if(PublicSocketIO.current){
    PublicSocketIO.current.emit(socketConfig.updateFoodData, {Food: food})
    setSaveChangeStatus(true);

    const updatedMenuFood = menuFood.map(menu => {
      return {
        ...menu,
        Food: menu.Food.map(item =>
          item.Food_id === food.Food_id ? { ...food } : item
        )
      };
    });
  
    setMenuFood(updatedMenuFood);
  
    setTimeout(()=>{
      setSaveChangeStatus(false)
    },2500)
  }
  else{
    alert("Connection failed to again later!")
  }

}

  

  return (
    <div>
      <div className="NotificationContainer">
          {saveChangeStatus ? <NotificationMessage message="Update successfully."/> : null}
      </div>
      <Header SocketIO={PublicSocketIO}/>
      <div className="menu-container">
        <h1 className="menu-title">Our Menu</h1>
        <input type="text" placeholder="Search menu..."/>
        {menuFood.map((item, index) => (
          <div key={index} className="menu-section">
            <h2 className="menu-category">{item.Menu_name}</h2>
            <p>{}</p>
            <div className="food-list">
              { item.Food.map((food, Findex)=>(
                <div key={Findex} className="food-item" onClick={()=> handleEditFood(food)}>
                  {<img src={food.Food_image} alt={food.name} className="food-image" />}
                  <div className="food-details">
                    <p className="food-name">{food.Food_name}</p>
                    <span className="food-quantity">({food.Quantity}X)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {displayFoodDetail ?
        <div className="food-Container">
          <Food foodData={selectFood} onclose={()=> setDisplayFoodDetaile(false)} saveChange={(food)=> saveChangeHandler(food)}/>
        </div>
        :
        null
      }
      </div>
    </div>
    );
    
}

export default MenuPage;
