//the main backend that 
    //conver info of nft to hashmap
import NFTActorClass "../nft/nft";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
//track which nft is minted and whose the owners are
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Iter "mo:base/Iter";



// creating the non-fungible token which is a nft object here by calling nft.mo function
actor OpenD {
  //Principal is NFT id we passed in 
  //NFTActorClass.NFT here represents the NFT class type
  //Principal.equal is used to check if Principal id passed in against the key in the mashmap(no duplicate ....)
  //Principal.Hash is used to hash(hashcode) the Principal Id passed into the Hashmap
  //map of NFTs ={NFT id, NFT class} means one NFT one nft id
  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1,Principal.equal, Principal.hash);
  // mapofowner = { owner id: [list of nfts the owner owned ]}
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1,Principal.equal, Principal.hash);
  private type Listing = {
    itemOwner: Principal;
    itemPrice: Nat;
  };
  // all the nfts that for Listing,or you can say it stor the Listing info mation for each nft
  var mapOfListings = HashMap.HashMap<Principal, Listing>(1,Principal.equal, Principal.hash);
  public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal{
    //identify the message caller 
    let owner:Principal = msg.caller;
    //when we have shared class, not only locally, it will run millions of cycyles in server, so now
        //we want to see how many cycles and print it in the terminal
    Debug.print(debug_show(Cycles.balance()));
    Cycles.add(100_500_000_000);
    let newNFT = await NFTActorClass.NFT(name, owner, imgData);
    Debug.print(debug_show(Cycles.balance()));
    let newNftPrincipal =  await newNFT.getCanisterID();
    //we actually want to return the reference of the new created NFT object

  //pass input to the hashmap
    mapOfNFTs.put(newNftPrincipal, newNFT);
  //put principal ID into the ownership hashmap
    addToOwnerMap(owner, newNftPrincipal);
    return newNftPrincipal
  };

  private func addToOwnerMap(owner: Principal, nftID: Principal){
    //if owner key exist, we get result ,else we create a new one for it
    var ownedNFTs :  List.List<Principal> = switch(mapOfOwners.get(owner)){
      case null List.nil<Principal>();
      case (?result) result;
    };
    ownedNFTs := List.push(nftID, ownedNFTs);
    mapOfOwners.put(owner, ownedNFTs)

  };
  //function to fetch the nft ids for certain owner
    //and convert to the array that passed to the front-end to use
  public query func fetchOwnedNFTs(user :Principal):async [Principal]{
    var ownedNFTs :  List.List<Principal> = switch(mapOfOwners.get(user)){
      case null List.nil<Principal>();
      case (?result) result;
    };
    return List.toArray(ownedNFTs);
  };
  

  public query func fetchListedNFTs():async [Principal]{
    let ids = Iter.toArray(mapOfListings.keys());
    return ids;
  };
  //list items in the backend, so we know who they belong to, how much of them listed for (prices)
  //shared funciton enable to get caller's id, show how much the item listed for 
  //return text datatype
  public shared(msg) func listItem(id:Principal, price: Nat):async Text{
    //check if the item exist
      var item : NFTActorClass.NFT = switch(mapOfNFTs.get(id)){
      case null return "NFT not exist.";
      case (?result) result;
    };
    //check the identity of the owner 
    let owner = await item.getOwner();
      //msg.caller is how er acess the caller's id(owner id)
    if(Principal.equal(owner, msg.caller)){
      let newListing: Listing ={
        itemOwner = owner;
        itemPrice = price;
      };
      mapOfListings.put(id, newListing);
      return "Success";
    }else{
      return "You don't own the NFT.";
    }
  };

  public query func getOpenDCanisterID() : async Principal
  {
    return Principal.fromActor(OpenD);
  };

  public query func checkListed(id: Principal) : async Bool
  {
    if(mapOfListings.get(id) == null){
      return false;
    }else{
      return true;
    }
  };
  public query func isListed(id: Principal) : async Bool {
      if (mapOfListings.get(id) == null) {
        return false;
      } else{
        return true;
      }
  };
  public query func getOGOwner(id:Principal):async Principal{
    var Listing:Listing = switch(mapOfListings.get(id)){
      case null return Principal.fromText("");
      case (?result) result
      };
      return Listing.itemOwner;
  };

  public query func getSellPrice(id:Principal):async Nat{
      //check if NFT(id) actually inside the listing
      var Listing:Listing = switch(mapOfListings.get(id)){
      case null return 0;
      case (?result) result;
      };
      return Listing.itemPrice;
  };

  public shared(msg) func transferOwnerShip(NFTid: Principal, OwnerID: Principal, BuyerID: Principal):async Text{
    var nft : NFTActorClass.NFT = switch(mapOfNFTs.get(NFTid)){
      case null return "NFT not exist";
      case (?result) result
    };
    //here we do transfer function, here transferOwnership is function in the token
    let transferResult = nft.transferOwnership(BuyerID);
    if(transferResult == "Success"){
      mapOfListings.delete(NFTid);
      var ownedNFTs: List.List<Principal> = switch (mapOfOwners.get(OwnerID)){
        case null List.nil<Principal>();
        case (?result) result
      };
      //make sure NFTid is not exis inside the ownedNFTs any more 
      ownedNFTs := List.filter(ownedNFTs, func(ListItemID: Principal):Bool{
        return ListItemID != NFTid;
      });
      //pass ownership to buyer 
      addToOwnerMap(BuyerID, id);
      return "Success";
    }else{
      return "Error when passing ownership";
    }
  };

};
