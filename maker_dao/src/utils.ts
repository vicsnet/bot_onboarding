import { ethers } from "forta-agent";
import { ABI } from "./ABI";
import { L2ABI } from "./layer2ABI";
import { L1_DAI_CONTRACT_ADDRESS } from "./constant";
export const getDaiBalance = async (
  provider: ethers.providers.JsonRpcProvider,
  escrowAddr: string,
  blockTag: number
) => {
  const contract = new ethers.Contract(L1_DAI_CONTRACT_ADDRESS, ABI, provider);
  const balanceOf = await contract.balanceOf(escrowAddr, {
    blockTag: blockTag,
  });
  return balanceOf;
};

export const getTotalSupply = async (
  contractAddr: string,
  provider: ethers.providers.JsonRpcProvider,
  blockTag: Number
) => {
  const contract = new ethers.Contract(contractAddr, L2ABI, provider);
  const totalSupply = await contract.totalSupply({ blockTag });

  return totalSupply;
};
