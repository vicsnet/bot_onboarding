import { TransactionEvent, ethers, BlockEvent } from "forta-agent";
import { Handler, HandlerOptions } from "./handler";
declare namespace EthTransfers {
    interface Options {
        from?: string;
        to?: string;
        valueThreshold?: ethers.BigNumberish | ((value: ethers.BigNumber) => boolean);
    }
    interface Metadata {
        from: string;
        to: string;
        value: ethers.BigNumber;
    }
}
declare class EthTransfers extends Handler<EthTransfers.Options, EthTransfers.Metadata> {
    isLarge: (value: ethers.BigNumber) => boolean;
    constructor(options: HandlerOptions<EthTransfers.Options, EthTransfers.Metadata>);
    metadata(event: TransactionEvent | BlockEvent): Promise<EthTransfers.Metadata[] | null>;
}
export default EthTransfers;
