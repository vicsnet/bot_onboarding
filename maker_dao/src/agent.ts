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
  TRANSFER_EVENT,
  DEPOSIT_FINALISED_EVENT,
  ETHER_CHAINID,
  OP_CHAINID,
  ARBI_CHAINID,
  GET_DAI_BALANCE,
  GET_TOTAL_SUPPLY,
} from "./constant";
import { log } from "console";

const PROVIDER = getEthersProvider();
const AlertId = "1";
const BotId = "2";

export const provideHandleTransaction =
  (
    provider: ethers.providers.JsonRpcProvider,
    contractAddr: string,
    botId: string,
    alertId: string
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
        console.log("block Tag ", blockTag);

        if (chainId === OP_CHAINID || chainId === ARBI_CHAINID) {
          console.log("chain iddd ", chainId);

          const data = await GET_TOTAL_SUPPLY(contractAddr, provider, blockTag);

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
      }
    }

    if (chainId === 1) {
    
      console.log(transferEvent[0].args.to);
      
      
      if (transferEvent[0].args.to?.toLowerCase() === L1_AARBITRUM_GATEWAY.toLowerCase()) {
        console.log("aA");

        const { alerts } = await getAlerts({
          botIds: [botId],
          alertId: alertId,
          chainId: chainId,
          first: 1,
        });
        console.log("aaa", alerts)
        console.log("my alerts");
        for (const transfer of transferEvent ) {
          
            if (alerts) {
              const totalSupply = await alerts[0].metadata.totalSupply;
              console.log("tt", totalSupply);
              
              const blockTag = await txEvent.blockNumber;
              const Escrowbalance = await GET_DAI_BALANCE(
                provider,
                L1_ESCROW_ADDRESS_ARBITRUM,
                blockTag
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
        
        }
      }

      if (txEvent.to === L1_ESCROW_ADDRESS_OPTIMISM) {
        const { alerts } = await getAlerts({
          botIds: [botId],
          alertId: alertId,
          chainId: chainId,
          first: 1,
        });
        transferEvent.forEach(async (e) => {
          if (alerts) {
            const totalSupply = alerts[0].metadata.totalSupply;
            const blockTag = await txEvent.blockNumber;
            const Escrowbalance = GET_DAI_BALANCE(
              provider,
              L1_ESCROW_ADDRESS_OPTIMISM,
              blockTag
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
    PROVIDER,
    L2_DAI_GATEWAY_ARB,
    BotId,
    AlertId
  ),
};
