// Updated JSX file
import React, { useState } from "react";
import { API_LOCATION } from "../../config";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Percent,
  Clock,
} from "lucide-react";
import "../styles/customize.css";
import { useNavigate, useLocation, data } from "react-router-dom";
import axios from "axios";


export default function Customize() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isDiscountOpen, setIsDiscountOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const [discountCode, setDiscountCode] = useState("")
    const [discount_value, setDiscount_value] = useState();
    const [purchase_count, setPurchase_count] = useState()

    const [email, setEmail] = useState(location?.state?.email);
    const [user_id, setUser_id] = useState(location?.state?.user_id);
    const [store_name, setStore_name] = useState(location?.state?.store_name);

    async function HandleDiscount(request) {
        try{
            const saveDiscount = await axios.post(`${API_LOCATION}/discounts/api`,{
                Store_name: store_name,
                User_id: user_id,
                Email: email,
                Discount_code: discountCode,
                Discount_type: "percentage",
                Discount_value:discount_value,
                Purchase_count: purchase_count,
                Request: request

            })
            if(saveDiscount?.data?.success){
                console.log(saveDiscount?.data);
            }
        }
        catch(error){
            console.debug(error)
        }
    }


    return (
        <div className="customize-container">
            <div className="customize-wrapper">
            <div className="customize-header">
                <button
                className="customize-back-button"
                aria-label="Go back"
                onClick={()=> navigate("/Dashboard")}

                >
                <ArrowLeft className="customize-icon" />
                </button>
                <h1 className="customize-title">Customize</h1>
            </div>
            <section className="customize-section">
                <button
                className="customize-toggle-button"
                onClick={() => setIsDiscountOpen(!isDiscountOpen)}
                >
                <div className="customize-section-header">
                    <Percent className="customize-icon" />
                    <h2 className="customize-section-title">Discount Settings</h2>
                </div>
                
                {isDiscountOpen ? (
                    <ChevronUp className="customize-icon" />
                ) : (
                    <ChevronDown className="customize-icon" />
                )}
                </button>
                {isDiscountOpen && (
                <div className="customize-section-content">
                    <div className="customize-form">
                    <div>
                        <label className="customize-label">Discount Code</label>
                        <input
                        type="text"
                        className="customize-input"
                        placeholder="Enter discount code"
                        value={discountCode}
                        onChange={(e)=> setDiscountCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="customize-label">Discount Percentage</label>
                        <input
                        type="number"
                        className="customize-input"
                        placeholder="Enter discount %"
                        value={discount_value}
                        onChange={(e)=> setDiscount_value(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="customize-label">Store Purchase Discount</label>
                        <input
                        type="number"
                        className="customize-input"
                        placeholder="Number of store purchases required to get discount"
                        value={purchase_count}
                        onChange={(e)=> setPurchase_count(e.target.value)}
                        />
                    </div>
                </div>
                    <button onClick={()=> HandleDiscount("Update")}>Update discount</button>
                    <button onClick={()=> HandleDiscount("Create")}>Create new Discount</button>
                </div>
                )}
            </section>
            <section>
                <button
                className="customize-toggle-button"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                >
                <div className="customize-section-header">
                    <Clock className="customize-icon" />
                    <h2 className="customize-section-title">Order History</h2>
                </div>
                {isHistoryOpen ? (
                    <ChevronUp className="customize-icon" />
                ) : (
                    <ChevronDown className="customize-icon" />
                )}
                </button>
                {isHistoryOpen && (
                <div className="customize-section-content">
                    <div className="customize-history">
                    <div className="customize-history-item">
                        <div className="customize-history-details">
                        <p className="customize-order-number">Order #1234</p>
                        <p className="customize-order-date">June 1, 2023</p>
                        </div>
                        <span className="customize-order-amount">$150.00</span>
                    </div>
                    <div className="customize-history-item">
                        <div className="customize-history-details">
                        <p className="customize-order-number">Order #1233</p>
                        <p className="customize-order-date">May 28, 2023</p>
                        </div>
                        <span className="customize-order-amount">$89.99</span>
                    </div>
                    </div>
                    <button>Save setting</button>
                </div>
                )}
            </section>
            </div>
        </div>
    );
}