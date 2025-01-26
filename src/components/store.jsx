import { useState } from "react";
import '../style_css/store.css'
import { Link } from "react-router-dom";

export default function Store({store_name, store_description, user_id}){

    return(
        <div className="launch_Page_Container">
            <Link to={'/DashBoard'} className="store_info_Container">
                <button className="store_info_Container">
                    <h3 className="Store_name">{store_name}</h3>
                    <p>{store_description}</p>
                </button>
            </Link>
        </div>
    )
}