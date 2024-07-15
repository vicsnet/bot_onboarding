import { ethers } from "forta-agent";
import { ABI } from "./ABI";
import { L2ABI } from "./layer2ABI";

export const L1_DAI_CONTRACT_ADDRESS =
  "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export const L1_ESCROW_ADDRESS_OPTIMISM =
  "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";

export const L1_ESCROW_ADDRESS_ARBITRUM =
  "0xA10c7CE4b876998858b1a9E12b10092229539400";
export const L2_DAI_OPTIMISM = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
export const L2_DAI_ARBITRUM = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

export const L2_DAI_GATEWAY_ARB = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";

export const L1_AARBITRUM_GATEWAY =
  "0xD3B5b60020504bc3489D6949d545893982BA3011";

// i need to check the balance of L1 escrow to ensure that is >= to the total supply of L2 Escrow

export const TRANSFER_EVENT =
  "event Transfer(address indexed from, address indexed to, uint256 value)";
export const DEPOSIT_FINALISED_EVENT =
  "  event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)";

export const ETHER_CHAINID = 1;
export const OP_CHAINID = 10;
export const ARBI_CHAINID = 42161;

export const GET_DAI_BALANCE = async (
  provider: ethers.providers.JsonRpcProvider,
  escrowAddr: string,
  blockTag:Number
) => {
  const contract = new ethers.Contract(L1_DAI_CONTRACT_ADDRESS, ABI, provider);
  const balanceOf = await contract.balanceOf(escrowAddr, {blockTag});

  console.log(balanceOf);
  return balanceOf;
};

export const GET_TOTAL_SUPPLY = async (
  contractAddr: string,
  provider: ethers.providers.JsonRpcProvider,
  blockTag:Number
) => {
  const contract = new ethers.Contract(contractAddr, L2ABI, provider);
  const totalSupply = contract.totalSupply({blockTag});
  return totalSupply;
};