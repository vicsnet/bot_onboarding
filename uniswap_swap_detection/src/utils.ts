import { ethers } from "forta-agent";
import {
  UNISWAP_FACTORY_ADDRESS,
  UNISWAP_POOL_INIT_CODE_HASH,
} from "./constant";

export const uniswapPoolAddress = (
  token0: String,
  token1: String,
  fee: Number
) => {
  const salt = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "address", "uint24"],
      [token0, token1, fee]
    )
  );
  const uniswapAddress = ethers.utils.getCreate2Address(
    UNISWAP_FACTORY_ADDRESS,
    salt,
    UNISWAP_POOL_INIT_CODE_HASH
  );

  return uniswapAddress;
};
