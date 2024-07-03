import { ethers } from "forta-agent";
export default class NetworkManager<T extends Record<any, any>> {
    private networkMap;
    private chainId;
    constructor(networkMap: Record<number, T>, chainId?: number);
    getNetworkMap(): Readonly<Record<number, T>>;
    getNetwork(): number;
    setNetwork(chainId: number): void;
    init(provider: ethers.providers.Provider): Promise<void>;
    get<K extends keyof T>(key: K): T[K];
}
