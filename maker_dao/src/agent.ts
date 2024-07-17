import {
  BlockEvent,
  Finding,
  Initialize,
  HandleBlock,
  HealthCheck,
  HandleTransaction,
  HandleAlert,
  AlertEvent,
  Alert,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  getJsonRpcUrl,
  ethers,
  getAlerts,
  getEthersProvider,
  AlertsResponse,
  AlertQueryOptions,
} from "forta-agent";

import {
  L1_DAI_CONTRACT_ADDRESS,
  L1_ESCROW_ADDRESS_OPTIMISM,
  L1_ESCROW_ADDRESS_ARBITRUM,
  L2_DAI_OPTIMISM,
  L2_DAI_ARBITRUM,
  L2_DAI_GATEWAY_ARB,
  L1_AARBITRUM_GATEWAY,
  TRANSFER_EVENT,
  DEPOSIT_FINALISED_EVENT,
  ETHER_CHAINID,
  OP_CHAINID,
  ARBI_CHAINID,
  GET_DAI_BALANCE,
  GET_TOTAL_SUPPLY,
} from "./constant";

const PROVIDER = getEthersProvider();


const alert: Alert = {
  alertId: "L1_ESCROW",
  chainId: 1,
  hasAddress: () => true,
  metadata: {
    totalSupply: Number,
    network: "Ethereum",
  },
};

// Default response structure for alert queries
const emptyAlertResponse: AlertsResponse = {
  alerts: [alert],
  pageInfo: { hasNextPage: false },
};

const query: AlertQueryOptions = { alertIds: ["L1_ESCROW"] };

export const provideHandleTransaction =
  (
    provider: ethers.providers.JsonRpcProvider,
    contractAddr: string,
    getL1Alert: (alertQuery: AlertQueryOptions) => Promise<AlertsResponse>
  ) =>
  async (txEvent: TransactionEvent) => {
    let findings: Finding[] = [];
    const transferEvent = txEvent.filterLog(TRANSFER_EVENT);

    const network = await provider.getNetwork();

    const chainId = network.chainId;
    const DepositEvent = txEvent.filterLog(DEPOSIT_FINALISED_EVENT);

    if (chainId !== 1) {
      for (const deposit of DepositEvent) {
        const { l1Token, from, to, amount } = deposit.args;
        const blockTag = txEvent.blockNumber;

        if (chainId === OP_CHAINID || chainId === ARBI_CHAINID) {
          const data = await GET_TOTAL_SUPPLY(contractAddr, provider, blockTag);

          findings.push(
            Finding.fromObject({
              name: `DAI Bridge Deposit Transaction`,
              description: `Deposit occur on DAI ${chainId} chainId bridge`,
              alertId: `${
                chainId === OP_CHAINID ? "OPTIMISM-1" : "ARBITRUM-1"
              }`,
              severity: FindingSeverity.Low,
              type: FindingType.Info,
              metadata: {
                totalSupply: data.toString(),
                amount: amount.toString(),
                from: from,
                to: to,
              },
            })
          );
        }
      }
    }

    if (chainId === ETHER_CHAINID) {
      if (transferEvent[0]) {
        const toAddress = transferEvent[0].args?.to?.toLowerCase();

        const { alerts } = await getL1Alert(query);

        for (const transfer of transferEvent) {
          if (alerts) {
            const totalSupply = await alerts[0].metadata.totalSupply;

            const blockTag = await txEvent.blockNumber;
            let Escrowbalance;
            let a;
            if (toAddress === L1_AARBITRUM_GATEWAY.toLowerCase()) {
              Escrowbalance = await GET_DAI_BALANCE(
                provider,
                L1_ESCROW_ADDRESS_ARBITRUM,
                blockTag
              );
            } else if (toAddress === L1_ESCROW_ADDRESS_OPTIMISM.toLowerCase()) {
              Escrowbalance = await GET_DAI_BALANCE(
                provider,
                L1_ESCROW_ADDRESS_OPTIMISM,
                blockTag
              );
            } else {
              return findings;
            }

            if (Escrowbalance >= totalSupply) {
              return findings;
            } else {
              findings.push(
                Finding.fromObject({
                  name: `Scam Transaction Detected on ${
                    toAddress === L1_AARBITRUM_GATEWAY.toLowerCase()
                      ? "Arbitrium DAI"
                      : "Optimism DAI"
                  }`,
                  description: `Scam transaction occur on ${
                    toAddress === L1_AARBITRUM_GATEWAY.toLowerCase()
                      ? "Arbitrium"
                      : "Optimism"
                  } DAI Address. Total supply of ${totalSupply} is greater than Escrow balance of ${Escrowbalance}`,
                  alertId: `${
                    toAddress === L1_AARBITRUM_GATEWAY.toLowerCase()
                      ? "ARBITRUM-2"
                      : "OPTIMISM-2"
                  }`,
                  severity: FindingSeverity.High,
                  type: FindingType.Suspicious,
                  metadata: {
                    totalSupply: totalSupply.toString(),
                    balance: Escrowbalance.toString(),
                  },
                })
              );
            }
          }
        }
      }
    }

    return findings;
  };

export default {
  handleTransaction: provideHandleTransaction(
    PROVIDER,
    L2_DAI_GATEWAY_ARB,
    emptyAlertResponse as any
  ),
};
