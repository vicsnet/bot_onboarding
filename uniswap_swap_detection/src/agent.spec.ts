import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
  ethers,
  getEthersProvider,
} from "forta-agent";
import { utils, Contract } from "ethers";

import agent,{provideHandleTransaction} from "./agent";
import {
  UNISWAP_ADDRESS,
  SWAP_EVENT,
  FUNCTION_EXACT,
  SWAP_ROUTER,
  CREATED_POOL,
} from "./constant";
import { createAddress } from "forta-agent-tools";
import { MockEthersProvider, TestTransactionEvent } from "forta-agent-tools/lib/test";

const iface: utils.Interface = new utils.Interface([
  "function token1() extenal view returns (address)",
  "function token0() extenal view returns (address)",
  "function fee() extenal view returns (uint24)",
]);
describe("swap occur", () => {
  let handleTransaction: HandleTransaction;

  let txEvent: TestTransactionEvent;

  const address1 =
        "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();
       const token_1 = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"


    const token_0=" 0x765Af38A6e8FDcB1EFEF8a3dd2213EFD3090B00F"

    const fee_ =3000
  const mockProvider:any = new MockEthersProvider().setNetwork(137);

  function createGetToken0() {
    return mockProvider.addCallTo(
      address1,
      20,
      iface,
      "token0",
      {
        inputs: [],
        outputs: [token_0],
      }
    );
  }
  function createGetToken1() {
    return mockProvider.addCallTo(
      address1,
      20,
      iface,
      "fee",
      {
        inputs: [],
        outputs: [token_1],
      }
    );
  }
  function createGetfee() {
    return mockProvider.addCallTo(
      address1,
      20,
      iface,
      "fee",
      {
        inputs: [],
        outputs: [fee_],
      }
    );
  }

  handleTransaction = provideHandleTransaction({PROVIDER:mockProvider});
// const PROVIDER = getEthersProvider()
  beforeAll(() => {
   
   
    jest.spyOn(Date, "now").mockImplementation(() => 1590000000000);
  });

  afterAll(() => {
    jest.restoreAllMocks();
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
    it("returns empty findings with TestTransactionEvent", async () => {
      txEvent = new TestTransactionEvent();
      // createGetToken0() 
      // createGetToken1()
      // createGetfee()
      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });
    it("returns findings", async () => {
      const address =
        "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();
        createGetToken0() 
        createGetToken1()
        createGetfee()

      txEvent = new TestTransactionEvent().addEventLog(SWAP_EVENT, address, [
        sender,
        recipient,
        amount0,
        amount1,
        sqrtPricex96,
        liquidity,
        tick,
      ]);

      const findings = await handleTransaction(txEvent)

      expect(findings).toStrictEqual([
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
        }),
      ]);
    });

    // it("returns empty findings if not uniswap event", async () => {
    //   createGetToken0() 
    //   createGetToken1()
    //   createGetfee()
    //   const address = createAddress("0x3");

    //   txEvent = new TestTransactionEvent().addEventLog(SWAP_EVENT, address, [
    //     sender,
    //     recipient,
    //     amount0,
    //     amount1,
    //     sqrtPricex96,
    //     liquidity,
    //     tick,
    //   ]);
    //   const findings = await handleTransaction(txEvent);
    //   expect(findings).toStrictEqual([]);
    // });
    // it("returns empty findings on non swap event", async () => {
    //   createGetToken0() 
    //     createGetToken1()
    //     createGetfee()
    //   const address =
    //     "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();

    //   txEvent = new TestTransactionEvent().addEventLog(CREATED_POOL, address, [
    //     token0,
    //     token1,
    //     fee,
    //     tick,
    //     address,
    //   ]);

    //   const findings = await handleTransaction(txEvent);
    //   expect(findings).toStrictEqual([]);
    // });
    // it("returns multiple findings for uniswap swap event", async () => {
    //   createGetToken0() 
    //     createGetToken1()
    //     createGetfee()
    //   const address =
    //     "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();
    //   const recipientNew = createAddress("0x4");

    //   txEvent = new TestTransactionEvent()
    //     .addEventLog(SWAP_EVENT, address, [
    //       sender,
    //       recipient,
    //       amount0,
    //       amount1,
    //       sqrtPricex96,
    //       liquidity,
    //       tick,
    //     ])
    //     .addEventLog(SWAP_EVENT, address, [
    //       sender,
    //       recipientNew,
    //       amount0,
    //       amount1,
    //       sqrtPricex96,
    //       liquidity,
    //       tick,
    //     ]);

    //   const findings = await handleTransaction(txEvent);
    //   expect(findings).toStrictEqual([
    //     Finding.fromObject({
    //       name: "Swap detected",
    //       description: `A swap between ${token0} and ${token1} on UniswapV3 was detected on this pool ${address}`,
    //       alertId: "FORTA-1",
    //       severity: FindingSeverity.Low,
    //       type: FindingType.Info,
    //       protocol: "polygon",
    //       metadata: {
    //         sender,
    //         recipient,
    //         tokenIn: token0,
    //         tokenOut: token1,
    //         amount0: amount0.toString(),
    //         amount1: amount1.toString(),
    //       },
    //     }),
    //     Finding.fromObject({
    //       name: "Swap detected",
    //       description: `A swap between ${token0} and ${token1} on UniswapV3 was detected on this pool ${address}`,
    //       alertId: "FORTA-1",
    //       severity: FindingSeverity.Low,
    //       type: FindingType.Info,
    //       protocol: "polygon",
    //       metadata: {
    //         sender,
    //         recipient: recipientNew,
    //         tokenIn: token0,
    //         tokenOut: token1,
    //         amount0: amount0.toString(),
    //         amount1: amount1.toString(),
    //       },
    //     }),
    //   ]);
    // });
  });
});
