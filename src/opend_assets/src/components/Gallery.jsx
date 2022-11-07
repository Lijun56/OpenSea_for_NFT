import React, { useEffect, useState } from "react";
import Item from "./Item";

function Gallery(arg) {
  const [items, setItems]=useState();
  function fetchNFTs(){
    if(arg.ids != undefined){
      setItems(
        arg.ids.map((NFTId)=>(
          //react expect each input to the module be unqiue key, so we make a key component here
          <Item id={NFTId} key={NFTId.toText()}/>
        ))
      )
    }
  };
  //useEffect allow to trigger side effects everytime render changes 
  useEffect(()=>{
    fetchNFTs();
  },[]);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{arg.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
          {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
