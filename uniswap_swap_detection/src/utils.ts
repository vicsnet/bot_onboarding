import { ethers } from "forta-agent";
import {
  UNISWAP_ADDRESS,
  ABI,
  PROVIDER,
  POOL_INIT_CODE_HASH,
} from "./constant";
export const getPool = (token1: String, token2: String, fee: Number) => {
  const contract = new ethers.Contract(UNISWAP_ADDRESS, ABI, PROVIDER);

  const poolAddress = contract.getPool(token1, token2, fee);

  return poolAddress;
};

export const isUniswapPool = (token0: String, token1: String, fee: Number) => {
  const salt = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "address", "uint24"],
      [token0, token1, fee]
    )
  );
  const isuniswapAddress = ethers.utils.getCreate2Address(
    UNISWAP_ADDRESS,
    salt,
    POOL_INIT_CODE_HASH
  );

  return isuniswapAddress;
};
