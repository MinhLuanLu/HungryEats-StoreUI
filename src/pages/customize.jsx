import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_LOCATION } from "../../config";
import Header from "../components/header";
import Discount from "../components/discount";

export default function Customize() {
  


  return(
    <>
      <Header/>
      <Discount/>
    </>
  )
};
