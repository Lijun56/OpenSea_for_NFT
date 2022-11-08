import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import homeImage from "../../assets/home-img.png";
import Gallery from "./Gallery";
import Minter from "./Minter";
import {opend} from "../../../declarations/opend";
//reat-router-dom enable switch routes in D-apps desgin 
  //BrowserRouter represent the domain react-router-dom will be applied on
  //link represent the link goes to after click 
  //switch do the render work after switch to the corresponding routes
import { BrowserRouter, Link, Switch,Route } from "react-router-dom";
import CURRENT_USER_ID from "../index";


function Header() {
  const [userOwnedNFTs, setOwnedNFTs] = useState();
  const [userlistedNFTs, setListedNFTs] = useState();

  //main.mo backend function is actually exist under the opend (can be found in dfx.json)
    //because UserNFTids need to be updated asyncly, so we put into async function and render by useeffect
  async function getNFTs(){
    const UserNFTids = await opend.fetchOwnedNFTs(CURRENT_USER_ID);
    console.log(UserNFTids);
    setOwnedNFTs(
    <Gallery title="My NFTs" ids={UserNFTids} role="collection"/>
    );

    const listedNFTs = await opend.fetchListedNFTs();
    console.log(listedNFTs);
    setListedNFTs(
    <Gallery title="Discover" ids={listedNFTs} role="discover" />
    );
  }
  useEffect(()=>{
    getNFTs();
  },[]);

  return (
    <BrowserRouter>
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
          <Link to="/">
          <h5 className="Typography-root header-logo-text">OpenD</h5>
          </Link>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to= "/discover">
            Discover
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link to= "/minter">
            Minter
            </Link>
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
          <Link to= "/nfts">
          My NFTs
          </Link>
          </button>
        </div>
      </header>
    </div>
    <Switch>
      <Route exact path = "/">
        <img className="bottom-space" src = {homeImage} />
      </Route>
      <Route path = "/discover">
        {userlistedNFTs}
      </Route>
      <Route path = "/minter">
        <Minter />
      </Route>
      <Route path = "/nfts">
        {userOwnedNFTs}
      </Route>
    </Switch>
    </BrowserRouter>
  );
}

export default Header;
