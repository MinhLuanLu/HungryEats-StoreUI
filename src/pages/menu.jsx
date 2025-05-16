import React from "react";
import { useState, useEffect , useContext} from "react";
import axios from "axios";
import Header from "../components/header";
import "../styles/menu.css";
import { API_LOCATION } from "../../config";
import { socketConfig } from "../../config";
import { SocketContext } from "../context/socketContext";
import NotificationMessage from "../components/notificationMessage";
import EditFood from "../components/editFood";
import { Button } from "semantic-ui-react";
import CreateFood from "../components/createFood";


function MenuPage() {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [menuFood, setMenuFood] = useState([]);
  const [selectFood, setSelectFood] = useState({})
  const [displayEditFood, setDisplayEditFood] = useState(false);
  const { PublicSocketIO, setPublicSocketIO } = useContext(SocketContext);
  const [saveChangeStatus, setSaveChangeStatus] = useState(false);
  const [displayCreateFood, setDisplayCreateFood] = useState(false)

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
    setDisplayEditFood(true)
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
    setDisplayEditFood(false)
  
    setTimeout(()=>{
      setSaveChangeStatus(false)
    },2500)
  }
  else{
    alert("Connection failed to again later!")
  }

}


  function HandelUploadFoodImage(food){
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

  return (
    <div>
      <div className="NotificationContainer">
          {saveChangeStatus ? <NotificationMessage message="Update successfully."/> : null}
      </div>
      <Header SocketIO={PublicSocketIO}/>
      <div className="menu-container">
        <h1 className="menu-title">Your Menu</h1>
        <div style={{width:'100%',display:'flex', flexDirection:'row', justifyContent:'right'}}>
          <Button content='Create food' secondary onClick={()=> setDisplayCreateFood(true)} />
        </div>
        {menuFood.map((item, index) => (
          <div key={index} className="menu-section">
            <h2 className="menu-category">{item.Menu_name}</h2>
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
        
      <div className="food-Container">
          <EditFood open={displayEditFood} foodData={selectFood} onclose={()=> setDisplayEditFood(false)} saveChange={(food)=> saveChangeHandler(food)} uploadImage={(food)=> HandelUploadFoodImage(food)}/>
          <CreateFood open={displayCreateFood} onclose={() => setDisplayCreateFood(false)}/>
      </div>
      </div>
    </div>
    );
    
}

export default MenuPage;
