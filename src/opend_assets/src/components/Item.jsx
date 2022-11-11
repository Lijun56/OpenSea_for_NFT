import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import {idlFactory} from "../../../declarations/nft";
import {idlFactory as tokenIdlFactory} from "../../../declarations/token";
import {Principal} from "@dfinity/principal";
import Button from "./Button";
import { opend } from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./Price";

function Item(arg) {
  //declare the name
  const [name, setName] = useState(); //means starting start is nothing(undefined)
  const [owner, setOwner] = useState();
  const [Image, setImg] = useState();
  const [button, setButton] = useState();
  // priceInput
  const [priceInput, setPrice] = useState();
  const [loderHidden, setLoderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [status, setStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();

  //turn input to principle type
  const id = arg.id;
  console.log(id);
  const localHost = "http://localhost:8080/";
  //new httpagent will make curd request to the localhost 
  const agent = new HttpAgent({host: localHost});
  //the status of nft, to check whether it's list or other status
  //TODO: when deploy live on site, we need to remove this line
  agent.fetchRootKey();
  let NftActor;
  async function loadNft(){
    NftActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });
    const name = await NftActor.getName();
    const owner = await NftActor.getOwner();
    //image part
    const imageData = await NftActor.getImg();
      //convert Nat8 datatype in nft.mo to Unit8Array which can be read by JS
    const ImageData_js = new Uint8Array(imageData);
      //convert Image to url format of pic(img) by converting to blob first then to url
    const Image = URL.createObjectURL(
      new Blob([ImageData_js.buffer], {type:"image/png"})
      );

    // console.log(name);
    setName(name);
    setOwner(owner.toText());
    setImg(Image);

    if(arg.role == "collection"){
      const nftStatus = await opend.isListed(arg.id);
      if(nftStatus){
        setOwner("OpenD");
        setBlur({filter: "blur(4px)"});
        setStatus("[LISTED]");
      }else{
      //setButton
      setButton(<Button handleClick={sell} text ={"Sell"}/> );
      }
    }else if (arg.role == "discover"){
      const originalOwner = await opend.getOGOwner(arg.id);
      if(originalOwner.toText() != CURRENT_USER_ID.toText()){
        setButton(<Button handleClick={buy} text ={"Buy"}/> );
      }
      //retrive sell price and passed to priceLabel 
      const PriceToSell = await opend.getSellPrice(arg.id);
      console.log(PriceToSell);
      setPriceLabel(<PriceLabel sellPrice={PriceToSell.toString()}/>);
    }
  }

  useEffect(()=>{
    loadNft();
  },[]);

  let price;
   function sell(){
    console.log("Sales NOW!!!");
    setPrice(
    <input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      //let user input the value for the price(assigned it to price)
      onChange={(e) => (price = e.target.value)}
      />
    );
    setButton(<Button handleClick={ConfirmSell} text ={"Confirm"}/>);
  }
  async function buy(){
    console.log("Buy NOW!!!");
    //create canister actor (like reference of the buyer) for buyer 
    const tokenActor = await Actor.createActor(tokenIdlFactory,{
      agent,
      canisterId: Principal.fromText("q3fc5-haaaa-aaaaa-aaahq-cai"),
    });
    //transfer the money from buyer to seller
    //get seller id
    const Seller_ID = await opend.getOGOwner(arg.id);
    const Item_price = await opend.getSellPrice(arg.id);
    //passed the money to seller from buyer
    const result = await tokenActor.transfer(Seller_ID,Item_price);
    console.log(result);
    //transfer the ownership to buyer
    if(result == "Success"){
      const TransferResult = await opend.completePurchase(arg.id, Seller_ID, CURRENT_USER_ID);
      console.log("purchased check: "+TransferResult);

    }
    
  }
  async function ConfirmSell(){
    //blur the item that be clicked to sell by filter function
    setBlur({filter: "blur(4px)"});
    setLoderHidden(false);
    console.log("confirm the sell");
    const listingResult = await opend.listItem(arg.id, Number(price));
    console.log("listing info: "+ listingResult);

    if(listingResult == "Success"){
      //get new owner's principal id 
      const openID  = await opend.getOpenDCanisterID();
      //passed it to the transfer ownership function
      const transferResult = await NftActor.transferOwnerShip(openID);
      console.log("transfer: "+ transferResult);
      if(transferResult == "Success"){
        setLoderHidden(true);
        setButton();
        setPrice();
        setOwner("OpenD");
        setStatus("[LISTED]");
      }
    }

  }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={Image}
          style = {blur}
        />
        <div className="lds-ellipsis" hidden = {loderHidden}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        </div>

        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
          <span className="purple-text">{status}</span>
          {name}
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            owner:{owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
