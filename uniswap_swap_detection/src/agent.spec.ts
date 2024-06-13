import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
  ethers,
} from "forta-agent";
import { createAddress } from "forta-agent-tools";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";

import agent from "./agent";
import { UNISWAP_ADDRESS, SWAP_EVENT, FUNCTION_EXACT, SWAP_ROUTER } from "./constant";

describe("swap occur", () => {
  let handleTransaction: HandleTransaction;

  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("token swap", () => {
    const usrAddr = "0x74993dD14475b25986B6ed8d12d3a0dFf92248f4";
    const tokenIn = "0x5F32AbeeBD3c2fac1E7459A27e1AE9f1C16ccccA";
    const tokenOut = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
    const fee = 3000;
    const recipient = "0x08d16B72dad2c52FD94835FF49f51514aFcBfBfC";
    const deadline = 1718308601;
    // const amountIn = ethers.BigNumber.from("847955346422803956304");
    const amountOutMinimum = 31628133;
    const sqrtPriceLimitX96 = 0;

    const amount0 = ethers.BigNumber.from("847955346422803956304");
    const amount1 = 31628133;
    const sqrtPricex96 = 0;
    const liquidity = 5;
    const tick = 10;
    const sender = "0x74993dD14475b25986B6ed8d12d3a0dFf92248f4";
    const mockSwapEvent = {
      args: {
        sender,
        recipient,
        amount0,
        amount1,
        sqrtPricex96,
        liquidity,
        tick,
      },
    };

    describe("function calls befor filter", () => {
      it("returns empty findingd if there is no swap", async () => {
        const txEvent = new TestTransactionEvent();
        const findings = await handleTransaction(txEvent);
        expect(findings).toStrictEqual([]);

  
      });

      it("calls the function", async () => {
        const txEvent = new TestTransactionEvent()
          .setFrom(sender)
          .setTo(String(SWAP_ROUTER))
          .addTraces({
            function: FUNCTION_EXACT,
            to: String(SWAP_ROUTER),
            from: sender,
            arguments: [
              tokenIn,
              tokenOut,
              fee,
              recipient,
              deadline,
              amount0,
              amountOutMinimum,
              sqrtPriceLimitX96,
            ],
          });
        // const poolAddress = await handleTransaction(txEvent);


        txEvent.filterLog = jest.fn().mockReturnValue([mockSwapEvent]);

        const findings = await handleTransaction(txEvent);
        expect(findings).toStrictEqual([
          Finding.fromObject({
            name: "Swap detected",
            description: `A swap between ${tokenIn} and ${tokenOut} on UniswapV3 was detected`,
            alertId: "FORTA-1",
            severity: FindingSeverity.Low,
            type: FindingType.Info,
            metadata: {
              sender,
              recipient,
              tokenIn:tokenIn,
              tokenOut:tokenOut,
              amount0: String(amount0),
              amount1: String(amount1),
            },
          }),
        ]);
      });
    });

  });
});
