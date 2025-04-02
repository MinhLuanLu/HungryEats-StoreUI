import React, { useState , useEffect, useRef } from "react";

import "../styles/edit.css" 


export default function Edit({title,data, onclose}) {
    const [edit, setEdit] = useState(false);
    const [foodName, setFoodName] = useState();
    const [foodDescription, setFoodDescription] = useState();
 
    return (
        <div className="eidt_Container">
            <div className="edit_right_section">
                <button className="close_btn" onClick={()=> onclose()}>X</button>
                <h2>{title}</h2>

                <table className="edit_table">
                <thead>
                    <tr>
                        <th>Food</th>
                        <th>Food description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    { data.map((item, index)=>(
                    <tr key={item.id}>
                        <td>
                            {item.Food_name}
                        </td>
                        <td>
                            {item.Food_description}
                        </td>
                        <td>
                            <button className="edit_button" onClick={()=> edit ? setEdit(false) : setEdit(true)}>{edit ? "Editing" : "Edit"}</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    )

}


