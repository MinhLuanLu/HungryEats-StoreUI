import React from "react";
import "../styles/loading.css"; 

const Loading = () => {
  return (
    <div id="loading_page">
      <div id="loading_container">
        <div id="ring"></div>
        <div id="ring"></div>
        <div id="ring"></div>
        <div id="ring"></div>
        <div id="loading_text">loading</div>
      </div>
    </div>
  );
};

export default Loading;
