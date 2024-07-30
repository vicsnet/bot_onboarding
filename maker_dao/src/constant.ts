export const L1_DAI_CONTRACT_ADDRESS =
  "0x6B175474E89094C44Da98b954EedeAC495271d0F";

export const L1_ESCROW_ADDRESS_OPTIMISM =
  "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";

export const L1_ESCROW_ADDRESS_ARBITRUM =
  "0xA10c7CE4b876998858b1a9E12b10092229539400";
export const L2_DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
export const L2_DAI_ARBITRUM = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";

export const L2_DAI_GATEWAY_ARB = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";

export const L1_ARBITRUM_GATEWAY =
  "0xD3B5b60020504bc3489D6949d545893982BA3011";

// i need to check the balance of L1 escrow to ensure that is >= to the total supply of L2 Escrow

export const TRANSFER_EVENT =
  ["event Transfer(address indexed from, address indexed to, uint256 value)"];
export const DEPOSIT_FINALISED_EVENT =
  ["event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)"];

export const ETHER_CHAINID = 1;
export const OP_CHAINID = 10;
export const ARBI_CHAINID = 42161;
