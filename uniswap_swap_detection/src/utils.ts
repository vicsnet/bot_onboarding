import { ethers } from "forta-agent";
import { UNISWAP_ADDRESS,  ABI } from "./constant";
export const getPool = (token1:String, token2:String, fee:Number) =>{
    const provider = new ethers.providers.JsonRpcProvider('https://polygon.drpc.org')
    const contract = new ethers.Contract(UNISWAP_ADDRESS, ABI, provider);
  
    const poolAddress = contract.getPool(token1, token2, fee)
  
    return poolAddress;
  }
  