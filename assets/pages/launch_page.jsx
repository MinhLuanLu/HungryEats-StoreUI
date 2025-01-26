import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../style_css/launch_page.css'

export default function Launch_Page({store_name,store_description }){

    return(
        <div className="launch_Page_Container">
            
            <Link to='/DashBoard'className="store_info_Container">
                <button className="store_info_Container">
                    <h2 className="Store_name">{store_name}</h2>
                    <p>{store_description}</p>
                </button>
            </Link>
        </div>
    )
}

