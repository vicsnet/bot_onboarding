import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
  ethers,
} from "forta-agent";

import agent from "./agent";
import {
  UNISWAP_ADDRESS,
  SWAP_EVENT,
  FUNCTION_EXACT,
  SWAP_ROUTER,
} from "./constant";
import { createAddress } from "forta-agent-tools";

describe("swap occur", () => {
  let handleTransaction: HandleTransaction;

  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  const usrAddr = "0x74993dD14475b25986B6ed8d12d3a0dFf92248f4";
  const tokenIn = "0x5F32AbeeBD3c2fac1E7459A27e1AE9f1C16ccccA";
  const tokenOut = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  const fee = 3000;
  const recipient = "0x08d16B72dad2c52FD94835FF49f51514aFcBfBfC";
  const deadline = 1718308601;
  const token0 = "0x765Af38A6e8FDcB1EFEF8a3dd2213EFD3090B00F";
  const token1 = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  // const amountIn = ethers.BigNumber.from("847955346422803956304");
  const amountOutMinimum = 31628133;
  const sqrtPriceLimitX96 = 0;

  const amount0 = ethers.BigNumber.from("847955346422803956304");
  const amount1 = 31628133;
  const sqrtPricex96 = 0;
  const liquidity = 5;
  const tick = 10;
  const sender = "0x74993dD14475b25986B6ed8d12d3a0dFf92248f4";
  const poolAddress = "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76";


  describe("token swap detection handle Transaction", () => {
    it("returns empty findings", async ()=>{
      mockTxEvent.filterLog = jest.fn().mockReturnValue([]);
      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(SWAP_EVENT);
    })
    it("returns findings if swap was detected and pool address is the same as sender's address", async () => {
      const address = "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76";
      const mockTransaction = {
        address,
        args: {
          sender,
          recipient,
          amount0,
          amount1,
          sqrtPriceX96: sqrtPricex96,
          liquidity,
          tick,
        },
      };

      mockTxEvent.filterLog = jest.fn().mockReturnValue([mockTransaction]);

      const findings = await handleTransaction(mockTxEvent);
      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Swap detected",
          description: `A swap between ${token0} and ${token1} on UniswapV3 was detected on this pool ${poolAddress}`,
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
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(SWAP_EVENT);
    });

    it("returns empty findings if not uniswap pool address", async ()=>{
      const address = createAddress('0x3');
      const mockTransaction = {
        address,
        args: {
          sender,
          recipient,
          amount0,
          amount1,
          sqrtPriceX96: sqrtPricex96,
          liquidity,
          tick,
        },
      };
      mockTxEvent.filterLog = jest.fn().mockReturnValue([mockTransaction]);

      const findings = await handleTransaction(mockTxEvent);
      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(SWAP_EVENT);

    })
  });
});
