import {
  Finding,
  Alert,
  ethers,
  getEthersProvider,
  AlertsResponse,
  AlertQueryOptions,
  BlockEvent,
  HandleBlock,
} from "forta-agent";

import {
  L1_ESCROW_ADDRESS_OPTIMISM,
  L1_ESCROW_ADDRESS_ARBITRUM,
  OP_CHAINID,
  ARBI_CHAINID,
  L2_DAI,
} from "./constant";

import { getDaiBalance, getTotalSupply } from "./utils";
import { createFindings, createLayer1Findings } from "./findings";

let chainId: number;
let layer1TotalSupply: number;

export function provideInitialize(provider: ethers.providers.Provider) {
  return async function initialize() {
    const network = await provider.getNetwork();
    chainId = network.chainId;
  };
}

const alert: Alert = {
  alertId: "L1_ESCROW",
  chainId: ARBI_CHAINID,
  hasAddress: () => true,
  metadata: {
    totalSupply: Number,
    network: "Ethereum",
  },
};

const emptyAlertResponse: AlertsResponse = {
  alerts: [alert],
  pageInfo: { hasNextPage: false },
};

const query: AlertQueryOptions = { alertIds: ["L1_ESCROW"] };

export const provideHandleBlock =
  (
    provider: ethers.providers.JsonRpcProvider,
    getL1Alert: (alertQuery: AlertQueryOptions) => Promise<AlertsResponse>
  ): HandleBlock =>
  async (blockEvent: BlockEvent): Promise<Finding[]> => {
    let findings: Finding[] = [];

    if (chainId !== 1) {
      const data = await getTotalSupply(
        L2_DAI,
        provider,
        blockEvent.blockNumber
      );
      console.log("ddd", data);

      if (data !== layer1TotalSupply) {
        layer1TotalSupply = data;
        findings.push(createFindings(chainId, data));
      }
    } else {
      const { alerts } = await getL1Alert(query);

      let Escrowbalance;
      let totalSupply;
      let chain;

      if (alerts) {
        totalSupply = await alerts[0].metadata.totalSupply;
        chain = alerts[0].chainId;
        if (chain === OP_CHAINID) {
          Escrowbalance = await getDaiBalance(
            provider,
            L1_ESCROW_ADDRESS_OPTIMISM,
            blockEvent.blockNumber
          );
        } else {
          console.log("cccccdnpp", alerts[0]);

          Escrowbalance = await getDaiBalance(
            provider,
            L1_ESCROW_ADDRESS_ARBITRUM,
            blockEvent.blockNumber
          );
        }
      }
      if (Escrowbalance >= totalSupply) {
        return findings;
      } else {
        console.log(totalSupply.toString());

        if (chain !== undefined) {
          findings.push(
            createLayer1Findings(chain, totalSupply, Escrowbalance)
          );
        }
      }
    }

    return findings;
  };

export default {
  initialize: provideInitialize(getEthersProvider()),
  handleBlock: provideHandleBlock(
    getEthersProvider(),
    emptyAlertResponse as any
  ),
};
