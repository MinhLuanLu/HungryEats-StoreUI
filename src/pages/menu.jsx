
import React, { useState , useEffect, useRef } from "react";
import "../style_css/menu.css" 

export default function Menu({display_menu, SocketIO, store_name, onclose, user_id, update_food_quantity}) {
   
    const [food_list, setFood_List] = useState([])
    const [food_quantity, setFood_Quantity] = useState("")

    


    if(!display_menu) return null



    function Handle_Update_Food(food_id, food_name, quantity){
        let data = {
            "Store_name": store_name,
            "Food_id": food_id,
            "Food_name": food_name,
            "Quantity": food_quantity,
            "User_id": user_id
        }
        SocketIO.current.emit("update_food_quantity", data)
        document.getElementById("input").value = ''; 
        
        
    }

 
    return (
        <div className="menu_Container">
            <div className="menu_right_section">
                <button className="close_btn" onClick={()=> onclose()}>X</button>
                <h2>Menu Management</h2>
                <table className="menu_table">
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
        </div>
    )

}


