import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { opend } from "../../../declarations/opend/index";
import { opend } from "../../../declarations/opend";
import Item from "./Item";
function Minter() {
  //register is the object that we can access to what user input 
  const {register, handleSubmit} = useForm();
  const [NftPrincipal, setPrincipal] = useState("");
  const [loderAnim, setloderAnim] = useState(true);
  //after make sure user input something,
    //(reat-hook-form automatically convert whatever user input to the data that could be used in the submit functions)
  //user hit mint button which trigger obsubmit that inside the handleSubmit
  async function onSubmit(data){
    console.log("started");
    //loder be false means enable the loading, i feel it's werid lol
    setloderAnim(false);
    const name = data.name;
    const img = data.img[0]; //byte data of img
    //conver to Nat8 datatyoe in nft.mo
    const imgData = [...new Uint8Array(await img.arrayBuffer())];
    const newNftID = await opend.mint(imgData, name);
    console.log(newNftID.toText());
    setPrincipal(newNftID); //let NftPrincipal = newNftID
    setloderAnim(true);
  }
  if(NftPrincipal == ""){
  return (
    <div className="minter-container">
    
      <div hidden={loderAnim} className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
        Create NFT
      </h3>
      <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
        Upload Image
      </h6>
      <form className="makeStyles-form-109" noValidate="" autoComplete="off">
        <div className="upload-container">
          <input
          {...register("img",{require:true})}
            className="upload"
            type="file"
            accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
          />
        </div>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Collection Name
        </h6>
        <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
          <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
            <input
            //{required:true} make sure user actually input something instead of leaving it blank
              {...register("name", {required: true})}
              placeholder="e.g. CryptoDunks"
              type="text"
              className="form-InputBase-input form-OutlinedInput-input"
            />
            <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
          </div>
        </div>
        <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
          <span onClick={handleSubmit(onSubmit)}className="form-Chip-label">Mint NFT</span>
        </div>
      </form>
    </div>
  );
  }else{
    return(
      <div className="minter-container">
      <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
        Minted!
      </h3>
      <div className="horizontal-center">
        <Item id={NftPrincipal.toText()} />
      </div>
    </div>
    );
  }
}

export default Minter;
