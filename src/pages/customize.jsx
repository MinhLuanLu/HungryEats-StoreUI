// Updated JSX file
import React, { useState } from "react";
import { API_LOCATION } from "../../config";
import Header from "../components/header";
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
    
    return (
      <>
        <Header/>
        <div className="customize-container">
              
        </div>
      </>
    );
}