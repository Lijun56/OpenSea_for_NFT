import type { Principal } from '@dfinity/principal';
export interface _SERVICE {
  'checkListed' : (arg_0: Principal) => Promise<boolean>,
  'completePurchase' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: Principal,
    ) => Promise<string>,
  'fetchListedNFTs' : () => Promise<Array<Principal>>,
  'fetchOwnedNFTs' : (arg_0: Principal) => Promise<Array<Principal>>,
  'getOGOwner' : (arg_0: Principal) => Promise<Principal>,
  'getOpenDCanisterID' : () => Promise<Principal>,
  'getSellPrice' : (arg_0: Principal) => Promise<bigint>,
  'isListed' : (arg_0: Principal) => Promise<boolean>,
  'listItem' : (arg_0: Principal, arg_1: bigint) => Promise<string>,
  'mint' : (arg_0: Array<number>, arg_1: string) => Promise<Principal>,
}
