import { ethers } from "forta-agent";
export interface ProviderCacheOptions {
    blockDataCacheSize: number;
    immutableDataCacheSize: number;
}
export declare class ProviderCache {
    private static blockDataCache?;
    private static immutableDataCache?;
    private static blockDataCacheMutex;
    private static immutableDataCacheMutex;
    private static options;
    static createProxy<T extends ethers.providers.BaseProvider>(provider: T, cacheByBlockTag?: boolean): T;
    private static isTransactionCacheable;
    private static computeCacheKey;
    private static outputToBuffer;
    private static bufferToOutput;
    private static call;
    private static updateBlockDataCache;
    private static updateImmutableDataCache;
    static clear(): void;
    static set(options: Partial<ProviderCacheOptions>): void;
}
