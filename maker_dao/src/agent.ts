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
} from "forta-agent";

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
  TRANSFER_EVENT,
  DEPOSIT_FINALISED_EVENT,
  ETHER_CHAINID,
  OP_CHAINID,
  ARBI_CHAINID,
  GET_DAI_BALANCE,
  GET_TOTAL_SUPPLY,
} from "./constant";

const PROVIDER = getEthersProvider();

const provideHandleTransaction =
  (
    provider: ethers.providers.JsonRpcProvider,
    contractAddr: string,
    botId: string,
    alertId: string
  ) =>
  async (txEvent: TransactionEvent) => {
    let findings: Finding[] = [];
    const transferEvent = txEvent.filterLog(TRANSFER_EVENT);
    console.log("event", txEvent);

    const network = await provider.getNetwork();
    // read the balance of l1 escrow
    const chainId = network.chainId;
    const DepositEvent = txEvent.filterLog(DEPOSIT_FINALISED_EVENT);

    if (chainId !== 1) {
      DepositEvent.forEach(async (deposit) => {
        const { l1Token, from, to, amount } = deposit.args;

        if (chainId === OP_CHAINID || chainId === ARBI_CHAINID) {
          const data = await GET_TOTAL_SUPPLY(contractAddr, provider);
          console.log(chainId);
          console.log("total supply", data.toString());
          findings.push(
            Finding.fromObject({
              name: `Deposit occur on ${chainId} bridge`,
              description: `h1`,
              alertId: "FORTA-1",
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
      });
    }

    if (chainId === 1) {
      console.log("ch", chainId);

     



      // console.log("al", JSON.stringify(alerts));
      const to_Adrress = txEvent.to;
      console.log("to_Adrress", txEvent.gasPrice);

      console.log("helo1");
      if (txEvent.to?.toLowerCase() === L1_AARBITRUM_GATEWAY.toLowerCase()) {
        console.log("event", txEvent.to.toString());
        const { alerts } = await getAlerts({
          botIds: [botId],
          alertId: alertId,
          chainId: chainId,
          first: 1,
        });
        transferEvent.forEach(async (e) => {
          if (alerts) {
            const totalSupply = await alerts[0].metadata.totalSupply;

            const Escrowbalance = await GET_DAI_BALANCE(
              provider,
              L1_ESCROW_ADDRESS_ARBITRUM
            );

            console.log("my Escrow", Escrowbalance);
            if (Escrowbalance >= totalSupply) {
              console.log("tSupply", totalSupply);
              return findings;
            } else {
              findings.push(
                Finding.fromObject({
                  name: `Deposit occur on ${chainId} bridge`,
                  description: ``,
                  alertId: "FORTA-1",
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
        });
      }

      if (txEvent.to === L1_ESCROW_ADDRESS_OPTIMISM) {
        const { alerts } = await getAlerts({
          botIds: [botId],
          alertId: alertId,
          chainId: chainId,
          first: 1,
        });
        transferEvent.forEach((e) => {
          if (alerts) {
            const totalSupply = alerts[0].metadata.totalSupply;

            const Escrowbalance = GET_DAI_BALANCE(
              provider,
              L1_ESCROW_ADDRESS_OPTIMISM
            );

            console.log(Escrowbalance);
            if (Escrowbalance >= totalSupply) {
              return findings;
            } else {
              findings.push(
                Finding.fromObject({
                  name: `Deposit occur on ${chainId} bridge`,
                  description: ``,
                  alertId: "FORTA-1",
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
        });
      }
    }
    return findings;
  };

export default {
  handleTransaction: provideHandleTransaction(
    provider,
    contractAddr,
    botId,
    alertId
  ),
};
