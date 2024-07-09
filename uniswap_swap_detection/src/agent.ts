import {
  Finding,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  ethers,
  getEthersProvider,
} from "forta-agent";

import { SWAP_EVENT } from "./constant";
import { poolABI } from "./abi";

import { getuniswapPoolAddress } from "./utils";

const PROVIDER = getEthersProvider();

export const provideHandleTransaction =
  (PROVIDER: ethers.providers.JsonRpcProvider) =>
  async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];
    const block = await txEvent.blockNumber;

    const tokenSwapEvent = txEvent.filterLog(SWAP_EVENT);

    for (const swap of tokenSwapEvent) {
      const { sender, recipient, amount0, amount1 } = swap.args;
      const address = swap.address;

      const contract = new ethers.Contract(address, poolABI, PROVIDER);

      let token0, token1, fee;

      try {
        token1 = await contract.token1({ blockTag: block });
        token0 = await contract.token0({ blockTag: block });
        fee = await contract.fee({ blockTag: block });
      } catch (error) {
        console.log("Error reading contract data:", error);
      }

      if (
        token0 === undefined ||
        (null && token1 === undefined) ||
        (null && fee === undefined) ||
        null
      ) {
        return findings;
      }

      const uniswapAddress = getuniswapPoolAddress(token0, token1, fee);

      if (uniswapAddress.toLowerCase() !== address.toLowerCase()) {
        return findings;
      }

      findings.push(
        Finding.fromObject({
          name: "Uniswap-1",
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
  handleTransaction: provideHandleTransaction(PROVIDER),
};
