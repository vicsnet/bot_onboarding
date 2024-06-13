import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  ethers,
} from "forta-agent";


import { UNISWAP_ADDRESS, SWAP_EVENT, FUNCTION_EXACT, SWAP_ROUTER, ABI } from "./constant";

import { getPool } from "./utils";



const provideHandleTransaction = () => async (txEvent: TransactionEvent) => { 


  const findings: Finding[] = [];

  const functionCalls =  txEvent.filterFunction([FUNCTION_EXACT], SWAP_ROUTER );
  
  
  if(functionCalls.length === 0){
    console.log("no findings");
    return findings;
  }

  

  
  for (const call of functionCalls) {
  
  const poolAddress = await getPool(call.args[0], call.args[1], call.args[2]);



  const tokenSwapEvent = txEvent.filterLog(SWAP_EVENT, poolAddress);
  
  
    tokenSwapEvent.forEach((swapEvent) => {
      const { sender, recipient, amount0, amount1 } = swapEvent.args;

      findings.push(
        Finding.fromObject({
          name: "Swap detected",
          description: `A swap between ${call.args[0]} and ${call.args[1]} on UniswapV3 was detected`,
          alertId: "FORTA-1",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            sender,
            recipient,
            tokenIn:call.args[0],
            tokenOut:call.args[1],
            amount0: amount0.toString(),
            amount1: amount1.toString(),
          },
        })
      );
    });
}



  return findings;
};

export default {
  handleTransaction: provideHandleTransaction(),
};
