import { Interface } from "@ethersproject/abi";
import MockEthersProvider from "./mock_ethers_provider";
export default class MockEthersSigner {
    readonly _isSigner: boolean;
    readonly provider: MockEthersProvider;
    getAddress: any;
    sendTransaction: any;
    constructor(provider: MockEthersProvider);
    call(txData: any, block: number | string): any;
    getBlock(num: number): any;
    getSigner(signer: string): any;
    getStorageAt(contract: string, slot: number, block: number): any;
    getBlockNumber(): any;
    setAddress(addr: string): MockEthersSigner;
    allowTransaction(from: string, to: string, iface: Interface, id: string, values: any[], receipt: any): MockEthersSigner;
    denyTransaction(from: string, to: string, iface: Interface, id: string, values: any[], message?: any): MockEthersSigner;
    clear(): void;
}
