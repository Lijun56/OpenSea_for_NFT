 import Debug "mo:base/Debug";
 import Principal "mo:base/Principal";

 
 actor class NFT(name: Text, owner: Principal, content:[Nat8]) = this{
    //property of individual nft
    private let itemName = name;
    private var nftOwner = owner;
    private let imageBytes = content;

   //all vaible above is represent by no fungible token
   // make it singleton structure , so we need getter functions for each variables abvove
   public query func getName(): async Text{
      return itemName;
   };
   public query func getOwner(): async Principal{
      return nftOwner;
   };
   public query func getImg(): async [Nat8]{
      return imageBytes;
   };
   public query func getCanisterID(): async Principal{
      //taker a actor and return Principal of that actior
      //here we are returning this's principal
      //passing a REFERENCE here
      return Principal.fromActor(this);
   };
   
   public shared(msg) func transferOwnerShip(newOwner: Principal):async Text{
      if(msg.caller == nftOwner){
         nftOwner := newOwner;
         return "Success";
      }else{
         return "Error: Not initialized by NFT real owner";
      }
   };
 };