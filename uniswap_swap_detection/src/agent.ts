import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  ethers,
} from "forta-agent";

import {
  UNISWAP_ADDRESS,
  SWAP_EVENT,
  FUNCTION_EXACT,
  SWAP_ROUTER,
  PROVIDER,
} from "./constant";
import { poolABI } from "./abi";

import { getPool, isUniswapPool } from "./utils";

const provideHandleTransaction = () => async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  const tokenSwapEvent = txEvent.filterLog(SWAP_EVENT);

  for (const swap of tokenSwapEvent) {
    const { sender, recipient, amount0, amount1 } = swap.args;
    const address = swap.address;

    const contract = new ethers.Contract(address, poolABI, PROVIDER);

    let token0, token1, fee;

    try {
      token1 = await contract.token1();
      token0 = await contract.token0();
      fee = await contract.fee();
    } catch (error) {
      console.log("Error reading contract data:", error);
    }

    const salt = ethers.utils.keccak256(
      ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint24"],
        [token0, token1, fee]
      )
    );
    const isuniswapAddress = isUniswapPool(token0, token1, fee);

    // const poolAddress = await getPool(token0, token1, fee);

    if (isuniswapAddress.toLowerCase() !== address.toLowerCase()) {
      return findings;
    }

    findings.push(
      Finding.fromObject({
        name: "Swap detected",
        description: `A swap between ${token0} and ${token1} on UniswapV3 was detected on this pool ${address}`,
        alertId: "FORTA-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "polygon",
        metadata: {
          sender,
          recipient,
          tokenIn: token0,
          tokenOut: token1,
          amount0: amount0.toString(),
          amount1: amount1.toString(),
        },
      })
    );
  }

  return findings;
};

export default {
  handleTransaction: provideHandleTransaction(),
};
