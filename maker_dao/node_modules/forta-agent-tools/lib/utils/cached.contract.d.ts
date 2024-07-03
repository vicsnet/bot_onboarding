import { ethers } from "forta-agent";
export default class CachedContract extends ethers.Contract {
    constructor(addressOrName: string, contractInterface: ethers.ContractInterface, provider: ethers.providers.Provider, cacheByBlockTag?: boolean);
    static from(contract: ethers.Contract, cacheByBlockTag?: boolean): ethers.Contract;
    static clearCache(): void;
}
