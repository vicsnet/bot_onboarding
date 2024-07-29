import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  ethers,
} from "forta-agent";
import { utils, Contract } from "ethers";

import agent, { provideHandleTransaction } from "./agent";
import { SWAP_EVENT } from "./constant";
import { createAddress } from "forta-agent-tools";
import {
  MockEthersProvider,
  TestTransactionEvent,
} from "forta-agent-tools/lib/test";

const iface: utils.Interface = new utils.Interface([
  "function token1() external view returns (address)",
  "function token0() external view returns (address)",
  "function fee() external view returns (uint24)",
]);

export const poolCreatedEvent =
  "event PoolCreated(address indexed token0,address indexed token1,uint24 indexed fee,int24 tickSpacing,address pool)";

describe("UniswapV3 Swap Detection Test Suite", () => {
  let handleTransaction: HandleTransaction;

  let txEvent: TestTransactionEvent;

  const address1 = "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();
  const token_1 = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

  const token_0 = "0x765Af38A6e8FDcB1EFEF8a3dd2213EFD3090B00F";

  const fee_ = 3000;
  const mockProvider: MockEthersProvider = new MockEthersProvider();
  mockProvider.setNetwork(137);

  handleTransaction = provideHandleTransaction(mockProvider as any);

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
  const amountOutMinimum = 31628133;
  const sqrtPriceLimitX96 = 0;

  const amount0 = ethers.BigNumber.from("847955346422803956304");
  const amount1 = 31628133;
  const sqrtPricex96 = 0;
  const liquidity = 5;
  const tick = 10;
  const sender = "0x74993dD14475b25986B6ed8d12d3a0dFf92248f4";
  const poolAddress = "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76";

  function createGetToken0() {
    return mockProvider.addCallTo(address1, 20, iface, "token0", {
      inputs: [],
      outputs: [token0],
    });
  }
  function createGetToken1() {
    return mockProvider.addCallTo(address1, 20, iface, "token1", {
      inputs: [],
      outputs: [token1],
    });
  }
  function createGetfee() {
    return mockProvider.addCallTo(address1, 20, iface, "fee", {
      inputs: [],
      outputs: [fee],
    });
  }

  it("returns no findings for empty transaction", async () => {
    createGetToken0();
    createGetToken1();
    createGetfee();
    txEvent = new TestTransactionEvent();
    txEvent.setBlock(20);
    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([]);
  });
  it("detects a 'swap' on a valid UniswapV3 pool", async () => {
    const address = "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();
    createGetToken1();
    createGetToken0();
    createGetfee();

    txEvent = new TestTransactionEvent().addEventLog(SWAP_EVENT, address, [
      sender,
      recipient,
      amount0,
      amount1,
      sqrtPricex96,
      liquidity,
      tick,
    ]);

    txEvent.setBlock(20);
    const findings = await handleTransaction(txEvent);

    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Uniswap Swap Detection",
        description: `A swap between ${token0} and ${token1} on UniswapV3 was detected on this pool ${address}`,
        alertId: "Uniswap-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "Uniswap",
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

  it("detect no 'swap' from non-Uniswap pool ", async () => {
    createGetToken0();
    createGetToken1();
    createGetfee();
    const nonUniswapPoolAddress = createAddress("0x674");
    txEvent = new TestTransactionEvent().addEventLog(
      SWAP_EVENT,
      nonUniswapPoolAddress,
      [sender, recipient, amount0, amount1, sqrtPricex96, liquidity, tick]
    );

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });
  it("detect no swap on non uniswap 'swap' event", async () => {
    createGetToken0();
    createGetToken1();
    createGetfee();
    const address = "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();

    txEvent = new TestTransactionEvent().addEventLog(
      poolCreatedEvent,
      address,
      [token0, token1, fee, tick, address]
    );

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("return multiple findings for uniswap 'swap' event and empty finding for non uniswap 'swap' event", async () => {
    createGetToken0();
    createGetToken1();
    createGetfee();
    const address = "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();
    const recipientNew = createAddress("0x4");
    const nonUniswapPoolAddress = createAddress("0x4");

    txEvent = new TestTransactionEvent()
      .addEventLog(SWAP_EVENT, address, [
        sender,
        recipient,
        amount0,
        amount1,
        sqrtPricex96,
        liquidity,
        tick,
      ])
      .addEventLog(SWAP_EVENT, address, [
        sender,
        recipientNew,
        amount0,
        amount1,
        sqrtPricex96,
        liquidity,
        tick,
      ])
      .addEventLog(SWAP_EVENT, nonUniswapPoolAddress, [
        sender,
        recipientNew,
        amount0,
        amount1,
        sqrtPricex96,
        liquidity,
        tick,
      ]);
    txEvent.setBlock(20);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: "Uniswap Swap Detection",
        description: `A swap between ${token0} and ${token1} on UniswapV3 was detected on this pool ${address}`,
        alertId: "Uniswap-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "Uniswap",
        metadata: {
          sender,
          recipient,
          tokenIn: token0,
          tokenOut: token1,
          amount0: amount0.toString(),
          amount1: amount1.toString(),
        },
      }),
      Finding.fromObject({
        name: "Uniswap Swap Detection",
        description: `A swap between ${token0} and ${token1} on UniswapV3 was detected on this pool ${address}`,
        alertId: "Uniswap-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "Uniswap",
        metadata: {
          sender,
          recipient: recipientNew,
          tokenIn: token0,
          tokenOut: token1,
          amount0: amount0.toString(),
          amount1: amount1.toString(),
        },
      }),
    ]);
  });
});
