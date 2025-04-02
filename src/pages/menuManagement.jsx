import React, { useState , useEffect, useRef } from "react";
import { API_LOCATION } from "../../config";
import axios from "axios";
import "../styles/menuManagement.css";
import Edit from "../components/edit";

export default function MenuManagement({displayMenu, SocketIO, store_name, onclose, user_id, update_food_quantity, menu}) {
   
    const [displayEdit, setDisplayEdit] = useState(false)
    const [new_food_quantity, setFood_Quantity] = useState("");
    const [food, setFood] = useState([])

    if(!displayMenu) return null

    function Handle_Update_Food(food_id, food_name, quantity){
        let data = {
            "Store_name": store_name,
            "Food_id": food_id,
            "Food_name": food_name,
            "Quantity": new_food_quantity,
            "User_id": user_id
        }
        SocketIO.current.emit("update_food_quantity", data)
        document.getElementById("input").value = ''; 
        
        
    }

    async function HandleGetFoodByMenu(menu_id, menu_name, store_name) {
        try {
            const response = await axios.post(`${API_LOCATION}/foodList/api`, {
                Store_name: store_name,
                Menu_id: menu_id,
                Menu_name: menu_name,
            });
            
            console.log(response?.data?.data); 
            setFood(response?.data?.data)
            setDisplayEdit(true)
        } catch (error) {
            console.error('Error:', error);  
        }
    }
    
 
    return (
        <div className="menu_page_Container">
            <div className="menu_page_right_section">
                <button className="close_btn" onClick={()=> onclose()}>X</button>
                <h2>Menu Management</h2>
                { menu.map((item, index)=>(
                    <div className="menu_Container" key={item.Menu_id}>
                        <button className="menu_button" onClick={()=> HandleGetFoodByMenu(item.Menu_id, item.Menu_name, item.Store_name)}>{item.Menu_name}</button>
                    </div>
                ))}

                <table className="food_table">
                <thead>
                    <tr>
                        <th>Food</th>
                        <th>Quantity</th>
                        <th>Input</th>
                        <th>Update</th>
                    </tr>
                </thead>
                <tbody>
                    { update_food_quantity.map((item, index)=>(
                    <tr key={item.id}>
                        <td>{item.Food_name}</td>
                        <td>{`(${item.Quantity}x)`}</td>
                        <td>
                            <input type="text" id="input"  className="quantity_input" onChange={(e)=> setFood_Quantity(e.target.value)} />
                        </td>
                        <td>
                            <button onClick={()=> Handle_Update_Food(item.Food_id, item.Food_name, item.Quantity)}>Update</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            <div className="edit_Containers">
                {displayEdit &&
                    <Edit 
                        title={"Edit Menu"} 
                        data={food}
                        onclose={()=> setDisplayEdit(false)}
                    />
                }
            </div>
        </div>
    )

}


