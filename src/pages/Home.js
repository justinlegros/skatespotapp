import React from "react";
import {Link } from 'react-router-dom';
import "./Home.css";
import bg from "../images/frontpagebg.png";
import logo from "../images/skatespotblue.png";
// import { ConnectButton, DatePicker, Select, Input } from '@web3uikit/core';
import {Search} from '@web3uikit/icons'
// import { useState, useEffect } from "react";
// import Rentals from './Parks';





const Home = () => {
  

  return (
    <>
        
      <div className="container" style={ {backgroundImage: `url(${bg})`} }>
        <div className="containerGradient"></div>
      </div>
      <div className="topBanner">
        <div>
            <img className="logo" src={logo} alt="" logo></img>
        </div>
        <div className="tabs">
            <div className="selected"> Places to Stay</div>
            <div> Experiences</div>
            <div> Online Experiences</div>
        </div>
        <div className="lrContainers">
            
        </div>
        <div className="tabContent">
            <div className="searchFields">
                <div className="inputs">
                    Location
                </div>
                <div className="vl"></div>

                <div className="inputs">
                    Type
                </div>
                <Link to={"/Parks"}>
                <div className="searchButton"> 
                <Search fontSize='30px'/>
                </div> 
                </Link>
                
            </div>
        </div>
      </div>
      
    </>
  );
};

export default Home;
