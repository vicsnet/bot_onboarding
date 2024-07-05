import { ethers, getEthersProvider } from "forta-agent";
import dotenv from "dotenv";

dotenv.config();

const alchemyApiKey = process.env.ALCHEMY_API_KEY;
export const UNISWAP_FACTORY_ADDRESS =
  "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const SWAP_EVENT =
  "event Swap(address indexed sender,address indexed recipient,int256 amount0,int256 amount1,uint160 sqrtPriceX96,uint128 liquidity,int24 tick)";

export const CREATED_POOL =
  "event PoolCreated(address indexed token0,address indexed token1,uint24 indexed fee,int24 tickSpacing,address pool)";
export const FUNCTION_EXACT =
  " function exactInputSingle(address,address,uint24,address,uint256,uint256,uint256,uint160)";

export const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
export const PROVIDER = new ethers.providers.JsonRpcProvider(
  `https://polygon-rpc.com`
);
export const UNISWAP_POOL_INIT_CODE_HASH =
  "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54";

export const ABI = [
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint24", name: "", type: "uint24" },
    ],
    name: "getPool",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];
