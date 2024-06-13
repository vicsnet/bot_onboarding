import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  TransactionEvent,
} from "forta-agent";
import { TestTransactionEvent } from "forta-agent-tools/lib/test";

import bot from "./agent";
import {DEPLOYMENT_ADDRESS, NETEHRMIND_ADDRESS, CREATE_AGENT_FUNCTION, UPDATE_AGENT_FUNCTION} from './constant'
import { createAddress } from "forta-agent-tools";



describe("bot deployment / update function call", () => {
  let handleTransaction: HandleTransaction;

  beforeAll(() => {
    handleTransaction = bot.handleTransaction;
  });
  const agentId = 1;
  const by = createAddress("0xa13");
  const metadata = "lwlwdnd";
  const chainIds = [1];

  describe("handle all deployment", () => {
    it ("returns empty findings", async()=>{
        const txEvent = new TestTransactionEvent();
        const findings = await handleTransaction(txEvent);
        expect(findings).toStrictEqual([]);
    })
    it("returns create agent function findings", async () => {
      const txEvent: TransactionEvent = new TestTransactionEvent()
        .setFrom(NETEHRMIND_ADDRESS)
        .setTo(DEPLOYMENT_ADDRESS)
        .addTraces({
          function: CREATE_AGENT_FUNCTION,
          to: DEPLOYMENT_ADDRESS,
          from: NETEHRMIND_ADDRESS,
          arguments: [agentId, by, metadata, chainIds],
        });
      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: `Nethermind Forta BOT Created`,
          description: `New Bot has been deployed by the Nethermind team`,
          alertId: "FORTA-1",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
        }),
      ]);
    });
    it("returns update agent function findings", async () => {
      const txEvent: TransactionEvent = new TestTransactionEvent()
        .setFrom(NETEHRMIND_ADDRESS)
        .setTo(DEPLOYMENT_ADDRESS)
        .addTraces({
          function: UPDATE_AGENT_FUNCTION,
          to: DEPLOYMENT_ADDRESS,
          from: NETEHRMIND_ADDRESS,
          arguments: [agentId, metadata, chainIds],
        });
      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: `Nethermind Forta BOT Updated`,
          description: "Bot has been updated by the Nethermind team",
          alertId: "FORTA-2",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
        }),
      ]);
    });
    it ("returns empty findings from wrong address", async()=>{
        const txEvent: TransactionEvent = new TestTransactionEvent()
        .setFrom(by)
        .setTo(DEPLOYMENT_ADDRESS)
        .addTraces({
          function: UPDATE_AGENT_FUNCTION,
          to: DEPLOYMENT_ADDRESS,
          from: NETEHRMIND_ADDRESS,
          arguments: [agentId, metadata, chainIds],
        });
        const findings = await handleTransaction(txEvent);
        expect(findings).toStrictEqual([]);
    })
  });
});
