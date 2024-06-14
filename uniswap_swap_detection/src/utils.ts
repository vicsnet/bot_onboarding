import { ethers } from "forta-agent";
import { UNISWAP_ADDRESS,  ABI, PROVIDER } from "./constant";
export const getPool = (token1:String, token2:String, fee:Number) =>{

    const contract = new ethers.Contract(UNISWAP_ADDRESS, ABI, PROVIDER);
  
    const poolAddress = contract.getPool(token1, token2, fee)
  
    return poolAddress;
  }
  