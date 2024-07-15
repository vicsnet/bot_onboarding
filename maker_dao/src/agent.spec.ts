import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
  ethers,
  Alert,
  AlertsResponse,
} from "forta-agent";
import {
  MockEthersProvider,
  TestTransactionEvent,
} from "forta-agent-tools/lib/test";
import {
  L1_DAI_CONTRACT_ADDRESS,
  L1_ESCROW_ADDRESS_OPTIMISM,
  L1_ESCROW_ADDRESS_ARBITRUM,
  L2_DAI_OPTIMISM,
  L2_DAI_ARBITRUM,
  L2_DAI_GATEWAY_ARB,
  L1_AARBITRUM_GATEWAY,
  DEPOSIT_FINALISED_EVENT,
  GET_TOTAL_SUPPLY,
  ARBI_CHAINID,
  OP_CHAINID,
  TRANSFER_EVENT,
  ETHER_CHAINID,
} from "./constant";
import agent, { provideHandleTransaction } from "./agent";
import { createAddress } from "forta-agent-tools";
import { utils } from "ethers";

const iface: utils.Interface = new utils.Interface([
  "function totalSupply() external view returns(uint256)",
  "function balanceOf(address) external view returns(uint256)",
]);
describe("Dai briged", () => {
  let handleTransaction: HandleTransaction;

  const mockProvider: MockEthersProvider = new MockEthersProvider();
  let txEvent: TestTransactionEvent;
  const mockAlert = jest.fn();

  function getTotalSupply() {
    return mockProvider.addCallTo(L2_DAI_ARBITRUM, 30, iface, "totalSupply", {
      inputs: [],
      outputs: [1000],
    });
  }
  function getBalanceOfArb(balance: Number) {
    return mockProvider.addCallTo(
      L1_DAI_CONTRACT_ADDRESS,
      30,
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
  const to = L1_AARBITRUM_GATEWAY;
  const address = "0x61D3f523cd7e93d8deF89bb5d5c4eC178f7CfE76".toLowerCase();

  it("returns transaction calls for deposit finalised result on ", async () => {
    mockProvider.setNetwork(ARBI_CHAINID);
    getTotalSupply();
    handleTransaction = provideHandleTransaction(
      mockProvider as any,
      L2_DAI_ARBITRUM,
      mockAlert as any
    );

    txEvent = new TestTransactionEvent().addEventLog(
      DEPOSIT_FINALISED_EVENT,
      address,
      [l1Token, from, to, 50]
    );
    txEvent.setBlock(30);

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: `DAI Bridge Deposit Transaction`,
        description: `Deposit occur on DAI 42161 chainId bridge`,
        alertId: "ARBITRUM-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          totalSupply: "1000",
          amount: "50",
          from: from,
          to: to,
        },
      }),
    ]);
  });

  it("returns transaction calls for deposit finalised result", async () => {
    mockProvider.setNetwork(OP_CHAINID);

    getTotalSupply();
    handleTransaction = provideHandleTransaction(
      mockProvider as any,
      L2_DAI_OPTIMISM,
      mockAlert as any
    );

    txEvent = new TestTransactionEvent().addEventLog(
      DEPOSIT_FINALISED_EVENT,
      address,
      [l1Token, from, to, 50]
    );
    txEvent.setBlock(30);

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: `DAI Bridge Deposit Transaction`,
        description: `Deposit occur on DAI 10 chainId bridge`,
        alertId: "OPTIMISM-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          totalSupply: "1000",
          amount: "50",
          from: from,
          to: to,
        },
      }),
    ]);
  });

  it("it returns empty findings for Arbitrium transaction on Ether Transaction ", async () => {
    getBalanceOfArb(10000);
    mockProvider.setNetwork(ETHER_CHAINID);

    const l1Alert: Alert = {
      alertId: "FORTA-1",
      chainId: 1,
      hasAddress: (address: string) => true,
      metadata: {
        totalSupply: 10000,
        // abtEscBal: Number,
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
    handleTransaction = provideHandleTransaction(
      mockProvider as any,
      L2_DAI_OPTIMISM,
      mockAlert as any
    );
    txEvent = new TestTransactionEvent();

    txEvent.addEventLog(TRANSFER_EVENT, address, [
      from,
      L1_AARBITRUM_GATEWAY,
      10000,
    ]);
    txEvent.setBlock(30);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });
  it("it returns findings for Arbitrium transaction on Ether Transaction ", async () => {
    getBalanceOfArb(100);
    mockProvider.setNetwork(ETHER_CHAINID);

    const l1Alert: Alert = {
      alertId: "FORTA-1",
      chainId: 1,
      hasAddress: (address: string) => true,
      metadata: {
        totalSupply: 10000,
        // abtEscBal: Number,
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
    handleTransaction = provideHandleTransaction(
      mockProvider as any,
      L2_DAI_OPTIMISM,
      mockAlert as any
    );
    txEvent = new TestTransactionEvent();

    txEvent.addEventLog(TRANSFER_EVENT, address, [
      from,
      L1_AARBITRUM_GATEWAY,
      10000,
    ]);
    txEvent.setBlock(30);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: `Scam Transaction Detected on Arbitrium DAI`,
        description: `Scam transaction occur on Arbitrium DAI Address. Total supply of 10000 is greater than Escrow balance of 100`,
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
  it("it returns no findings for Orptimism transaction on Ether Transaction ", async () => {
    getBalanceOfOpt(10000);
    mockProvider.setNetwork(ETHER_CHAINID);

    const l1Alert: Alert = {
      alertId: "FORTA-1",
      chainId: 1,
      hasAddress: (address: string) => true,
      metadata: {
        totalSupply: 10000,
        // abtEscBal: Number,
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
    handleTransaction = provideHandleTransaction(
      mockProvider as any,
      L2_DAI_OPTIMISM,
      mockAlert as any
    );
    txEvent = new TestTransactionEvent();

    txEvent.addEventLog(TRANSFER_EVENT, address, [
      from,
      L1_ESCROW_ADDRESS_OPTIMISM,
      10000,
    ]);
    txEvent.setBlock(30);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("it returns findings for Orptimism transaction on Ether Transaction ", async () => {
    getBalanceOfOpt(100);
    mockProvider.setNetwork(ETHER_CHAINID);

    const l1Alert: Alert = {
      alertId: "FORTA-1",
      chainId: 1,
      hasAddress: (address: string) => true,
      metadata: {
        totalSupply: 1000,
        // abtEscBal: Number,
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
    handleTransaction = provideHandleTransaction(
      mockProvider as any,
      L2_DAI_OPTIMISM,
      mockAlert as any
    );
    txEvent = new TestTransactionEvent();

    txEvent.addEventLog(TRANSFER_EVENT, address, [
      from,
      L1_ESCROW_ADDRESS_OPTIMISM,
      10000,
    ]);
    txEvent.setBlock(30);
    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: `Scam Transaction Detected on Optimism DAI`,
        description: `Scam transaction occur on Optimism DAI Address. Total supply of 1000 is greater than Escrow balance of 100`,
        alertId: "OPTIMISM-2",
        severity: FindingSeverity.High,
        type: FindingType.Suspicious,
        metadata: {
          totalSupply: "1000",
          balance: "100",
        },
      }),
    ]);
  });

  it("It returns empty Findings on  non Deposit Event", async () => {
    mockProvider.setNetwork(OP_CHAINID);

    getTotalSupply();
    handleTransaction = provideHandleTransaction(
      mockProvider as any,
      L2_DAI_OPTIMISM,
      mockAlert as any
    );
    txEvent = new TestTransactionEvent().addEventLog(TRANSFER_EVENT, address, [
      from,
      to,
      50,
    ]);
    txEvent.setBlock(30);

    const findings = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  //   it("calls the eth transaction and returns empty findings", async()=>{
  //     txEvent = new TestTransactionEvent().addEventLog(TRANSFER_EVENT, address, [
  //         from,
  //         to,
  //         10
  //     ]);

  //     const findings = await ethTransaction(txEvent);
  //     expect(findings).toStrictEqual([]);
  // })
});
