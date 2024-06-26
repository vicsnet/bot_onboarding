import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
  ethers,
} from "forta-agent";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import {
  L1_DAI_CONTRACT_ADDRESS,
  L1_ESCROW_ADDRESS_OPTIMISM,
  L1_ESCROW_ADDRESS_ARBITRUM,
  L2_DAI_OPTIMISM,
  L2_DAI_ARBITRUM,
  L2_DAI_GATEWAY_ARB,
  L1_AARBITRUM_GATEWAY,
  PROVIDER_EThereum,
  PROVIDER_OP,
  PROVIDER_ARBI,
  DEPOSIT_FINALISED_EVENT,
  GET_TOTAL_SUPPLY,
  TRANSFER_EVENT
} from "./constant";
import agent from "./agent";
import { createAddress } from "forta-agent-tools";

describe("Dai briged", () => {
    let { handleTransaction: arbTransaction } = agent(
      PROVIDER_ARBI,
      L2_DAI_ARBITRUM,
      "",
      ""
    );
    let { handleTransaction: opTransaction } = agent(
      PROVIDER_OP,
      L2_DAI_ARBITRUM,
      "",
      ""
    );
    let { handleTransaction: ethTransaction } = agent(
      PROVIDER_EThereum,
      L2_DAI_ARBITRUM,
      "1",
      "4"
    );
  let txEvent: TestTransactionEvent;


  
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
  it("returns transaction calls for deposit finalised result", async () => {
    txEvent = new TestTransactionEvent().addEventLog(
      DEPOSIT_FINALISED_EVENT,
      address,
      [l1Token, from, to, 10]
    );

    console.log('test',txEvent);
    
    const findings = await arbTransaction(txEvent);
    const totalSupply = await GET_TOTAL_SUPPLY(L2_DAI_ARBITRUM, PROVIDER_ARBI);
    expect(findings).toStrictEqual([
      Finding.fromObject({
        name: `Deposit occur on 42161 bridge`,
        description: `h1`,
        alertId: "FORTA-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        metadata: {
          totalSupply: totalSupply.toString(),
          amount: "10",
          from: from,
          to: to,
        },
      }),
    ]);
   
  });
  it("calls the eth transaction and returns empty findings", async()=>{
    txEvent = new TestTransactionEvent().addEventLog(TRANSFER_EVENT, address, [
        from,
        to,
        10
    ]);

    const findings = await ethTransaction(txEvent);
    expect(findings).toStrictEqual([]);
})
});
