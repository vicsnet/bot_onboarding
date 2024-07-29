import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
  ethers,
  Alert,
  AlertsResponse,
  HandleBlock,
  keccak256,
  BlockEvent,
  createBlockEvent,
} from "forta-agent";
import {
  MockEthersProvider,
  TestBlockEvent,
  TestTransactionEvent,
} from "forta-agent-tools/lib/test";
import {
  L1_DAI_CONTRACT_ADDRESS,
  L1_ESCROW_ADDRESS_OPTIMISM,
  L1_ESCROW_ADDRESS_ARBITRUM,
  L2_DAI,
  L2_DAI_ARBITRUM,
  L2_DAI_GATEWAY_ARB,
  L1_ARBITRUM_GATEWAY,
  DEPOSIT_FINALISED_EVENT,
  ARBI_CHAINID,
  OP_CHAINID,
  TRANSFER_EVENT,
  ETHER_CHAINID,
} from "./constant";
import agent, { provideHandleBlock, provideInitialize } from "./agent";
import { createAddress } from "forta-agent-tools";
import { utils } from "ethers";

const iface: utils.Interface = new utils.Interface([
  "function totalSupply() external view returns(uint256)",
  "function balanceOf(address) external view returns(uint256)",
]);
describe("Maker Dao Bridge Invariant Detection Test Suite", () => {
  let handleBlock: HandleBlock;
  const mockProvider: MockEthersProvider = new MockEthersProvider();
  const initialize: any = provideInitialize(mockProvider as any);

  const mockAlert = jest.fn();

  function getTotalSupply(block: number) {
    return mockProvider.addCallTo(
      L2_DAI_ARBITRUM,
      block,
      iface,
      "totalSupply",
      {
        inputs: [],
        outputs: [1000],
      }
    );
  }
  function getBalanceOfArb(balance: Number) {
    return mockProvider.addCallTo(
      L1_DAI_CONTRACT_ADDRESS,
      50,
      iface,
      "balanceOf",
      {
        inputs: [L1_ESCROW_ADDRESS_ARBITRUM],
        outputs: [balance],
      }
    );
  }
  function getBalanceOfOpt(balance: Number) {
    return mockProvider.addCallTo(
      L1_DAI_CONTRACT_ADDRESS,
      30,
      iface,
      "balanceOf",
      {
        inputs: [L1_ESCROW_ADDRESS_OPTIMISM],
        outputs: [balance],
      }
    );
  }

  beforeAll(() => {
    jest.spyOn(Date, "now").mockImplementation(() => 1590000000000);
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  const from = createAddress("0x3");
  const l1Token = createAddress("0x344");
  const to = L1_ARBITRUM_GATEWAY;
  const address = "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();

  it("returns findings for blockEvent calls on Arbitrium", async () => {
    const blockEvent = createBlockEvent({
      block: { hash: "0xa", number: 30 } as any,
    });

    mockProvider.setNetwork(ARBI_CHAINID);

    await initialize();

    getTotalSupply(30);

    handleBlock = provideHandleBlock(mockProvider as any);

    const findings = await handleBlock(blockEvent);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: `DAI Bridge Deposit Transaction`,
        description: `Deposit occur on DAI 42161 chainId bridge`,
        alertId: "ARBITRUM-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          totalSupply: "1000",
        },
      }),
    ]);
  });

  it("returns findings for block event on Optimism", async () => {
    const blockEvent = createBlockEvent({
      block: { hash: "0xa", number: 40 } as any,
    });
    mockProvider.setNetwork(OP_CHAINID);
    await initialize();
    getTotalSupply(40);
    handleBlock = provideHandleBlock(mockProvider as any);

    const findings = await handleBlock(blockEvent);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: `DAI Bridge Deposit Transaction`,
        description: `Deposit occur on DAI 10 chainId bridge`,
        alertId: "OPTIMISM-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          totalSupply: "1000",
        },
      }),
    ]);
  });

  it("returns findings for Arbitrium transaction on Ether Transaction ", async () => {
    const blockEvent = createBlockEvent({
      block: { hash: "0xa", number: 50 } as any,
    });

    const l1Alert: Alert = {
      alertId: "FORTA-1",
      chainId: 42161,
      hasAddress: (address: string) => true,
      metadata: {
        totalSupply: 10000,
        network: "Ethereum",
      },
    };

    const l1Alerts: AlertsResponse = {
      alerts: [l1Alert],
      pageInfo: {
        hasNextPage: false,
      },
    };
    mockAlert.mockReturnValue(l1Alerts);
    mockProvider.setNetwork(ETHER_CHAINID);

    await initialize();

    getBalanceOfArb(100);
    handleBlock = provideHandleBlock(mockProvider as any);

    const findings = await handleBlock(blockEvent);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: `Invariant Transaction Detected on Arbitrium DAI`,
        description: `Invariant transaction occur on Arbitrium DAI Address. Total supply of 10000 is greater than Escrow balance of 100`,
        alertId: "ARBITRUM-2",
        severity: FindingSeverity.High,
        type: FindingType.Suspicious,
        metadata: {
          totalSupply: "10000",
          balance: "100",
        },
      }),
    ]);
  });
});
