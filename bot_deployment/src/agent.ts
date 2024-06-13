import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";
import {DEPLOYMENT_ADDRESS, NETEHRMIND_ADDRESS, CREATE_AGENT_FUNCTION, UPDATE_AGENT_FUNCTION} from './constant'



const provideHandleTransaction = async (
  txEvent: TransactionEvent
)=> {
  const findings: Finding[] = [];

  if (txEvent.from !== NETEHRMIND_ADDRESS.toLocaleLowerCase()){
      console.log("Wrong Address:", txEvent.from)
      return findings;
  }

  const functionCalls = txEvent.filterFunction([CREATE_AGENT_FUNCTION, UPDATE_AGENT_FUNCTION], DEPLOYMENT_ADDRESS);


  if (!functionCalls) {
      return findings;
    }

    functionCalls.forEach((funcCalls) =>{
      const funcAgentName = funcCalls.name;

      findings.push(
          Finding.fromObject({
              name: `Nethermind Forta BOT ${
                  funcAgentName === "createAgent" ? "Created" : "Updated"
                }`,
                description: `${
                  funcAgentName == "createAgent"
                    ? "New Bot has been deployed by the Nethermind team"
                    : "Bot has been updated by the Nethermind team"
                }`,
                alertId: `${funcAgentName == "createAgent" ? "FORTA-1" : "FORTA-2"}`,
                severity: FindingSeverity.Low,
                type: FindingType.Info,
          })
      )
  })
  return findings;
}

export default {

  handleTransaction:provideHandleTransaction,

};