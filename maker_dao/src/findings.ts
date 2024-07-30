import { Finding, FindingSeverity, FindingType } from "forta-agent";
import { L1_ARBITRUM_GATEWAY, OP_CHAINID, ARBI_CHAINID } from "./constant";

export const createFindings = (chainId: Number, data: Number): Finding => {
  return Finding.fromObject({
    name: `DAI Bridge Deposit Transaction`,
    description: `Deposit occur on DAI ${chainId} chainId bridge`,
    alertId: `${chainId === OP_CHAINID ? "OPTIMISM-1" : "ARBITRUM-1"}`,
    severity: FindingSeverity.Low,
    type: FindingType.Info,
    metadata: {
      totalSupply: data.toString(),
    },
  });
};
export const createLayer1Findings = (
  chainId: number,
  totalSupply: Number,
  Escrowbalance: Number
): Finding => {
  return Finding.fromObject({
    name: `Invariant Transaction Detected on ${
      chainId === ARBI_CHAINID ? "Arbitrium DAI" : "Optimism DAI"
    }`,
    description: `Invariant transaction occur on ${
      chainId === ARBI_CHAINID ? "Arbitrium" : "Optimism"
    } DAI Address. Total supply of ${totalSupply} is greater than Escrow balance of ${Escrowbalance}`,
    alertId: `${chainId === ARBI_CHAINID ? "ARBITRUM-2" : "OPTIMISM-2"}`,
    severity: FindingSeverity.High,
    type: FindingType.Suspicious,
    metadata: {
      totalSupply: totalSupply.toString(),
      balance: Escrowbalance.toString(),
    },
  });
};
